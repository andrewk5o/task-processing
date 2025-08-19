const { getAllTasks } = require("../dynamo");

const getTasks = async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retrieve tasks" });
    }
};

module.exports = getTasks;
