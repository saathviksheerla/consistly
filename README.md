# 🐢 Consistly — Learning & Habit Tracker

**Consistly** (currently hosted at https://kurmaconsistly.vercel.app/)  
A minimal, offline-first learning progress and habit tracker with daily streaks, course tracking, bookmarks, milestones, and study logs — built for one user initially, and designed to evolve into a public SaaS.

Kurma, the quiet turtle, is our mascot — embodying steady, persistent progress.

---

## 🚀 Live Demo

👉 https://kurmaconsistly.vercel.app/

---

## 🧠 What Is Consistly?

Consistly is a Duolingo-style personal dashboard for tracking your learning progress, habits, and study sessions — completely local and offline-capable.

It is built with:

- **Next.js (App Router)**
- **Tailwind CSS**
- **LocalStorage for persistence**
- No backend required (yet)

Consistly focuses on:

- Daily study logs & streaks
- Progress tracking for courses & playlists
- Bookmark management
- Roadmap & milestones

---

## 🔥 Key Features

### 📊 Dashboard

- Streak counter (days in a row studied)
- Quick add today’s study
- Visual progress for active courses
- Upcoming deadlines
- Quick bookmarks strip

### 🎓 Courses & Playlists

- Add courses manually
- Track lessons/videos
- Click to open links
- Auto % complete visualization

### 🔖 Bookmarks

- Title + URL + category
- Category tag colors
- Pin important bookmarks
- One-click open

### 📅 Daily Study Log

- Log what you studied + time + notes
- Calendar heatmap view
- Intelligent streak logic

### 🛣️ Roadmap & Deadlines

- Add milestones with dates
- Sort, mark complete
- Show days left / overdue

### 🔔 Notifications

- Browser reminder permissions
- Daily reminder notifications
- In-app banner for missing logs

---

## 🗂️ Data Model (LocalStorage)

| Key          | Data                                |
| ------------ | ----------------------------------- |
| `courses`    | Array of course objects             |
| `bookmarks`  | Array of bookmarks                  |
| `studyLog`   | Array of daily log entries          |
| `milestones` | Array of roadmap items              |
| `settings`   | User settings (reminder time, etc.) |

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Web Notifications API**
- **localStorage**

No backend, no cookies, no external libraries (auth/db) for now.

---

## 🧩 Future Roadmap (High-Level)

**Phase 1 — Public Release**

- Google SSO (OAuth)
- Backend (Next.js API Routes)
- MongoDB Atlas (free tier)
- Per-user scoped data
- Sync local ↔ cloud

**Phase 2 — SaaS**

- Pricing & plans
- Limits & upgrades
- Analytics & dashboards

The app is built to scale from local personal use to a SaaS product.

---

## 🛠️ Local Development

Clone the repo:

```bash
fork the repo
git clone https://github.com/<your-username>/consistly.git
cd consistly

## Code quality
- Formatting: Prettier
- Linting: Next.js ESLint defaults
- Enforced via pre-commit (Husky + lint-staged)

Do not add extra ESLint rules unless absolutely necessary.
```
