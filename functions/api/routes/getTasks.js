const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const TASKS_TABLE = process.env.TASKS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const getTasks = async (req, res) => {
    try {
        const { Items } = await docClient.send(new ScanCommand({
            TableName: TASKS_TABLE,
        }));
        res.json(Items || []);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retrieve tasks" });
    }
};

module.exports = getTasks;
