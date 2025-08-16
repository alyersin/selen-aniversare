import { NextResponse } from "next/server";

// Debug endpoint pentru a verifica datele din KV
export async function GET() {
  try {
    console.log("🔍 Debug: Verificare KV database...");

    // Încearcă să încarci scorurile
    const scores = await loadScores();

    const debugInfo = {
      timestamp: new Date().toISOString(),
      kvConfigured: true,
      scoresCount: scores.length,
      scores: scores,
      message:
        scores.length > 0 ? "Scoruri găsite în KV" : "Nu sunt scoruri în KV",
    };

    console.log("📊 Debug info:", debugInfo);

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error("❌ Debug error:", error);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      kvConfigured: false,
      error: error.message,
      message: "KV nu este configurat corect",
    });
  }
}

// Funcția pentru încărcarea scorurilor (din API-ul principal)
async function loadScores() {
  try {
    const { kv } = await import("@vercel/kv");
    const SCORES_KEY = "game_scores";
    const kvScores = await kv.get(SCORES_KEY);
    return kvScores || [];
  } catch (error) {
    console.log("KV not configured, using in-memory storage:", error.message);
    return [];
  }
}
