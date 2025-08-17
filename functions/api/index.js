const express = require("express");
const serverless = require("serverless-http");
const { createTask, getAllTasks, getTask } = require("./routes");

const app = express();

app.use(express.json());

app.get("/tasks", getAllTasks.getAllTasks);
app.get("/tasks/:taskId", getTask.getTask);
app.post("/tasks", createTask.createTask);

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

exports.handler = serverless(app);
