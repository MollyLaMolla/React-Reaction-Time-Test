# ⚡ Reaction Time Test

Measure your reflexes, track your progress, and climb the global leaderboard.  
Click when the screen turns green — fast, simple, and addictive.

---

## 🧠 Overview

This web app challenges users to click as quickly as possible when a red box turns green.  
Each test runs for **5 rounds**, calculating your average reaction time.

Registered users can:

- Save scores and track personal records
- Create custom profiles with name, tag, and emoji avatar
- View their global ranking and percentile
- Compete with thousands of players worldwide

---

## 🔥 Features

- ⚡ Reaction test with 5 rounds
- 🔐 Google or email/password authentication
- 🧑‍🎨 Custom user profiles (username, tag, emoji avatar)
- 📈 Real-time feedback: personal best, ranking, percentile
- 🏆 Leaderboard with 1000+ realistic players
- 🔁 Replay and improve your score anytime

---

## 📊 Result Screen Highlights

After each test, users receive:

- **Average reaction time** (e.g. 194ms)
- **Best and worst score** of the session
- **Global ranking** (e.g. #141)
- **Percentile feedback** (e.g. Top 13.94%)
- **Total number of players**
- Notification: “New record!” or “Keep trying!”

---

## 🏁 Leaderboard Structure

- Displays top players with:
  - Username
  - Tag (e.g. #Zen, #Tryhard)
  - Emoji avatar
  - Reaction time in ms
- Paginated view (10 users per page)
- Navigation: First, Prev, Next, Last
- Highlights your current position

---

## 🧪 Data Simulation

Includes a custom algorithm that generated **1000 realistic fake users** with randomized:

- Reaction times
- Usernames
- Tags
- Emoji avatars

The algorithm is scalable and can generate any number of users for leaderboard population and UX testing.

---

## 🛠️ Tech Stack

**Frontend:**
- React
- HTML, CSS, JavaScript
- React Router, React Toastify
- FontAwesome, React Icons

**Backend:**
- Node.js
- Express
- PostgreSQL
- Passport (Google OAuth)
- JWT, Sessions
- Firebase (Auth + Hosting)
- Axios

---

## 👊 Installation

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm start
```
## 🌐 Live Demo
# [Try it here](https://react-reaction-time-test.onrender.com)
