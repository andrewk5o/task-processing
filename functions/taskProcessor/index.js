const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { simulateTaskProcessing } = require('./utils');
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());
const sqs = new SQSClient();

exports.handler = async (event) => {
    try {
        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);

            const taskId = messageBody.taskId;

            if (!taskId) {
                console.error('No taskId found in message:', messageBody);
                continue;
            }

            const { Item } = await dynamoDb.send(new GetCommand({
                TableName: process.env.TASKS_TABLE,
                Key: {
                    taskId: taskId
                }
            }));

            if (!Item) {
                console.error(`Task with ID ${taskId} not found in DynamoDB`);
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: 'Task not found',
                        taskId: taskId
                    })
                };
            }

            const isSuccessful = await simulateTaskProcessing(Item.taskId, Item.retries || 0);

            if (isSuccessful) {
                await dynamoDb.send(new UpdateCommand({
                    TableName: process.env.TASKS_TABLE,
                    Key: {
                        taskId: Item.taskId
                    },
                    UpdateExpression: 'SET #status = :status',
                    ExpressionAttributeNames: {
                        '#status': 'status'
                    },
                    ExpressionAttributeValues: {
                        ':status': 'Processed'
                    }
                }));
                console.log(`Task ${Item.taskId} status updated to 'Processed'`);
            } else {
                const newRetryCount = Item.retries + 1;
                if (newRetryCount >= 2) {
                    console.log(`Task ${Item.taskId} sent to Dead Letter Queue (max retries exceeded: ${newRetryCount})`);

                    await sqs.send(new SendMessageCommand({
                        QueueUrl: process.env.TASKS_DLQ_URL,
                        MessageBody: JSON.stringify({
                            taskId: Item.taskId,
                            originalMessage: messageBody,
                            failureReason: 'Max retries exceeded',
                            retryCount: newRetryCount,
                            timestamp: new Date().toISOString()
                        })
                    }));

                    console.log(`Task ${Item.taskId} successfully sent to DLQ`);
                } else {
                    console.log(`Task ${Item.taskId} returned to queue for retry attempt ${newRetryCount}`);

                    await dynamoDb.send(new UpdateCommand({
                        TableName: process.env.TASKS_TABLE,
                        Key: {
                            taskId: Item.taskId
                        },
                        UpdateExpression: 'SET #status = :status, #retries = :retries',
                        ExpressionAttributeNames: {
                            '#status': 'status',
                            '#retries': 'retries'
                        },
                        ExpressionAttributeValues: {
                            ':status': 'Failed',
                            ':retries': newRetryCount
                        }
                    }));

                    await sqs.send(new SendMessageCommand({
                        QueueUrl: process.env.TASKS_QUEUE_URL,
                        MessageBody: JSON.stringify({
                            taskId: Item.taskId,
                            originalMessage: messageBody,
                            failureReason: 'Failed to process task',
                            retryCount: newRetryCount,
                            timestamp: new Date().toISOString()
                        })
                    }));
                }
            }
        }

        console.log('Successfully processed all messages');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Messages processed successfully' })
        };

    } catch (error) {
        console.error('Error processing messages:', error);
        throw error;
    }
};
