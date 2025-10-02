// team_picker.js
// 🛠 Custom Cloud Team Picker App
// Author: Sashin Randall Shim
// Purpose: Create and manage random balanced teams using Firebase Firestore

// 1️⃣ Import Firebase functions
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// 2️⃣ Firebase configuration (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyAaNKmOFH3pdShHfW9vX6jqo2EtNSaJ3kc",
  authDomain: "team-picker-7e8f3.firebaseapp.com",
  projectId: "team-picker-7e8f3",
  storageBucket: "team-picker-7e8f3.firebasestorage.app",
  messagingSenderId: "457994763961",
  appId: "1:457994763961:web:669e919b82ee09b7e66568",
  measurementId: "G-YKCVHLL7D6"
};

// 3️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4️⃣ Add a new player to Firestore
async function insertPlayer(playerName, playerRole) {
  try {
    await addDoc(collection(db, "players"), {
      name: playerName,
      role: playerRole
    });
    console.log(`✅ ${playerName} added successfully!`);
  } catch (error) {
    console.error("❌ Error adding player:", error);
  }
}

// 5️⃣ Retrieve all players from Firestore
async function retrievePlayers() {
  const snapshot = await getDocs(collection(db, "players"));
  const playerList = [];
  snapshot.forEach(doc => {
    playerList.push({ id: doc.id, ...doc.data() });
  });
  return playerList;
}

// 6️⃣ Update a player's role
async function modifyPlayerRole(playerId, newRole) {
  try {
    const playerRef = doc(db, "players", playerId);
    await updateDoc(playerRef, { role: newRole });
    console.log(`🔄 Updated role to "${newRole}" for player ${playerId}`);
  } catch (error) {
    console.error("❌ Error updating role:", error);
  }
}

// 7️⃣ Delete a player
async function removePlayer(playerId) {
  try {
    await deleteDoc(doc(db, "players", playerId));
    console.log(`🗑 Removed player with ID: ${playerId}`);
  } catch (error) {
    console.error("❌ Error deleting player:", error);
  }
}

// 8️⃣ Generate balanced teams
async function makeBalancedTeams(teamSize = 2) {
  const players = await retrievePlayers();

  // Shuffle players
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }

  const teams = [];
  for (let i = 0; i < players.length; i += teamSize) {
    teams.push(players.slice(i, i + teamSize));
  }

  console.log("🎯 Balanced Teams:");
  teams.forEach((team, idx) => {
    console.log(
      `Team ${idx + 1}: ${team.map(p => `${p.name} (${p.role})`).join(", ")}`
    );
  });

  console.log(generateTeamSummary(teams));
}

// 9️⃣ Helper: Summarize teams
function generateTeamSummary(teams) {
  let summary = "📊 Team Summary:\n";
  teams.forEach((team, idx) => {
    const roles = team.map(p => p.role).join(", ");
    summary += `Team ${idx + 1} Roles: ${roles}\n`;
  });
  return summary;
}

// 🔟 Demo scenario
(async () => {
  console.log("🚀 Running Team Picker Demo...");

  await insertPlayer("Alex", "Leader");
  await insertPlayer("Jordan", "Strategist");
  await insertPlayer("Sam", "Researcher");
  await insertPlayer("Taylor", "Coordinator");
  await insertPlayer("Riley", "Analyst");

  const allPlayers = await retrievePlayers();
  console.log("📋 All Players:", allPlayers);

  await makeBalancedTeams(2);

  // Example: update a role and re-run
  if (allPlayers.length > 0) {
    await modifyPlayerRole(allPlayers[0].id, "Team Captain");
    await makeBalancedTeams(2);
    await removePlayer(allPlayers[0].id);
    console.log("🔄 After removal:");
    await makeBalancedTeams(2);
  }
})();
