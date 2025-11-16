# 🚀 **LearnSpace — Explain. Reflect. Grow.**

A fun, simple, gamified learning journal designed to help students learn better using the **Feynman Technique**.



## 🎥 Demo

🔗 **Live Demo:** *add your Netlify/Vercel URL*


📺 **Video Demo:** *add your YouTube link*


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

* Tailwind CSS / CSS Modules / Material UI 
* Icons (Lucide / HeroIcons / FontAwesome)

### **Tools**

* GitBook (project documentation)
* Netlify or Vercel (deployment)

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

---

## ⚙ **Installation**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/learnspace.git
cd learnspace
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm start
```

The app runs on:

```
http://localhost:3000
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

## 🖼 **Screenshots**

Add images in a `/screenshots` folder, then reference like this:

```
![Home Page](screenshots/home.png)
![Create Entry](screenshots/create-entry.png)
![Entries List](screenshots/entries.png)
![Progress Page](screenshots/progress.png)
```

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

