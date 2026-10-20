"use strict";

const express = require("express");
const healthRouter = require("./routes/health");
const formsRouter = require("./routes/forms");
const usersRouter = require("./routes/users");
const threadsRouter = require("./routes/threads");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/health", healthRouter);
app.use("/forms", formsRouter);
app.use("/users", usersRouter);
app.use("/threads", threadsRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
  res.json({
    name: "form-api",
    version: "1.0.0",
    endpoints: ["/health", "/forms", "/users", "/threads", "/posts"]
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`form-api listening on 0.0.0.0:${PORT}`);
});
