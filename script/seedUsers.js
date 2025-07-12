import fs from "fs";

// Set di nomi fittizi
const names = [
  "Nova",
  "Blaze",
  "Echo",
  "Pixel",
  "Zara",
  "Kai",
  "Rex",
  "Milo",
  "Luna",
  "Axel",
  "Neko",
  "Dash",
  "Ivy",
  "Jinx",
  "Orion",
  "Tobi",
  "Skye",
  "Aria",
  "Zeek",
  "Lyra",
];

// Tag casuali
const tags = [
  "Speedster",
  "Chill",
  "Pro",
  "Casual",
  "Tryhard",
  "Underdog",
  "Focus",
  "Zen",
  "Panic Clicker",
  "Sniper",
];

// Icone emoji (copiate dal tuo `<select>`)
const icons = [
  "🐱",
  "🐶",
  "🐰",
  "🐷",
  "🐸",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐵",
  "🐔",
  "🦄",
  "🐴",
  "🐧",
  "🐺",
  "🐍",
  "🐙",
];

const fakeUsers = [];

for (let i = 1; i <= 1000; i++) {
  let reactionTime;
  const rand = Math.random();

  if (rand < 0.05) reactionTime = Math.floor(Math.random() * 30) + 150;
  else if (rand < 0.25) reactionTime = Math.floor(Math.random() * 40) + 180;
  else if (rand < 0.75) reactionTime = Math.floor(Math.random() * 50) + 220;
  else reactionTime = Math.floor(Math.random() * 80) + 270;

  const name = names[Math.floor(Math.random() * names.length)];
  const tag = tags[Math.floor(Math.random() * tags.length)];
  const icon = icons[Math.floor(Math.random() * icons.length)];

  fakeUsers.push({
    email: `user${i}@example.com`,
    best_score: reactionTime,
    username: `${name}${i}`,
    tag: tag,
    icon: icon,
  });
}

// Genera file SQL
let sql =
  "INSERT INTO users (email, best_score, custom_name, custom_tag, icon) VALUES\n";
sql += fakeUsers
  .map((u, idx) => {
    const comma = idx < fakeUsers.length - 1 ? "," : ";";
    return `('${u.email}', ${u.best_score}, '${u.username}', '${u.tag}', '${u.icon}')${comma}`;
  })
  .join("\n");

fs.writeFileSync("fake-users.sql", sql);

console.log("✅ File fake-users.sql creato con nomi, emoji e tag 🎉");
