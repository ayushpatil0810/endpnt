# endpnt.

endpnt is a beautiful, developer-first link-in-bio application. It consolidates your portfolio, social links, resume, and projects behind a single, memorable URL. Built for the modern developer, it features deep integrations with platforms like GitHub, LeetCode, and Dev.to, combined with rich analytics and a highly customizable aesthetic.

## Features

- **One Endpoint**: Consolidate every link behind a single, memorable URL (`endpnt.dev/username`).
- **Fully Themed**: Choose from curated visual themes (Aurora, Terminal, Velvet, etc.) to match your personal brand.
- **Click Analytics**: Real-time insights on profile views, link clicks, and CTR (Click-Through Rate).
- **Dev-First Integrations**: Sync your GitHub stats, LeetCode activity, and Dev.to posts.
- **Drag & Drop Links**: Easily reorder your links using a smooth drag-and-drop interface.
- **Custom SEO**: Full control over your profile's meta title and description for social sharing.
- **Premium Aesthetics**: Ripple-animated sun/moon dark mode switcher, noise backgrounds, text hover effects, and modern UI elements.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Framer Motion for animations
- **Database**: [Neon Database](https://neon.tech/) (Serverless Postgres) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Aceternity UI](https://ui.aceternity.com/)

## Getting Started

1. **Clone the repository** and install dependencies:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following keys:

   ```env
   DATABASE_URL="your-neon-postgres-url"
   BETTER_AUTH_SECRET="your-auth-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   # Add your OAuth provider client IDs and secrets (e.g., GitHub)
   ```

3. **Initialize the database**:

   ```bash
   npm run db:push
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

For a deep dive into the project's structure, database schema, and component flow, please see the [Architecture & Explanation](ARCHITECTURE.md) document.

## License

© endpnt. All rights reserved.
