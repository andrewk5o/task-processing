const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE || 'websocket-connections';

async function getAllActiveConnections() {
    try {
        const { Items } = await dynamoDb.send(new ScanCommand({
            TableName: CONNECTIONS_TABLE,
        }));

        return Items || [];
    } catch (error) {
        console.error('Error getting connections:', error);
        return [];
    }
}

async function removeInactiveConnection(connectionId) {
    try {
        await dynamoDb.send(new DeleteCommand({
            TableName: CONNECTIONS_TABLE,
            Key: {
                connectionId
            }
        }));

        console.log(`Removed inactive connection ${connectionId} from connections table`);
    } catch (error) {
        console.error('Error removing inactive connection:', error);
    }
}

module.exports = {
    getAllActiveConnections,
    removeInactiveConnection
};
