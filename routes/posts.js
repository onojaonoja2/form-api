"use strict";

const express = require("express");
const { db, genId } = require("../store");
const router = express.Router();

function validatePost(body) {
  const errors = [];
  if (!body.content || typeof body.content !== "string" || !body.content.trim()) {
    errors.push("content is required and must be a non-empty string");
  }
  if (!body.threadId || typeof body.threadId !== "string" || !body.threadId.trim()) {
    errors.push("threadId is required and must be a non-empty string");
  }
  if (!body.userId || typeof body.userId !== "string" || !body.userId.trim()) {
    errors.push("userId is required and must be a non-empty string");
  }
  return errors;
}

router.get("/", (req, res) => {
  res.json(db.posts);
});

router.get("/:id", (req, res) => {
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

router.post("/", (req, res) => {
  const errors = validatePost(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const thread = db.threads.find((t) => t.id === req.body.threadId);
  if (!thread) return res.status(400).json({ error: "Validation failed", details: ["threadId does not reference an existing thread"] });
  const user = db.users.find((u) => u.id === req.body.userId);
  if (!user) return res.status(400).json({ error: "Validation failed", details: ["userId does not reference an existing user"] });

  const post = {
    id: genId(),
    content: req.body.content.trim(),
    threadId: req.body.threadId,
    userId: req.body.userId,
    createdAt: new Date().toISOString()
  };
  db.posts.push(post);
  res.status(201).json(post);
});

router.put("/:id", (req, res) => {
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const errors = validatePost(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const thread = db.threads.find((t) => t.id === req.body.threadId);
  if (!thread) return res.status(400).json({ error: "Validation failed", details: ["threadId does not reference an existing thread"] });
  const user = db.users.find((u) => u.id === req.body.userId);
  if (!user) return res.status(400).json({ error: "Validation failed", details: ["userId does not reference an existing user"] });

  post.content = req.body.content.trim();
  post.threadId = req.body.threadId;
  post.userId = req.body.userId;
  res.json(post);
});

router.delete("/:id", (req, res) => {
  const idx = db.posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Post not found" });
  db.posts.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
