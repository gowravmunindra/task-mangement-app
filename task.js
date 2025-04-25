const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

// Create task
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;

    const newTask = new Task({ title, desc });
    const savedTask = await newTask.save();

    // Add the new task to the user's task list
    await User.findByIdAndUpdate(id, { $push: { tasks: savedTask._id } });
    res.status(200).json({ message: "Task created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.id;
    await Task.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update task (general)
router.put("/update-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, complete, important } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (desc !== undefined) updateFields.desc = desc;
    if (complete !== undefined) updateFields.complete = complete;
    if (important !== undefined) updateFields.important = important;

    await Task.findByIdAndUpdate(id, updateFields);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Toggle important
router.put("/update-important-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.important = !task.important;
    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Toggle complete
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.complete = !task.complete;
    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
