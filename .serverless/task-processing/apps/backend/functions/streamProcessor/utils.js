const { PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');
const { getAllActiveConnections, removeInactiveConnection } = require('./dynamo');

async function sendToConnection(apiGateway, connectionId, notification) {
    try {
        await apiGateway.send(new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify(notification)
        }));
        console.log(`Notification sent to connection ${connectionId}`);
    } catch (error) {
        if (error.name === 'GoneException') {
            console.log(`Connection ${connectionId} is no longer active, removing from active connections`);
            await removeInactiveConnection(connectionId);
        } else {
            console.error(`Error sending to connection ${connectionId}:`, error);
        }
    }
}

async function sendTaskNotifications(apiGateway, taskId, notification) {
    try {
        const allConnections = await getAllActiveConnections();

        console.log(`Broadcasting to ${allConnections.length} active connections for task ${taskId}`);

        for (const connection of allConnections) {
            await sendToConnection(apiGateway, connection.connectionId, notification);
        }

    } catch (error) {
        console.error('Error sending task notifications:', error);
    }
}

module.exports = {
    sendToConnection,
    sendTaskNotifications
};
