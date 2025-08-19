const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, GetQueueAttributesCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());


exports.handler = async (event) => {
    try {
        console.log('=== DLQ MONITOR STARTED ===');

        // Get DLQ message count
        const queueAttributes = await sqs.send(new GetQueueAttributesCommand({
            QueueUrl: process.env.TASKS_DLQ_URL,
            AttributeNames: ['ApproximateNumberOfMessages']
        }));

        const messageCount = parseInt(queueAttributes.Attributes.ApproximateNumberOfMessages || '0');
        console.log(`DLQ Status: ${messageCount} failed messages`);

        if (messageCount === 0) {
            console.log('No failed messages in DLQ');
            return { message: 'DLQ is empty' };
        }

        // Process up to 10 failed messages
        const receiveResult = await sqs.send(new ReceiveMessageCommand({
            QueueUrl: process.env.TASKS_DLQ_URL,
            MaxNumberOfMessages: Math.min(messageCount, 10),
            WaitTimeSeconds: 1
        }));

        if (!receiveResult.Messages || receiveResult.Messages.length === 0) {
            console.log('No messages received from DLQ');
            console.log(`=== DLQ MONITOR COMPLETE ===`);

            return { message: 'No messages received' };
        }

        let processedCount = 0;

        for (const message of receiveResult.Messages) {
            try {
                const messageBody = JSON.parse(message.Body);
                const taskId = messageBody.taskId;

                const { Item } = await dynamoDb.send(new GetCommand({
                    TableName: process.env.TASKS_TABLE,
                    Key: { taskId }
                }));

                console.log(JSON.stringify({
                    event: "FailedTask",
                    taskId,
                    taskStatus: Item.status,
                    taskAnswer: Item.answer,
                    taskRetries: Item.retries,
                    errorMessage: Item.errorMessage,
                    timestamp: new Date().toISOString()
                }));

                processedCount++;

            } catch (error) {
                console.error('Error processing message:', error);
            }
        }

        console.log(`=== DLQ MONITOR COMPLETE ===`);

        return {
            message: 'DLQ monitoring complete',
            processed: processedCount,
            remaining: messageCount - processedCount
        };

    } catch (error) {
        console.error('Error in DLQ monitor:', error);
        throw error;
    }
};
