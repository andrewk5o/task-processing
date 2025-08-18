const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());

exports.handler = async (event) => {
    try {
        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);
            console.log('Processing message:', messageBody);

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

            if (Item) {
                console.log('=== TASK PROCESSING SUMMARY ===');
                console.log(`Task ID: ${Item.taskId}`);
                console.log(`Status: ${Item.status}`);
                console.log(`Answer: ${Item.answer}`);
                console.log(`Error Message: ${Item.errorMessage}`);
                console.log(`Retries: ${Item.retries}`);
                console.log('================================');

            } else {
                console.error(`Task with ID ${taskId} not found in DynamoDB`);
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
