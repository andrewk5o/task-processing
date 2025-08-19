const { ApiGatewayManagementApiClient } = require('@aws-sdk/client-apigatewaymanagementapi');
const {
    sendTaskNotifications
} = require('./utils');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

exports.handler = async (event) => {
    const endpoint = process.env.WEBSOCKET_ENDPOINT;
    if (!endpoint) {
        console.error('WEBSOCKET_ENDPOINT environment variable not set');
        return;
    }

    console.log(`Using WebSocket endpoint: ${endpoint}`);

    const apiGateway = new ApiGatewayManagementApiClient({
        endpoint: endpoint
    });

    let processedCount = 0;
    let errorCount = 0;

    for (const record of event.Records) {
        try {
            if (record.eventName === 'INSERT' || record.eventName === 'MODIFY' || record.eventName === 'REMOVE') {
                const taskId = record.dynamodb.Keys.taskId.S;
                const newImage = unmarshall(record.dynamodb.NewImage);
                const oldImage = unmarshall(record.dynamodb.OldImage);

                const notification = {
                    event: 'taskUpdated',
                    taskId,
                    operation: record.eventName,
                    timestamp: new Date().toISOString(),
                    data: {
                        new: newImage,
                        old: oldImage
                    }
                };

                console.log(`Task ${taskId} updated - notification prepared:`, notification.event);
                console.table([notification.data.old, notification.data.new])
                await sendTaskNotifications(apiGateway, taskId, notification);

                processedCount++;
            }
        } catch (error) {
            console.error('Error processing stream record:', error);
            errorCount++;
        }
    }

    console.log(`Stream processing complete. Processed: ${processedCount}, Errors: ${errorCount}`);
    return { processedCount, errorCount };
};
