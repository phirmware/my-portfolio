# Chibuzor Ojukwu — Knowledge Base

This document is the primary source of truth for the AI assistant on Chibuzor's portfolio.
It is semantically chunked and embedded into SQLite for vector-based RAG retrieval.

---

## Personal Background

Chibuzor Ojukwu (often called Chibu) is a Nigerian-born Senior Backend Engineer currently based in Leicester, United Kingdom. He relocated to the UK in 2022 after being sponsored on a Skilled Worker visa by Mindera UK, where he joined as a Senior Backend Engineer — a testament to the calibre of work he had already built up across his career in Nigeria and the US.

His engineering origin story is not a traditional one. Chibuzor studied Electrical and Electronics Engineering at the University of Port Harcourt, Nigeria — but while at university, his real ambition was to build software products. He wanted to create SaaS businesses, and that meant learning to code. He taught himself software development through Udemy courses and hands-on building, going from zero to freelancing and shipping real applications for paying clients while still a student.

What started as a means to an end — building products — became a deep craft. By the time he graduated, he had more practical engineering experience than most bootcamp graduates, and a builder's mentality that has defined his career ever since.

---

## Why Backend and Infrastructure

Chibuzor's pull toward backend and infrastructure engineering was organic, not accidental. When he was building SaaS products independently, there was no Vercel, no managed everything — if you wanted your app on the internet, you provisioned a VPS, configured firewalls, managed Linux user permissions, set up SSL certificates with Let's Encrypt, and wired up Nginx for load balancing and reverse proxying. He did all of this from scratch, repeatedly, across multiple projects.

That hands-on exposure to the full stack — from React components down to server configuration and network security — gave him an end-to-end mental model of how software systems actually work in production. He naturally gravitated toward the backend and infrastructure layer because that is where he found the most leverage: the decisions made there determine whether a product survives real-world load, security vulnerabilities, and operational complexity. Frontend is the face of a product; the backend and infrastructure are its bones.

---

## Career Journey

### Tizeti Network Limited — The Internship That Wasn't Ordinary (Jul 2019 – Jan 2020)

Tizeti was Chibuzor's first professional software engineering role, taken as an internship. By this point he had already worked across the full development pipeline — frontend with React, backend with Node.js, and server configuration from his freelance days. But Tizeti gave him his first taste of genuinely hard infrastructure problems at scale.

The company needed to deploy Facebook Magma — an open-source LTE/5G network orchestration platform backed by Meta — to provide VOIP services across Nigeria. The catch: Kubernetes was not a tool the existing team was familiar with. Chibuzor was. As an intern, he volunteered to take on the entire infrastructure setup: configuring dev, staging, and production environments using Vagrant and Kubernetes, and deploying Magma across all three.

He successfully stood up the entire infrastructure, and as a side effect of going deep on the codebase, he ended up making contributions to the open-source Facebook Magma project itself — earning committer status. For an intern in his first professional role, setting up production Kubernetes clusters for a live telecommunications network serving 50,000+ subscribers across Nigeria and contributing to a 10,000+ star open-source project was a defining achievement. It set a tone for his career: find the hardest problem in the room and solve it.

### Stubenefits — Full Stack Breadth and Cloud Foundations (Jun 2020 – Jun 2021)

After Tizeti, Chibuzor joined Stubenefits, a US-based startup, as a Fullstack Engineer. This role rounded out his cloud and DevOps fundamentals significantly. He worked with Angular and Node.js on the product side, but more importantly deepened his GCP expertise — Pub/Sub, Firestore, Firebase, Cloud Functions, and serverless architecture became core tools. It was also where he learned to collaborate seriously as part of an engineering team: GitLab CI/CD, disciplined Git workflows, code review culture, and writing real test coverage — both unit and end-to-end.

He redesigned parts of the compute layer, migrating Node.js services to Golang Cloud Functions, and architected GDPR-compliant data models for the platform. He also integrated Stripe and Plaid APIs to enable real-time ACH transactions, getting his first exposure to the care and precision required when handling financial data in production.

### Outlier (Masterclass Sister Company) — Performance Engineering at Scale (Sep 2021 – Jul 2022)

Outlier.org — a sister company to Masterclass.com — was where Chibuzor's instincts around performance and systems engineering were truly sharpened. The platform served over 100,000 users with real-time scheduling synchronisation, and the engineering culture here was intensely focused on building systems optimised for speed and low latency.

