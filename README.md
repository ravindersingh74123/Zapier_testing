# 🚀 Workflow Automation Platform

<div align="center">

![Workflow Automation](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)
![Kafka](https://img.shields.io/badge/Apache_Kafka-Events-black?style=for-the-badge&logo=apache-kafka)

**A powerful, event-driven workflow automation platform built with modern microservices architecture**

[Live Demo](https://zapier-testing.vercel.app/) | [Report Bug](https://github.com/yourusername/workflow-automation/issues) | [Request Feature](https://github.com/yourusername/workflow-automation/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This **Workflow Automation Platform** enables users to create sophisticated automation workflows (Zaps) that connect webhook triggers with multiple actions like sending emails and processing payments. Built on a scalable microservices architecture with Kafka-powered event processing, it provides reliable, distributed task execution.

### 🌟 Key Highlights

- **Event-Driven Architecture** - Kafka ensures reliable message delivery and processing
- **Microservices Design** - Independent services for scalability and maintainability
- **Real-Time Processing** - Instant webhook-to-action execution
- **Flexible Workflows** - Chain multiple actions in custom sequences
- **Production Ready** - Deployed across Vercel, Render, and Google Cloud Platform

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| 🔗 **Webhook Triggers** | Accept HTTP webhooks from any source to initiate workflows |
| ✉️ **Email Actions** | Send templated emails via Gmail SMTP with dynamic content |
| 💳 **Payment Processing** | Create Stripe payment links with customizable amounts |
| 🔄 **Action Chaining** | Execute multiple actions sequentially with data passing |
| 📊 **Workflow Management** | Create, view, and manage automation workflows |

### Technical Features

- **Transactional Outbox Pattern** - Ensures reliable event processing
- **Dynamic Template Parsing** - Inject webhook data into action templates
- **Distributed Task Queue** - Kafka-based async processing
- **Database Connection Pooling** - Optimized PostgreSQL connections
- **JWT Authentication** - Secure user sessions and API access

---

## 🏗️ Architecture
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│    Backend   │─────▶│  PostgreSQL │
│  (Next.js)  │      │   (Express)  │      │  (Database) │
└─────────────┘      └──────┬───────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Hooks     │
                     │   Service    │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ ZapRunOutbox │◀──┐
                     │   (Table)    │   │
                     └──────┬───────┘   │
                            │           │
                            ▼           │
                     ┌──────────────┐   │
                     │  Processor   │   │
                     │   Service    │   │
                     └──────┬───────┘   │
                            │           │
                            ▼           │
                     ┌──────────────┐   │
                     │    Kafka     │   │
                     │ (zap-events) │   │
                     └──────┬───────┘   │
                            │           │
                            ▼           │
                     ┌──────────────┐   │
                     │    Worker    │───┘
                     │   Service    │
                     └──────┬───────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌─────────────┐        ┌─────────────┐
         │   Gmail     │        │   Stripe    │
         │    SMTP     │        │     API     │
         └─────────────┘        └─────────────┘
```

### Workflow Execution Flow

1. **Webhook Reception** → Hooks service receives POST request
2. **Database Insert** → Create ZapRun and ZapRunOutbox entries
3. **Event Production** → Processor polls outbox and publishes to Kafka
4. **Event Consumption** → Worker consumes message and executes action
5. **Action Execution** → Send email or create payment based on action type
6. **Chain Continuation** → Publish next stage if more actions exist

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.3 with React 19
- **Styling**: Tailwind CSS + React Bootstrap
- **State Management**: Axios for API calls
- **Deployment**: Vercel

### Backend Services
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma with PostgreSQL adapter
- **Authentication**: JWT tokens
- **Validation**: Zod schemas

### Infrastructure
- **Database**: PostgreSQL (Neon/hosted)
- **Message Broker**: Apache Kafka 3.9.0
- **Email**: Nodemailer with Gmail SMTP
- **Payments**: Stripe API
- **Deployment**: 
  - Frontend: Vercel
  - Backend & Hooks: Render
  - Worker & Processor: Google Cloud Platform

### DevOps
- **Containerization**: Docker
- **Database Migrations**: Prisma Migrate
- **Environment Management**: dotenv

---

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.18
docker >= 20.10
postgresql >= 14
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/workflow-automation.git
cd workflow-automation
```

2. **Setup PostgreSQL**
```bash
# Using Docker
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=mysecretpassword \
  --name postgres \
  postgres:latest
```

3. **Setup Primary Backend**
```bash
cd primary-backend
npm install

# Configure environment
cat > .env << EOF
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/zapier?schema=public"
JWT_PASSWORD="your_secure_jwt_secret"
EOF

# Initialize database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start server
npm run dev
```

4. **Setup Frontend**
```bash
cd ../frontend
npm install

# Start development server
npm run dev
# Accessible at http://localhost:3001
```

5. **Setup Kafka**
```bash
# Start Kafka container
docker run -d \
  -p 9092:9092 \
  --name kafka \
  apache/kafka:3.9.0

# Create topic
docker exec -it kafka /bin/bash
cd /opt/kafka/bin/
./kafka-topics.sh \
  --create \
  --topic zap-events \
  --bootstrap-server localhost:9092
exit
```

6. **Setup Processor Service**
```bash
cd processor
npm install

# Configure environment
cat > .env << EOF
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/zapier?schema=public"
EOF

# Start processor
npm run dev
```

7. **Setup Worker Service**
```bash
cd ../worker
npm install

# Configure environment
cat > .env << EOF
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/zapier?schema=public"
SMTP_ENDPOINT="smtp.gmail.com"
SMTP_AUTH_EMAIL="your-email@gmail.com"
SMTP_AUTH_PASSWORD="your-app-password"
STRIPE_SECRET_KEY="sk_test_..."
EOF

# Start worker
npm run dev
```

8. **Setup Hooks Service**
```bash
cd ../hooks
npm install

# Configure environment
cat > .env << EOF
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/zapier?schema=public"
EOF

# Start hooks service
npm run dev
```

---

## 🌐 Deployment

### Current Deployment

- **Frontend**: [https://zapier-testing.vercel.app/](https://zapier-testing.vercel.app/)
- **Backend API**: Render (primary-backend)
- **Hooks Service**: Render
- **Worker & Processor**: Google Cloud Platform

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.render.com/api/v1
```

#### Backend Services (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_PASSWORD=your_jwt_secret
SMTP_ENDPOINT=smtp.gmail.com
SMTP_AUTH_EMAIL=your-email@gmail.com
SMTP_AUTH_PASSWORD=your-app-password
STRIPE_SECRET_KEY=sk_live_...
```

---

## 📁 Project Structure
```
workflow-automation/
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable components
│   │   └── config.ts       # API configuration
│   └── package.json
│
├── primary-backend/        # Main Express backend
│   ├── src/
│   │   ├── router/         # API route handlers
│   │   ├── db/            # Prisma client setup
│   │   ├── types/         # Zod schemas
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Initial data
│   └── package.json
│
├── hooks/                  # Webhook receiver service
│   ├── src/
│   │   ├── db/            # Database connection
│   │   └── index.ts       # Webhook handler
│   └── package.json
│
├── processor/              # Kafka producer service
│   ├── src/
│   │   └── index.ts       # Outbox polling
│   └── package.json
│
└── worker/                 # Kafka consumer service
    ├── src/
    │   ├── index.ts       # Message consumer
    │   ├── parser.ts      # Template parser
    │   ├── sendEmail.ts   # Email sender
    │   └── sendStripePayment.ts
    └── package.json
```

---

## 📚 API Documentation

### Authentication

#### POST `/api/v1/user/signup`
```json
{
  "username": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST `/api/v1/user/signin`
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```
**Response**: `{ "token": "jwt_token_here" }`

### Workflows

#### POST `/api/v1/zap` (Requires Auth)
Create a new workflow
```json
{
  "availableTriggerId": "webhook",
  "actions": [
    {
      "availableActionId": "email",
      "actionMetadata": {
        "email": "{user.email}",
        "body": "Hello {user.name}!"
      }
    }
  ]
}
```

#### GET `/api/v1/zap` (Requires Auth)
List all workflows for authenticated user

#### GET `/api/v1/zap/:zapId` (Requires Auth)
Get specific workflow details

### Triggers & Actions

#### GET `/api/v1/trigger/available`
List available trigger types

#### GET `/api/v1/action/available`
List available action types

### Webhooks

#### POST `/hooks/catch/:userId/:zapId`
Trigger workflow execution
```json
{
  "user": {
    "email": "recipient@example.com",
    "name": "Jane Smith"
  },
  "order": {
    "amount": "1000"
  }
}
```

---

## 💡 Usage Examples

### Example 1: Welcome Email Automation

**Scenario**: Send a welcome email when a new user signs up via webhook

1. **Create Workflow**
```bash
POST /api/v1/zap
Authorization: Bearer 

{
  "availableTriggerId": "webhook",
  "actions": [
    {
      "availableActionId": "email",
      "actionMetadata": {
        "email": "{user.email}",
        "body": "Welcome to our platform, {user.name}! We're excited to have you."
      }
    }
  ]
}
```

2. **Trigger Workflow**
```bash
POST http://localhost:3002/hooks/catch/1/

{
  "user": {
    "email": "newuser@example.com",
    "name": "Alex Johnson"
  }
}
```

### Example 2: Payment + Email Flow

**Scenario**: Send payment link and confirmation email
```json
{
  "availableTriggerId": "webhook",
  "actions": [
    {
      "availableActionId": "send-money",
      "actionMetadata": {
        "amount": "{order.total}",
        "address": "{user.email}"
      }
    },
    {
      "availableActionId": "email",
      "actionMetadata": {
        "email": "{user.email}",
        "body": "Payment link sent for ₹{order.total}"
      }
    }
  ]
}
```

### Template Variables

Use `{object.property}` syntax in action metadata to inject webhook data:
```
{user.email}      → Extracts email from webhook payload
{user.name}       → Extracts name
{order.amount}    → Extracts nested order amount
{payment.id}      → Extracts payment ID
```

---

## 🤝 Contributing

Contributions make the open source community an amazing place to learn and create! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Kafka](https://kafka.apache.org/) - Event streaming
- [Stripe](https://stripe.com/) - Payment processing
- [Nodemailer](https://nodemailer.com/) - Email sending

---

## 📞 Contact

Ravinder Singh :[LinkedIn](https://www.linkedin.com/in/ravinder-singh-571544247/)

Project Link: [https://github.com/ravindersingh74123/Zapier_testing](https://github.com/ravindersingh74123/Zapier_testing)

Live Demo: [https://zapier-testing.vercel.app/](https://zapier-testing.vercel.app/)

---

<div align="center">

**Made with ❤️ and TypeScript**

⭐ Star this repo if you find it helpful!

</div>
