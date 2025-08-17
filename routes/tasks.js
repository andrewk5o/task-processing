const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// Get all tasks
const getAllTasks = async (req, res) => {
    const params = {
        TableName: TASKS_TABLE,
    };

    try {
        const command = new ScanCommand(params);
        const { Items } = await docClient.send(command);
        res.json({ tasks: Items || [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retrieve tasks" });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    const params = {
        TableName: TASKS_TABLE,
        Key: {
            taskId: req.params.taskId,
        },
    };

    try {
        const command = new GetCommand(params);
        const { Item } = await docClient.send(command);
        if (Item) {
            const { taskId, answer } = Item;
            res.json({ taskId, answer });
        } else {
            res
                .status(404)
                .json({ error: 'Could not find task with provided "taskId"' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retrieve task" });
    }
};

// Create new task
const createTask = async (req, res) => {
    const { taskId, answer } = req.body;
    if (typeof taskId !== "string") {
        res.status(400).json({ error: '"taskId" must be a string' });
    } else if (typeof answer !== "string") {
        res.status(400).json({ error: '"name" must be a string' });
    }

    const params = {
        TableName: TASKS_TABLE,
        Item: { taskId, answer, status: "pending", retries: 0, errorMessage: null },
    };

    try {
        const command = new PutCommand(params);
        await docClient.send(command);
        res.status(201).json({ taskId, answer, status: "pending", retries: 0, errorMessage: null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not create task" });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
};
