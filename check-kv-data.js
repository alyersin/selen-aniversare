// Script pentru a verifica datele din KV database
// Rulează cu: node check-kv-data.js

import { kv } from "@vercel/kv";

async function checkKVData() {
  try {
    console.log("🔍 Verificare date din KV database...");

    // Încearcă să încarci scorurile
    const scores = await kv.get("game_scores");

    if (scores && scores.length > 0) {
      console.log("✅ Scoruri găsite în KV database:");
      console.log("📊 Număr total scoruri:", scores.length);
      console.log("🏆 Top scoruri:");

      scores.forEach((score, index) => {
        const timeInSeconds = (score.time / 1000).toFixed(2);
        console.log(
          `  ${index + 1}. ${score.player} - ${timeInSeconds}s (${score.date})`
        );
      });
    } else {
      console.log("❌ Nu sunt scoruri în KV database");
      console.log("💡 Încearcă să joci un joc pentru a adăuga scoruri");
    }

    // Verifică și alte chei
    console.log("\n🔍 Verificare toate cheile din KV...");
    const keys = await kv.keys("*");
    console.log("📋 Chei găsite:", keys);
  } catch (error) {
    console.error("❌ Eroare la verificarea KV database:", error.message);
    console.log("💡 Asigură-te că KV database-ul este configurat corect");
  }
}

checkKVData();
