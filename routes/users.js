"use strict";

const express = require("express");
const { db, genId } = require("../store");
const router = express.Router();

function validateUser(body) {
  const errors = [];
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    errors.push("name is required and must be a non-empty string");
  }
  if (!body.email || typeof body.email !== "string" || !body.email.trim()) {
    errors.push("email is required and must be a non-empty string");
  }
  return errors;
}

router.get("/", (req, res) => {
  res.json(db.users);
});

router.get("/:id", (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/", (req, res) => {
  const errors = validateUser(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const user = {
    id: genId(),
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  res.status(201).json(user);
});

router.put("/:id", (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const errors = validateUser(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  user.name = req.body.name.trim();
  user.email = req.body.email.trim();
  res.json(user);
});

router.delete("/:id", (req, res) => {
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  db.users.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
