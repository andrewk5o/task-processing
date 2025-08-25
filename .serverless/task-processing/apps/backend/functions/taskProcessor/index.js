const { simulateTaskProcessing } = require('./utils');
const { getTask, updateTaskToProcessed, updateTaskToFailed } = require('./dynamo');


exports.handler = async (event) => {
    try {
        console.log('=== TASK PROCESSOR STARTED ===');
        console.log('Event:', JSON.stringify(event, null, 2));

        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);
            const taskId = messageBody.taskId;

            if (!taskId) {
                console.error('No taskId found in message:', messageBody);
                continue;
            }

            console.log(`Processing task: ${taskId}`);

            const Item = await getTask(taskId);

            if (!Item) {
                console.error(`Task with ID ${taskId} not found in DynamoDB`);
                continue;
            }

            console.log(`Task found: ${Item.taskId}, current retries: ${Item.retries || 0}`);

            try {
                await simulateTaskProcessing(Item.taskId);

                await updateTaskToProcessed(Item.taskId);

            } catch (processingError) {
                const newRetryCount = (Item.retries || 0) + 1;
                await updateTaskToFailed(Item.taskId, newRetryCount, processingError.message);
                console.log(`Task ${Item.taskId} failed - status updated to 'Failed', retry count: ${newRetryCount}, error: ${processingError.message}`);

                throw processingError;
            }
        }

        console.log('Successfully processed all messages');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Messages processed successfully' })
        };

    } catch (error) {
        console.error('Error in task processor:', error);

        throw error;
    }
};
