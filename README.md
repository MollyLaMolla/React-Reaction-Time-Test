# Reaction Time Test

Measure your reflexes, track your progress, and compete globally. Click when the screen turns green — fast, simple, and addictive.

## 🚀 Overview

This web app challenges users to click as quickly as possible when a red box turns green. The test runs for five rounds and calculates the average reaction time. Registered users can save their scores, track personal records, and compare themselves with thousands of players worldwide.

## 🔧 Features

- ⚡ Reaction test with 5 rounds
- 🔐 Authentication via Google or email/password
- 🧑‍🎨 Custom user profiles: username, tag, emoji avatar
- 📈 Real-time feedback: personal best, ranking, percentile
- 🏆 Leaderboard with 1000+ realistic players
- 🔁 Replay and improve your score anytime

## 📊 Result Screen

After each test, users receive:

- Average reaction time (ms)
- Best and worst score of the session
- Current global ranking (e.g. #141)
- Percentile feedback (e.g. Top 13.94%)
- Total number of players
- Notification if a new personal record is achieved

## 🏁 Leaderboard

- Displays top players with:
  - Username
  - Tag (e.g. #Zen, #Tryhard)
  - Emoji avatar
  - Reaction time in ms
- Paginated view (10 users per page)
- Navigation: First, Prev, Next, Last
- Highlights your current position

## 🧠 Tech Stack

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

## 🧪 Data Simulation

Includes a custom algorithm that generated 1000 realistic fake users with randomized:

- Reaction times
- Usernames
- Tags
- Emoji avatars

This populates the leaderboard with believable data for testing and UX validation. The algorithm is scalable and can generate any number of users.

## 📦 Installation

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd client
npm install
npm start
