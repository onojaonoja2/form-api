"use strict";

const express = require("express");
const { db, genId } = require("../store");
const router = express.Router();

function validateThread(body) {
  const errors = [];
  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    errors.push("title is required and must be a non-empty string");
  }
  if (!body.userId || typeof body.userId !== "string" || !body.userId.trim()) {
    errors.push("userId is required and must be a non-empty string");
  }
  return errors;
}

router.get("/", (req, res) => {
  res.json(db.threads);
});

router.get("/:id", (req, res) => {
  const thread = db.threads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });
  res.json(thread);
});

router.post("/", (req, res) => {
  const errors = validateThread(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const user = db.users.find((u) => u.id === req.body.userId);
  if (!user) return res.status(400).json({ error: "Validation failed", details: ["userId does not reference an existing user"] });

  const thread = {
    id: genId(),
    title: req.body.title.trim(),
    userId: req.body.userId,
    createdAt: new Date().toISOString()
  };
  db.threads.push(thread);
  res.status(201).json(thread);
});

router.put("/:id", (req, res) => {
  const thread = db.threads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });

  const errors = validateThread(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const user = db.users.find((u) => u.id === req.body.userId);
  if (!user) return res.status(400).json({ error: "Validation failed", details: ["userId does not reference an existing user"] });

  thread.title = req.body.title.trim();
  thread.userId = req.body.userId;
  res.json(thread);
});

router.delete("/:id", (req, res) => {
  const idx = db.threads.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Thread not found" });
  db.threads.splice(idx, 1);
  db.posts = db.posts.filter((p) => p.threadId !== req.params.id);
  res.status(204).send();
});

module.exports = router;
