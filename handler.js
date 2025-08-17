const express = require("express");
const serverless = require("serverless-http");
const { taskRoutes } = require("./routes");

const app = express();

app.use(express.json());

// Task routes
app.get("/tasks", taskRoutes.getAllTasks);
app.get("/tasks/:taskId", taskRoutes.getTaskById);
app.post("/tasks", taskRoutes.createTask);

// 404 handler
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
