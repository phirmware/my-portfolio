/**
 * Structured resume data extracted from resume.html.
 * This is the single source of truth for both the UI and the RAG knowledge base.
 */
export const resumeData = {
  name: 'Chibuzor Ojukwu',
  nickname: 'Chibu',
  title: 'Senior Backend Engineer',
  tagline: 'Building the backbone of the internet, one microservice at a time.',
  contact: {
    email: 'chibuzorojukwu@gmail.com',
    phone: '+44-775-479-0721',
    location: 'Leicester, United Kingdom',
    linkedin: 'https://linkedin.com/in/phirmware',
    github: 'https://github.com/phirmware',
    linkedinHandle: 'phirmware',
    githubHandle: 'phirmware',
  },
  summary:
    'Senior Backend Engineer with 7+ years of experience architecting and scaling distributed, cloud-native systems on AWS and GCP. Expert in Node.js, TypeScript, and Golang with a strong track record building event-driven microservices, high-throughput data pipelines, and reliable infrastructure serving millions of users. Recently focused on LLM engineering, agentic systems, and retrieval-augmented generation (RAG), building production-ready AI applications with robust evaluation, observability, and vector search capabilities.',
  stats: [
    { label: 'Years Experience', value: '7+' },
    { label: 'Events / sec handled', value: '50K+' },
    { label: 'Uptime maintained', value: '99.99%' },
    { label: 'Monthly transactions', value: '$5M+' },
  ],
  skills: {
    'Languages & Frameworks': ['Node.js', 'TypeScript', 'Golang', 'JavaScript (ES6+)'],
    'Cloud & Infrastructure': [
      'AWS Lambda', 'ECS/Fargate', 'S3', 'CloudWatch', 'Step Functions',
      'API Gateway', 'DynamoDB', 'RDS', 'GCP Cloud Functions', 'App Engine',
      'Firestore', 'Cloud Run',
    ],
    'AI & LLM Systems': [
      'LLM Engineering', 'Agentic Workflows', 'RAG Pipelines',
      'Prompt Engineering', 'Model Evals', 'Vector Databases',
      'Embeddings', 'Tool Calling',
    ],
    'DevOps & IaC': ['Terraform', 'Serverless Framework', 'Docker', 'Kubernetes', 'Helm', 'AWS CDK'],
    'Databases & Caching': ['PostgreSQL', 'MySQL', 'Redis', 'DynamoDB', 'Firestore', 'MongoDB'],
    'Messaging & Queues': ['AWS SNS/SQS', 'RabbitMQ', 'Kafka', 'EventBridge'],
    'Monitoring & Observability': ['Datadog', 'CloudWatch', 'Prometheus', 'Grafana'],
    'CI/CD & Tools': ['GitHub Actions', 'GitLab CI', 'Bitbucket Pipelines', 'Travis CI'],
    'Architecture': ['Microservices', 'Event-Driven', 'Domain-Driven Design', 'RESTful APIs', 'GraphQL', 'Serverless', 'TDD/BDD'],
  },
  experience: [
    {
      id: 'mindera',
      title: 'Senior Backend & DevOps Engineer',
      company: 'Mindera',
      location: 'United Kingdom (Remote)',
      period: 'Jul 2022 – Present',
      color: '#22d3ee',
      aiQuestions: [
        'Tell me about the microservices modernization at IAGL (Avios) client for Mindera',
        'What LLM/RAG tools did he build internally?',
      ],
      highlights: [
        'Architected and led modernization of 5 monolithic services into event-driven TypeScript microservices using AWS Lambda and ECS, reducing deployment lead time from 4 hours to 45 minutes (70% improvement) and enabling zero-downtime partner onboarding',
        'Designed and implemented SNS/SQS-based event pipelines processing 50K+ events/sec with <100ms p99 latency, eliminating 90% data duplication across services and increasing async throughput by 50% while reducing infrastructure costs by $15K/month',
        'Led infrastructure-as-code initiative migrating 100+ manual AWS resources to Terraform and Serverless Framework, achieving 100% environment reproducibility and zero configuration drift',
        'Built and deployed LLM-powered internal tools using RAG pipelines and vector databases, enabling semantic search and automated knowledge retrieval across internal documentation',
        'Established company-wide observability standards with Datadog APM, reducing incident detection by 80% and Mean Time to Resolution from 45 minutes to 18 minutes',
        'Designed disaster recovery strategy maintaining 99.99% uptime for critical financial services handling $5M+ transactions/month',
        'Optimized database queries and implemented Redis caching layer, reducing API response times from 800ms to 320ms (60% improvement)',
      ],
      techStack: 'Node.js, TypeScript, AWS (Lambda, ECS, S3, SNS/SQS, CloudWatch, Step Functions, API Gateway), Terraform, Docker, Datadog, Serverless Framework, PostgreSQL, Redis',
    },
    {
      id: 'outlier',
      title: 'Senior Backend Engineer',
      company: 'Outlier',
      location: 'United States (Remote)',
      period: 'Sep 2021 – Jul 2022',
      color: '#a78bfa',
      aiQuestions: [
        'How did he triple system throughput at Outlier?',
        'Tell me about the Golang data pipeline work',
        'What was the real-time scheduling platform?',
      ],
      highlights: [
        'Owned end-to-end backend architecture for real-time scheduling platform serving 100K+ users, handling 5,000+ events/second with sub-second synchronization using Node.js and Golang microservices',
        'Engineered idempotent data pipelines in Golang processing 10M+ records daily with exactly-once semantics, reducing data operation latency by 40%',
        'Led migration from synchronous REST to event-driven pub/sub model using GCP Pub/Sub, tripling system throughput from 1.5K to 5K events/sec',
        'Built comprehensive internal monitoring and testing suite using Puppeteer and Jest, reducing production debugging time by 50%',
        'Designed RESTful APIs and GraphQL endpoints serving as reference implementation adopted across 6 backend teams',
        'Implemented reliability SLAs (99.9% uptime, <500ms p95 latency) with automated alerting via PagerDuty integration',
        'Optimized Golang service memory usage through profiling and goroutine management, reducing cloud compute costs by 25%',
      ],
      techStack: 'Node.js, TypeScript, Golang, GCP (Cloud Functions, Pub/Sub, Cloud Run), Redis, PostgreSQL, Travis CI, Airtable, OpenAPI, GraphQL',
    },
    {
      id: 'stubenefits',
      title: 'Fullstack Engineer',
      company: 'Stubenefits',
      location: 'United States (Remote)',
      period: 'Jun 2020 – Jun 2021',
      color: '#818cf8',
      aiQuestions: [
        'What was Stubenefits and what did he build there?',
        'How did he handle GDPR compliance at Stubenefits?',
        'Tell me about the Stripe and Plaid payment integration',
      ],
      highlights: [
        'Architected GDPR-compliant Firestore data model with row-level security, encryption at rest, and automated PII data retention, reducing unauthorized access attempts by 95%',
        'Redesigned compute layer migrating Node.js services to Golang Cloud Functions, improving API latency from 1.8s to 1.1s and cutting compute costs by 30% ($4K/month)',
        'Built GitLab CI/CD pipelines with automated testing and blue-green deployments, eliminating manual release processes and reducing deployment errors by 90%',
        'Led decomposition of monolithic architecture into 8 domain-based microservices following DDD principles, improving deployment frequency from weekly to daily',
        'Integrated Stripe payment gateway and Plaid banking APIs, enabling secure real-time ACH transactions processing $500K+ monthly volume',
      ],
      techStack: 'GCP, Node.js, Golang, Firestore, Cloud Functions, App Engine, Docker, GitLab CI, Stripe API, Plaid API, Sentry',
    },
    {
      id: 'tizeti',
      title: 'Fullstack Engineer',
      company: 'Tizeti Network Limited',
      location: 'Remote',
      period: 'Jul 2019 – Jan 2020',
      color: '#34d399',
      aiQuestions: [
        "What's Facebook Magma and what did he contribute?",
        'How did he bring 4G coverage to West Africa?',
        'Tell me about the Kubernetes and EKS work at Tizeti',
      ],
      highlights: [
        'Deployed and scaled AWS EKS clusters running Facebook Magma orchestrator for LTE core network, achieving 99.99% uptime serving 50K+ subscribers and increasing network capacity by 3x',
        'Extended 4G LTE coverage to 5 new underserved regions across West Africa via custom gRPC services and REST APIs',
        'Developed Node.js observability tooling with Prometheus metrics and Grafana dashboards, reducing Mean Time to Detect from 30 minutes to 12 minutes',
        'Automated network provisioning workflows using Bash scripts and Kubernetes operators, improving deployment speed by 80%',
        'Contributed 15+ pull requests to open-source Magma project earning committer status',
      ],
      techStack: 'Node.js, React, AWS (EKS, EC2, VPC), Docker, Kubernetes, Helm, Prometheus, Grafana, gRPC, Bash',
    },
  ],
  projects: [
    {
      id: 'ragbench',
      url: 'https://github.com/phirmware/ragbench',
      title: 'RAGBench — RAG Evaluation Framework',
      shortDesc: 'Open-source benchmarking tool for evaluating and comparing RAG pipelines',
      description:
        'Built an open-source benchmarking framework for rigorously evaluating RAG pipeline quality using the Vectara Open RAGBench dataset — 397 arXiv papers and 3,045 real-world questions. Implements MRR, nDCG, Recall@K, and Precision@K metrics across multiple embedding providers (OpenAI, Ollama) with semantic chunking and an interactive dashboard for comparing evaluation runs side-by-side.',
      tech: ['Node.js', 'TypeScript', 'Qdrant', 'OpenAI', 'Ollama', 'Express.js', 'RAG'],
      impact: 'Evaluates RAG quality across 3,045 real-world questions with multi-provider embedding support',
      questions: [
        'What problem does RAGBench solve?',
        'What metrics does RAGBench use to evaluate RAG pipelines?',
        'How does RAGBench compare different embedding providers?',
      ],
      color: 'from-cyan-500/20 to-blue-500/20',
      accentColor: '#22d3ee',
    },
    {
      id: 'clouddley',
      url: 'https://clouddley.com',
      title: 'Clouddley — Self-Hosted PaaS',
      shortDesc: 'Co-founded a self-hosted PaaS: deploy apps & databases to your own VPS',
      description:
        'Co-founded and led technical architecture as CTO for Clouddley — a self-hosted Platform-as-a-Service with the tagline "Deploy anywhere. Own everything." Enables developers to deploy apps, databases, and AI workloads to their own VPS with zero-downtime deployments, one-click database provisioning (PostgreSQL, MySQL, Redis, MongoDB, RabbitMQ), managed SSL, DDoS protection, and multi-cloud flexibility — no DevOps expertise required.',
      tech: ['Platform Engineering', 'Docker', 'Multi-cloud', 'PostgreSQL', 'Redis', 'SSL', 'Load Balancing'],
      impact: 'Live in production with real users; serving engineering teams from MVPs to millions of users',
      questions: [
        'What is Clouddley and what problem does it solve?',
        'What was your role as CTO at Clouddley?',
        'How does Clouddley compare to Heroku or Railway?',
      ],
      color: 'from-violet-500/20 to-indigo-500/20',
      accentColor: '#a78bfa',
    },
    {
      id: 'i-human',
      url: 'https://github.com/phirmware/i-human',
      title: 'i-human — Cognitive Memory CLI',
      shortDesc: 'Agentic CLI that simulates human memory with working, short-term & long-term layers',
      description:
        'Built a local-first agentic CLI that models human cognitive memory architecture. Conducts multi-turn LLM conversations with persistent memory across sessions using three layers — working, short-term, and long-term — with vector embedding-based semantic retrieval, salience-based memory decay, automatic consolidation, and append-only Markdown audit logs. Fully pluggable: works with both OpenAI and local Ollama models.',
      tech: ['TypeScript', 'OpenAI', 'Ollama', 'SQLite', 'Vector Embeddings', 'Agentic AI'],
      impact: 'Local-first, privacy-preserving cognitive memory simulation with full memory lifecycle management',
      questions: [
        'How does i-human simulate human memory?',
        'What inspired the three-layer memory architecture?',
        'How does memory decay and consolidation work in i-human?',
      ],
      color: 'from-emerald-500/20 to-teal-500/20',
      accentColor: '#34d399',
    },
  ],
  education: {
    degree: 'Bachelor of Engineering (B.Eng), Electrical and Electronics Engineering',
    university: 'University of Port Harcourt, Nigeria',
  },
  leadership: [
    'Led architecture review board establishing RFC process for technical decision-making',
    'Championed shift-left testing culture, increasing code coverage from 45% to 85% and reducing production bugs by 60%',
    'Established on-call rotation and incident response playbooks, training engineers on SRE practices',
    'Authored internal technical documentation and runbooks, reducing onboarding time by 50%',
  ],
}

export type ResumeData = typeof resumeData
export type Project = (typeof resumeData.projects)[number]
export type Experience = (typeof resumeData.experience)[number]
