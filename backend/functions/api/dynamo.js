const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());

async function createTask(taskItem) {
    await dynamoDb.send(new PutCommand({
        TableName: process.env.TASKS_TABLE,
        Item: taskItem
    }));
}

async function getAllTasks() {
    const { Items } = await dynamoDb.send(new QueryCommand({
        TableName: process.env.TASKS_TABLE,
    }));

    return Items || [];
}

module.exports = {
    createTask,
    getAllTasks
};
