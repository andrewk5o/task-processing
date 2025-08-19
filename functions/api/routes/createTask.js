const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { createTask } = require("../dynamo");

const sqsClient = new SQSClient();

async function sendTaskMessage(taskId) {
    try {
        const messageBody = {
            taskId,
            timestamp: new Date().toISOString()
        };

        const result = await sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.TASKS_QUEUE_URL,
            MessageBody: JSON.stringify(messageBody)
        }));

        console.log(`Message sent to SQS queue:`, result.MessageId);
        return result;
    } catch (error) {
        console.error('Error sending message to SQS queue:', error);
        throw error;
    }
}

const createTaskHandler = async (req, res) => {
    const { taskId, answer } = req.body;

    if (typeof taskId !== "string") {
        return res.status(400).json({ error: '"taskId" must be a string' });
    } else if (typeof answer !== "string") {
        return res.status(400).json({ error: '"answer" must be a string' });
    }

    try {
        const taskItem = {
            taskId,
            answer,
            status: "Pending",
            retries: 0,
            errorMessage: null
        };

        await createTask(taskItem);

        await sendTaskMessage(taskId);

        res.status(201).json(taskItem);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: "Could not create task" });
    }
};

module.exports = createTaskHandler;
