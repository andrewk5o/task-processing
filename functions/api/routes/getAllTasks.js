const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

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

module.exports = {
    getAllTasks,
};
