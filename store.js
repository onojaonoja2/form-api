"use strict";

let nextId = 100;

function genId() {
  return String(nextId++);
}

const db = {
  forms: [
    {
      id: "1",
      title: "Customer Feedback",
      description: "Collect feedback about our product",
      fields: [
        { label: "name", type: "text", required: true },
        { label: "email", type: "email", required: true },
        { label: "rating", type: "number", required: true },
        { label: "comments", type: "textarea", required: false }
      ],
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "2",
      title: "Event Registration",
      description: "Register for the annual conference",
      fields: [
        { label: "fullName", type: "text", required: true },
        { label: "company", type: "text", required: false },
        { label: "ticketType", type: "select", required: true }
      ],
      createdAt: "2026-01-02T00:00:00.000Z"
    }
  ],
  submissions: [
    {
      id: "10",
      formId: "1",
      answers: { name: "Ada Lovelace", email: "ada@example.com", rating: 5, comments: "Great product!" },
      submittedAt: "2026-01-05T10:30:00.000Z"
    }
  ],
  users: [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", createdAt: "2026-01-01T00:00:00.000Z" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", createdAt: "2026-01-01T00:00:00.000Z" }
  ],
  threads: [
    { id: "1", title: "Getting Started with ECS", userId: "1", createdAt: "2026-01-03T00:00:00.000Z" },
    { id: "2", title: "ALB Path-Based Routing Tips", userId: "2", createdAt: "2026-01-04T00:00:00.000Z" }
  ],
  posts: [
    { id: "1", content: "Welcome to the ECS discussion thread!", threadId: "1", userId: "1", createdAt: "2026-01-03T01:00:00.000Z" },
    { id: "2", content: "Use listener rules to split /users, /threads, /posts.", threadId: "2", userId: "2", createdAt: "2026-01-04T01:00:00.000Z" }
  ]
};

module.exports = { db, genId };
