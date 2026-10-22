
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const app = express();
app.use(express.json());
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

app.post("/tasks", (req, res) => {
  const title = req.body.title;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: `Task ${req.params.id} not found`
    });
  }

  const { title, done } = req.body || {};

  if (
    (title === undefined && done === undefined) ||
    (title !== undefined &&
      (typeof title !== "string" || title.trim() === "")) ||
    (done !== undefined && typeof done !== "boolean")
  ) {
    return res.status(400).json({
      error: "Invalid task data"
    });
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (done !== undefined) {
    task.done = done;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: `Task ${req.params.id} not found`
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
