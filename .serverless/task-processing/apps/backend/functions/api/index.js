const express = require("express");
const serverless = require("serverless-http");
const { createTask, getTasks } = require("./routes");

const app = express();

app.use(express.json());

app.get("/tasks", getTasks);
app.post("/tasks", createTask);

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

exports.handler = serverless(app);
