# 🚀 **LearnSpace — Explain. Reflect. Grow.**

A fun, simple, gamified learning journal designed to help students learn better using the **Feynman Technique**.



## 🎥 Demo


📺 **Video Demo:** https://drive.google.com/file/d/1rVu3JrxTNSGi_b35yI5bME8QGQr7td16/view?usp=sharing


📘 **Documentation:** (https://akandekehinde.gitbook.io/cs-girlies-hackathon-documentation/)



## 📌 **Table of Contents**

* Overview
* Features
* Tech Stack
* How It Works
* Pages & Components
* Installation
* Project Structure
* Screenshots
* Future Improvements
* License


## 🧠 **Overview**

**LearnSpace** is a lightweight, interactive learning companion that helps students develop strong study habits.

Users write short explanations of what they learned (Feynman Technique), tag their entries, track streaks, and earn XP as they stay consistent.

Built for the **“Make Learning Fun” — CS Girlies Hackathon (Nov 2025)**, LearnSpace encourages reflection, active recall, and continuous growth — all while keeping learning enjoyable.


## ⭐ **Features**

### 📝 Core Learning Features

* Create learning journals — write daily “What I learned” notes
* Tag entries by topic (#math, #biology, #react…)
* Edit & delete entries anytime
* **LocalStorage persistence** — everything is saved in the browser

### Core Learning Features (detailed)

- Entries (aka "entries" / formerly "posts") — create, edit, and delete short explanations of what you learned. Stored in localStorage under the `posts` key. (See: `src/pages/NewPost.jsx`, `src/components/Post.jsx`)
- Tags & discovery — add tags to entries and browse by tag via `/tag/:tag`. Tag seeding and tag-based feed filtering are supported. (See: `src/pages/TagPage.jsx`, `src/components/NavBar.jsx`)
- Drafts / My Notes — save drafts while composing and revisit them later. Drafts are persisted in `draftEntries` localStorage and exposed in `src/pages/Notes.jsx` and `src/components/NewPostForm.jsx`.
- XP & streaks — lightweight motivation system: entries award XP and update a daily streak. XP and streaks are persisted per-username in `user_profiles` and in-session `userProfile` so progress survives logout. (See: `src/App.jsx`)
- Save / Bookmark — users can save (bookmark) entries; saved post ids are stored on the profile (`savedPosts`) so saved lists survive logins. (See: `src/components/Post.jsx`)
- Comments — entries support comments that include `authorId` and `createdAt`. Comment actions can award XP as well. (See: `src/components/CommentsPanel.jsx`)
- Followers / Following — simple social layer so you can follow other users; following a user adds their entries into your feed. Profiles store `followers` and `following` arrays and follow/unfollow updates are persisted to `user_profiles`. (See: `src/components/UserSection.jsx`, `src/pages/Profile.jsx`)
- Local-first, privacy-friendly — all data is stored in the browser (LocalStorage); no backend is required to run the app.

### 🔥 Motivation System

* Daily learning **streak tracker**
* **XP system** — earn points for logging new entries
* Progress overview page showing streaks + XP growth

### 🎨 User Interface

* Clean, modern UI
* Fully responsive (mobile-friendly)
* Simple and distraction-free writing environment


## 🛠 **Tech Stack**

### **Frontend**

* React.js
* LocalStorage (data storage)

### **UI / Styling**

* CSS 

### **Tools**

* GitBook (project documentation)

---

## 🔄 **How It Works**

1. You learn something new.
2. You write an explanation in LearnSpace using your own words.
3. You can add tags to categorize your entry.
4. Entries are stored in **LocalStorage** — no backend needed.
5. Each new day you add an entry increases your **streak**.
6. Each entry gives you **XP**, helping measure consistency and progress.

---

## 📄 **Pages & Components**

### 📌 Pages

* Sign Up Page — Create a new user account.

* Select Tags Page — Choose the topics/tags you are interested in.

* Login Page — Log into the app.

* Home Page — Overview of your learning progress and navigation.

* Create New Entry Page — Write and save a new learning entry.

* Profile Page — View and edit your user profile.

* My Notes Page — Contains drafts or unsaved learning notes.

### 🧩 Core Components

* EntryCard
* TagSelector
* StreakCounter
* XPDisplay
* Navbar
* EntryEditor

### Core Components (file map)

- `src/pages/Feed.jsx` — main feed renderer (shows entries and now merges followed-users' entries)
- `src/components/Post.jsx` — the entry card (renders title, content, footer actions like like/save/comment)
- `src/pages/NewPost.jsx` & `src/components/NewPostForm.jsx` — compose new entries and save drafts
- `src/pages/Profile.jsx` — profile view for the current user or any `/:username` route
- `src/components/UserSection.jsx` — header area of profile (avatar, XP, streaks and follow button)
- `src/components/ProfileTabs.jsx` — tabs for Posts / Saved / Notes inside a profile
- `src/components/CommentsPanel.jsx` — comment UI and comment submission logic
- `src/components/NavBar.jsx` — top navigation, search (people / tags / entries) and route helpers
- `src/pages/PostPage.jsx` & `src/pages/TagPage.jsx` — dedicated pages for single entry and tag filtering
- `src/pages/Notes.jsx` — drafts / My Notes listing and editor
- `src/components/AppShell.jsx` & `src/App.jsx` — app shell, routing, and persistent handlers (XP/streak awarding, posts persistence)

These components are intentionally small and local-first so you can reason about persistence in a browser environment.

---

## ⚙ **Installation**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/akins-b/cs-girlies-hackathon
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

The app runs on:

```
http://localhost:5173
```

---

## 🗂 **Project Structure**

```
learnspace/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── utils/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

---

## 🚀 **Future Improvements**

* Backend (Node.js + Express + PostgreSQL)
* Real user accounts & authentication
* Community feed
* Comments & discussions
* AI suggestions to improve explanations
* Mobile app (React Native)
* Cloud sync across devices

---

## 📜 **License**

MIT License.

