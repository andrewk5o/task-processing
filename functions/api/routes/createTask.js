const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const dynamoClient = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sqsClient = new SQSClient();

async function sendTaskMessage(taskId) {
    try {
        const messageBody = {
            taskId,
            timestamp: new Date().toISOString()
        };

        const messageParams = {
            QueueUrl: process.env.TASKS_QUEUE_URL,
            MessageBody: JSON.stringify(messageBody)
        };

        const result = await sqsClient.send(new SendMessageCommand(messageParams));
        console.log(`Message sent to SQS queue:`, result.MessageId);
        return result;
    } catch (error) {
        console.error('Error sending message to SQS queue:', error);
        throw error;
    }
}

const createTask = async (req, res) => {
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

        await docClient.send(new PutCommand({
            TableName: process.env.TASKS_TABLE,
            Item: taskItem
        }));

        await sendTaskMessage(taskId);

        res.status(201).json({
            message: "Task created and queued for processing",
            taskId,
            status: "Pending",
            queueUrl: process.env.TASKS_QUEUE_URL,
            task: taskItem
        });

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: "Could not create task" });
    }
};

module.exports = {
    createTask,
};
