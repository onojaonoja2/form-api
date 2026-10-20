"use strict";

const express = require("express");
const { db, genId } = require("../store");
const router = express.Router();

function validateForm(body) {
  const errors = [];
  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    errors.push("title is required and must be a non-empty string");
  }
  if (body.fields !== undefined) {
    if (!Array.isArray(body.fields)) {
      errors.push("fields must be an array");
    } else {
      body.fields.forEach((f, i) => {
        if (!f || typeof f.label !== "string" || !f.label.trim()) {
          errors.push(`fields[${i}].label is required`);
        }
        if (!f || typeof f.type !== "string" || !f.type.trim()) {
          errors.push(`fields[${i}].type is required`);
        }
      });
    }
  }
  return errors;
}

router.get("/", (req, res) => {
  res.json(db.forms);
});

router.get("/:id", (req, res) => {
  const form = db.forms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json(form);
});

router.post("/", (req, res) => {
  const errors = validateForm(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  const form = {
    id: genId(),
    title: req.body.title.trim(),
    description: typeof req.body.description === "string" ? req.body.description : "",
    fields: Array.isArray(req.body.fields) ? req.body.fields : [],
    createdAt: new Date().toISOString()
  };
  db.forms.push(form);
  res.status(201).json(form);
});

router.put("/:id", (req, res) => {
  const form = db.forms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: "Form not found" });

  const errors = validateForm(req.body || {});
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  form.title = req.body.title.trim();
  if (typeof req.body.description === "string") form.description = req.body.description;
  if (Array.isArray(req.body.fields)) form.fields = req.body.fields;
  res.json(form);
});

router.delete("/:id", (req, res) => {
  const idx = db.forms.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Form not found" });
  db.forms.splice(idx, 1);
  db.submissions = db.submissions.filter((s) => s.formId !== req.params.id);
  res.status(204).send();
});

router.get("/:id/submissions", (req, res) => {
  const form = db.forms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json(db.submissions.filter((s) => s.formId === req.params.id));
});

router.post("/:id/submissions", (req, res) => {
  const form = db.forms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: "Form not found" });

  const answers = (req.body || {}).answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return res.status(400).json({ error: "Validation failed", details: ["answers must be an object of fieldLabel: value"] });
  }

  const missing = form.fields
    .filter((f) => f.required && (answers[f.label] === undefined || answers[f.label] === null || answers[f.label] === ""))
    .map((f) => f.label);
  if (missing.length) {
    return res.status(400).json({ error: "Validation failed", details: [`missing required answers: ${missing.join(", ")}`] });
  }

  const submission = {
    id: genId(),
    formId: form.id,
    answers,
    submittedAt: new Date().toISOString()
  };
  db.submissions.push(submission);
  res.status(201).json(submission);
});

module.exports = router;