He learned to think carefully about the Node.js event loop — writing non-blocking, asynchronous code that handles large volumes of data without choking the runtime. He worked extensively with Golang for data pipeline work, processing 10 million+ records daily with exactly-once semantics. He also collaborated across a large network of integrations and worked alongside teams that held very high standards for code readability and maintainability. This role transformed his sense of what "production-grade" actually means.

He led the migration from a synchronous REST architecture to an event-driven pub/sub model using GCP Pub/Sub and Cloud Functions — tripling system throughput from 1,500 to 5,000 events per second. He also established reliability SLAs including 99.9% uptime and sub-500ms p95 latency targets.

### Mindera (Client: IAGL / Avios) — Senior Engineering and AI at Scale (Jul 2022 – Present)

Mindera is where Chibuzor has done his most consequential and senior work. He was brought to the UK on a Skilled Worker visa specifically for this role — a strong signal of how highly he was regarded. At Mindera he works as a Senior Backend and DevOps Engineer embedded with IAGL (International Airlines Group Loyalty), the company behind the Avios loyalty programme.

In practice this means building and maintaining complex integrations with some of Europe's largest airlines: British Airways, Iberia, Vueling, Aer Lingus, as well as loyalty brands like Nectar and Qatar Airways. The domain is deeply technical — OAuth 2.0 flows, secure partner onboarding, event-driven microservices, high-throughput data pipelines, and multi-region AWS infrastructure — all operating in a regulated financial services context where $5M+ in transactions flow through the system every month.

He has modernised 5 monolithic services into TypeScript microservices on AWS Lambda and ECS, led the full infrastructure-as-code migration of 100+ manual AWS resources to Terraform and Serverless Framework, and established company-wide observability standards using Datadog APM. He carries on-call responsibilities via PagerDuty and plays a technical leadership role in architecture reviews and incident response.

Beyond the core platform work, he has also been working on AI-powered tooling: building agentic systems for incident identification and resolution (starting as an internal tool giving engineers natural language access to databases and APIs), and fine-tuning open-source LLMs for fraud detection.

---

## The Startup Chapter — Three Years Building in Production

One of Chibuzor's proudest — and most formative — experiences is a startup he co-founded with a friend. The product was a platform that automated application deployments to users' VPS servers, with features including team management, granular access controls and permissions, custom domain integration, and custom reverse proxy configuration. Think a self-hosted, infrastructure-agnostic deployment platform.

This was not a side project or an MVP that never shipped — it ran in production for three years with real paying customers. He and his co-founder handled everything: product decisions, engineering trade-offs, customer conversations, feature prioritisation, managing a small engineering team, and the relentless reality of running a business.

They ultimately shut it down when they did not achieve the growth trajectory they were aiming for. But Chibuzor does not measure its success by that outcome. Building and running a product end-to-end for three years taught him lessons about engineering trade-offs, business thinking, and technical leadership that no corporate role could replicate. It is the experience that fundamentally shaped how he evaluates technical decisions — always with an eye on business impact, not just technical elegance.

---

## The AI and LLM Engineering Pivot

Chibuzor's interest in AI engineering grew from genuine curiosity about how modern agentic systems work under the hood. Using tools like Claude Code triggered a desire to understand the architecture behind them — not just consume them as a user, but build with them as an engineer. He dug into the fundamentals: how LLMs process context, how retrieval-augmented generation works, how tool calling and agentic loops are structured, and how to evaluate model quality in production.

The most technically demanding AI work he has done is fine-tuning an open-source LLM using QLoRA (Quantized Low-Rank Adaptation). This involved the full ML pipeline: data collection and preprocessing, removing statistical outliers, ensuring dataset completeness and relevance, quantising the base model, training the LoRA adaptors, applying them to targeted layers of the main model, and running inference and evaluation using Hugging Face tooling. The resulting model was applied to fraud detection on financial transaction patterns — a production use case with real stakes.

He has also built a production agentic system for incident identification and resolution at Mindera — an internal tool that gives engineers natural language access to databases and APIs, using RAG for grounding, to assist with diagnosing and resolving incidents faster.

Chibuzor is now actively looking for an AI engineering role where he can apply and deepen this expertise. He is particularly interested in the intersection of robust backend engineering and LLM systems — building AI products that are not just impressive demos, but reliable, observable, and scalable in production.

