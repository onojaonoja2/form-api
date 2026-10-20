# form-api

RESTful Form API monolith (Node.js + Express) for the AWS ECS lab. Includes form CRUD + submissions, plus `/users`, `/threads`, `/posts` routes so the monolith can be split into microservices with ALB path-based routing.

## API Endpoints (all JSON)

| Resource | Endpoints |
|---|---|
| Health | `GET /health` |
| Forms | `GET /forms`, `GET /forms/:id`, `POST /forms`, `PUT /forms/:id`, `DELETE /forms/:id`, `GET /forms/:id/submissions`, `POST /forms/:id/submissions` |
| Users | `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` |
| Threads | `GET /threads`, `GET /threads/:id`, `POST /threads`, `PUT /threads/:id`, `DELETE /threads/:id` |
| Posts | `GET /posts`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id` |

- Listens on `0.0.0.0:3000`
- In-memory storage (data resets on container restart)
- Seeded with sample data so endpoints return results immediately

---

## Class Activity: Clone → Local Test → Push to Amazon ECR

### Step 0 — Prerequisites

- Docker Desktop running
- AWS CLI installed and configured (`aws configure`)
- An AWS account with permission to create ECR repositories

Verify AWS CLI:
```bash
aws sts get-caller-identity
```
Note your **Account ID** and pick a **Region** (e.g. `us-east-1`). You'll need them below.

### Step 1 — Clone the repo

```bash
git clone https://github.com/<OWNER-USERNAME>/form-api.git
cd form-api
```

### Step 2 — Build and run locally

```bash
docker build -t my-monolith-app .
docker run -d --name form-api -p 3000:3000 my-monolith-app
```

Verify:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/forms
curl http://localhost:3000/forms/1/submissions
```

Expected: `/health` returns `{"status":"ok",...}` and `/forms` returns a JSON array of seeded forms.

Clean up the local container when done:
```bash
docker stop form-api
docker rm form-api
```

### Step 3 — Create an Amazon ECR repository

In the AWS Console:
1. Open **Amazon ECR** → **Create repository**
2. Name it `form-api`
3. Click **Create repository**

Or via CLI:
```bash
aws ecr create-repository --repository-name form-api --region <REGION>
```

### Step 4 — Authenticate Docker to ECR

```bash
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

Expected output: `Login Succeeded`

### Step 5 — Tag and push the image

Replace the placeholders with your actual account ID and region:

```bash
docker tag my-monolith-app:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/form-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/form-api:latest
```

### Step 6 — Verify

Open the ECR console and confirm `form-api` repository shows the `latest` tag with a pushed image.

### Cleanup (avoid AWS charges)

When the activity is done, delete the ECR repository (and any images) in the console, or:
```bash
aws ecr delete-repository --repository-name form-api --force --region <REGION>
```

---

## Local Development (without Docker)

```bash
npm install
npm start
```

Server starts on `http://localhost:3000`.

## Project Structure

```
form-api/
├── server.js          # Express entry point
├── store.js           # In-memory DB + seed data
├── routes/
│   ├── health.js
│   ├── forms.js
│   ├── users.js
│   ├── threads.js
│   └── posts.js
├── Dockerfile
└── package.json
```

## License

Educational use — AWS ECS lab exercise.
