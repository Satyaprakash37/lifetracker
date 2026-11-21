# 🏆 LifeTracker • Gamified Discipline & Habit Matrix

A high-performance, gamified habit tracker web application built with **Next.js 14**, **Tailwind CSS**, **Prisma ORM**, and **Web Audio API**.

Modeled directly after the viral discipline tracker template:
- *"Pov: I made staying disciplined feel like a game."*

---

## 📸 Key Features Matching the Design

1. **Top Visual Analytics Dashboard**:
   - **Multi-Week Bar Chart**: Color-coded day-by-day progress columns across Week 1 (periwinkle blue), Week 2 (dusty rose), Week 3 (sage mint), and Week 4 (warm peach).
   - **Daily Stats**: Exact percentages (e.g., `92%`, `100%`, `58%`, `67%`) and completed count metrics (e.g., `11`, `12`, `7`, `8`).
   - **Circular Progress Donut Rings**:
     - **Week 1**: 82.1% (with animated blue stroke gauge)
     - **Week 2**: 23.8% (with animated rose stroke gauge)
     - **Week 3 & Week 4**: 0.0% (ready for tracking)
2. **Monthly Habit Protocol Matrix**:
   - Organized into 4 colored week spans (`week 1`, `week 2`, `week 3`, `week 4`).
   - Days 1 through 31 with weekday abbreviations (`M`, `T`, `W`, `T`, `F`, `S`, `S`).
   - Tactile dark navy checkboxes (`#1E2640`) with crisp checkmarks.
3. **Gamification & Sound Engine**:
   - **XP System**: Earn `+10 XP` per habit check, and `+50 XP` bonus for achieving 100% in a day.
   - **Level Progression**: Dynamic player levels and ranks (e.g. *Level 4: Discipline Warrior*).
   - **Streak Counter**: Consecutive active discipline days.
   - **Confetti Explosion**: Interactive celebration when completing 100% of a day's habits.
   - **Synthesized Audio**: Procedural click and level-up chimes via the Web Audio API (zero audio file dependencies, fully toggleable).
4. **Resilient Dual Storage Architecture**:
   - **Zero-Config Local Persistence**: Works immediately out-of-the-box via `localStorage` with offline support.
   - **Database Persistence**: Powered by **Prisma ORM** with local SQLite (`dev.db`) and production ready for **PostgreSQL** (Neon, Supabase, Vercel Postgres, Railway).

---

## 🚀 Quick Start (Local Development)

### 1. Install dependencies:
```bash
npm install
```

### 2. Push database schema & seed initial photo preset:
```bash
npm run db:push
npm run seed
```

### 3. Start development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🌐 Deploying to Vercel

### Option A: 1-Click Deploy via GitHub (Recommended)

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: lifetracker gamified habit tracker"
   git branch -M main
   # Add your github remote:
   git remote add origin https://github.com/YOUR_USERNAME/lifetracker.git
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `lifetracker` repository.
   - Framework preset: **Next.js** (auto-detected).

3. **Connect a Production Database (Optional / Recommended)**:
   - In your Vercel Project Dashboard, navigate to the **Storage** tab.
   - Click **Create Database** -> **Vercel Postgres** (or connect a free **Neon** / **Supabase** Postgres instance).
   - Vercel automatically injects the `DATABASE_URL` environment variable.
   - For PostgreSQL in production, update `prisma/schema.prisma` datasource provider to `postgresql`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Click **Deploy**!

> **Note**: Even before setting up a database on Vercel, the app features instant local storage sync, so you and your users can use it right away without crashes!

### Option B: Deploy using Vercel CLI

```bash
npx vercel
```
Follow the interactive prompts to link and deploy your project in seconds.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database / ORM**: Prisma (SQLite for local / PostgreSQL for production)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti & CSS keyframes
- **Sound**: Web Audio API Synthesizer

