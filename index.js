
const express = require("express");

const app = express();
const port = 3000;

let tasks = [
  { id: 1, title: "Study JavaScript", done: false },
  { id: 2, title: "Finish homework", done: false },
  { id: 3, title: "Read a book", done: true }
];

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${req.params.id} not found`
    });
  }

  res.json(task);
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
