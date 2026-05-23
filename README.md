# endpnt.

<div align="center">
  <h3>A centralized API for your online presence. Built exclusively for developers.</h3>
  <p>Bring your GitHub stats, technical blogs, and personal projects into a single, beautifully designed interface with zero CSS required.</p>
</div>

## 🚀 Overview

**endpnt** is an open-source, developer-focused portfolio and link-in-bio platform. It serves as a unified digital identity, moving beyond static markdown or fragmented link trees.

---

## ✨ Features

- **Developer Integrations**: Seamlessly sync and showcase your footprint from GitHub, LeetCode, Dev.to, Medium, and Hashnode.
- **Project Showcase**: Highlight your best work with associated tech stacks, live URLs, and GitHub repositories.
- **Privacy-Friendly Analytics**: Gain deep insights into your audience with built-in event tracking. Monitor profile views, link clicks, and traffic referrers in real-time.
- **Bespoke Developer Aesthetics**: Customize your profile with premium, developer-centric layouts (`bento`, `minimal`, `sidebar`) and dynamic themes (`glassmorphism`, `neo-brutalism`, `neumorphism`, `claymorphism`).
- **SEO Optimized**: Automatically generated meta tags, Open Graph images (`/api/og`), and customizable SEO titles/descriptions.

---

## 🏗️ Architecture

The platform operates on a modern full-stack serverless architecture.

```mermaid
flowchart TD
    Client[Client / Browser]
    NextJS[Next.js App Router]
    API[API Routes]
    Auth[Better Auth]
    DB[(PostgreSQL)]
    Redis[(Upstash Redis)]

    Client -->|Renders Pages| NextJS
    Client -->|Fetches Data / Mutations| API
    NextJS -->|Server Actions / RSC| DB
    API -->|Validates Session| Auth
    API -->|Rate Limiting| Redis
    API -->|Reads / Writes| DB
```

### Request & Data Flow (Analytics)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API as Analytics API
    participant DB as PostgreSQL

    User->>Frontend: Clicks Profile Link
    Frontend->>API: POST /api/links/[id]/click (with Referrer)
    API->>API: Deduplicate via Cookie / IP
    API->>DB: INSERT INTO events (linkId, type, referrer)
    API-->>Frontend: 200 OK
    Frontend-->>User: Redirect to Target URL
```

---

## 💾 Database Schema

The persistence layer uses a normalized relational schema managed by Drizzle ORM.

```mermaid
erDiagram
    users {
        text id PK
        text username UK
        text bio
        text theme
        text layout
        text githubUsername
        integer views
    }
    links {
        uuid id PK
        text userId FK
        text title
        text url
        integer clicks
        integer displayOrder
    }
    projects {
        uuid id PK
        text userId FK
        text title
        text description
        jsonb techStack
        integer displayOrder
    }
    events {
        uuid id PK
        text userId FK
        uuid linkId FK
        text type
    }

    users ||--o{ links : "has many"
    users ||--o{ projects : "has many"
    users ||--o{ events : "has many"
    links ||--o{ events : "has many"
```

---

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Database:** PostgreSQL via [@neondatabase/serverless](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Validation:** [Zod](https://zod.dev/)

---

## 🛠️ Environment Setup

Create a `.env` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database
DATABASE_URL="postgres://user:password@host/db"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Security (Optional)
GOOGLE_SAFE_BROWSING_KEY="your-api-key"
```

---

## 🚀 Running Locally

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Database Setup:**
   Generate migrations and push the schema to your Postgres instance.

   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Code Quality Commands:**
   ```bash
   npm run lint        # Run ESLint
   npm run format      # Format code with Prettier
   ```

---

## 📂 Folder Structure

```text
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/           # Authentication flows
│   ├── (protected)/      # Dashboard and settings (requires login)
│   ├── [username]/       # Dynamic public profile pages
│   └── api/              # API endpoints (links, projects, analytics)
├── components/           # Reusable React components (shadcn/ui + custom)
├── db/                   # Database configuration and Drizzle schema
├── lib/                  # Utilities, stores, analytics batchers, validators
└── public/               # Static assets
```

---

## ⚡ Performance Considerations

- **Parallel Data Fetching**: Profile pages fetch user, links, and projects in parallel.
- **Database Indexing**: The `events` table leverages Postgres constraints and efficient lookups for real-time analytics aggregation.
- **Deduplication**: Page views use short-lived cookies and Redis to prevent duplicate event tracking without degrading UX.

## 🛡️ Security Notes

- **Safe URLs**: All user-submitted links are sanitized and validated against standard URL parsers. An integration with Google Safe Browsing API is provided to prevent malicious links.
- **SQL Injection**: Handled natively by Drizzle ORM's parameterized queries.
- **Auth**: Sessions and OAuth flows are secured strictly by `better-auth`.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
