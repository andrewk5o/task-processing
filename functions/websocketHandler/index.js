const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient());
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE || 'websocket-connections';

exports.handler = async (event) => {
    const { routeKey, connectionId } = event.requestContext;
    const body = event.body ? JSON.parse(event.body) : {};

    try {
        switch (routeKey) {
            case '$connect':
                return await handleConnect(connectionId);

            case '$disconnect':
                return await handleDisconnect(connectionId);

            case '$default':
                return await handleDefault(body);

            default:
                console.log(`Unknown route: ${routeKey}`);
                return { statusCode: 400, body: 'Unknown route' };
        }
    } catch (error) {
        console.error('Error handling WebSocket event:', error);
        return { statusCode: 500, body: 'Internal server error' };
    }
};

async function handleConnect(connectionId) {
    try {
        await dynamoDb.send(new PutCommand({
            TableName: CONNECTIONS_TABLE,
            Item: {
                connectionId,
                connectedAt: new Date().toISOString(),
                status: 'active'
            }
        }));

        console.log(`New connection established: ${connectionId}`);

        return {
            statusCode: 200,
            body: 'Connected'
        };
    } catch (error) {
        console.error('Error handling connect:', error);
        return { statusCode: 500, body: 'Failed to establish connection' };
    }
}

async function handleDisconnect(connectionId) {
    try {
        await dynamoDb.send(new DeleteCommand({
            TableName: CONNECTIONS_TABLE,
            Key: { connectionId }
        }));

        console.log(`Connection disconnected: ${connectionId}`);
        return { statusCode: 200, body: 'Disconnected' };
    } catch (error) {
        console.error('Error handling disconnect:', error);
        return { statusCode: 500, body: 'Error during disconnect' };
    }
}

async function handleDefault(body) {
    try {
        const { action } = body;

        return {
            statusCode: 200,
            body: JSON.stringify({
                event: 'actionProcessed',
                action,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error handling default message:', error);
        return { statusCode: 500, body: 'Error processing message' };
    }
}