---

## Technical Philosophy and Working Style

**On system design:** Chibuzor approaches system design by demanding clarity upfront. He wants all requirements defined — not assumed — and actively probes edge cases before a single line of code is written. He typically proposes three solution options for any significant design problem, each with different trade-off profiles, so the team can make an informed decision rather than defaulting to the first idea. Good architecture is a conversation, not a decree.

**On backend vs frontend:** He has always believed that leverage in software engineering lives in the infrastructure and backend layer. The decisions made there — about data models, event flows, failure modes, and scaling strategies — determine the long-term health of a product. He has deep respect for frontend engineering but his instinct is always to ensure the foundation is right.

**On infrastructure as code:** Chibuzor is a genuine believer in IaC, not just a practitioner. He has lived through the alternative — manually configured AWS resources that no one fully understands, environments that cannot be reproduced, and configuration drift that causes 2am incidents. Migrating 100+ resources to Terraform at Mindera was not a box-ticking exercise; it was about giving the team the ability to version, review, and reproduce infrastructure the same way they review and reproduce application code.

**On engineering culture:** Good culture, to Chibuzor, means every engineer on the team has a real voice. Opinions are discussed openly, not deferred to seniority. The team cares about craft — following good engineering practices, writing maintainable code, investing in observability — and is genuinely willing to improve on what already exists. He has no patience for cultures that treat technical debt as permanent or treat code review as a rubber stamp.

**On mentorship:** He believes strongly in growing the engineers around him. He has led RFC processes for architecture decisions, established on-call training programmes, and authored internal documentation and runbooks specifically to lower the barriers for less experienced engineers. Great engineers make their teams better — not just their own output.

---

## What He Is Looking For Next

Chibuzor is actively exploring new senior engineering opportunities, with a strong preference for roles at the intersection of backend engineering and AI/LLM systems. His ideal next role is at a company building AI-native products or applying LLM technology to meaningful problems in production — not AI as a feature, but AI as the core of the product.

He brings a rare combination: deep distributed systems and cloud infrastructure experience (the kind that makes AI systems actually reliable in production) combined with genuine hands-on LLM engineering experience including RAG pipelines, agentic workflows, and model fine-tuning. He is not a data scientist pivoting into AI engineering — he is a senior backend engineer who has gone deep on the AI layer.

He is open to remote and hybrid roles. He is based in Leicester, UK and is a UK visa holder, so he does not require sponsorship for UK-based roles.

---

## Key Technical Skills (Quick Reference)

- **Languages:** Node.js (Expert), TypeScript (Expert), Golang (Proficient), JavaScript ES6+
- **Cloud:** AWS (Lambda, ECS/Fargate, S3, SNS/SQS, CloudWatch, Step Functions, API Gateway, DynamoDB, RDS), GCP (Cloud Functions, Pub/Sub, Cloud Run, Firestore, App Engine)
- **AI/LLM:** RAG pipelines, agentic workflows, LLM fine-tuning (QLoRA), prompt engineering, model evaluation, vector databases, embeddings, tool calling
- **Infrastructure/DevOps:** Terraform, Serverless Framework, Docker, Kubernetes, Helm, AWS CDK
- **Databases:** PostgreSQL, MySQL, Redis, DynamoDB, Firestore, MongoDB
- **Messaging:** AWS SNS/SQS, RabbitMQ, Kafka, EventBridge, GCP Pub/Sub
- **Observability:** Datadog APM, CloudWatch, Prometheus, Grafana, PagerDuty
- **CI/CD:** GitHub Actions, GitLab CI, Bitbucket Pipelines, Travis CI
- **Architecture:** Microservices, Event-Driven Architecture, Domain-Driven Design, REST, GraphQL, Serverless, OAuth 2.0

---

## Quick Facts

- **Location:** Leicester, United Kingdom
- **Nationality:** Nigerian | UK Skilled Worker Visa holder (no sponsorship needed for UK roles)
- **Years of experience:** 7+
- **Availability:** Actively looking — open to senior backend, AI engineering, and staff engineer roles
- **Contact:** chibuzorojukwu@gmail.com
- **LinkedIn:** linkedin.com/in/phirmware
- **GitHub:** github.com/phirmware
- **Education:** B.Eng Electrical and Electronics Engineering, University of Port Harcourt, Nigeria
