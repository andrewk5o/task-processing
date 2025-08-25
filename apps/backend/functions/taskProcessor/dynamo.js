const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());

async function getTask(taskId) {
    const { Item } = await dynamoDb.send(new GetCommand({
        TableName: process.env.TASKS_TABLE,
        Key: {
            taskId: taskId
        }
    }));

    return Item;
}

async function updateTaskToProcessed(taskId) {
    await dynamoDb.send(new UpdateCommand({
        TableName: process.env.TASKS_TABLE,
        Key: {
            taskId: taskId
        },
        UpdateExpression: 'SET #status = :status, #errorMessage = :errorMessage',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#errorMessage': 'errorMessage'
        },
        ExpressionAttributeValues: {
            ':status': 'Processed',
            ':errorMessage': null
        }
    }));
}

async function updateTaskToFailed(taskId, retryCount, errorMessage) {
    await dynamoDb.send(new UpdateCommand({
        TableName: process.env.TASKS_TABLE,
        Key: {
            taskId: taskId
        },
        UpdateExpression: 'SET #status = :status, #retries = :retries, #errorMessage = :errorMessage',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#retries': 'retries',
            '#errorMessage': 'errorMessage'
        },
        ExpressionAttributeValues: {
            ':status': 'Failed',
            ':retries': retryCount,
            ':errorMessage': errorMessage
        }
    }));
}

module.exports = {
    getTask,
    updateTaskToProcessed,
    updateTaskToFailed
};
