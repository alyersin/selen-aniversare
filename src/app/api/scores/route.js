import { NextResponse } from "next/server";

// Fallback to in-memory storage if Postgres is not configured
let scores = [];

const loadScores = async () => {
  try {
    const { sql } = await import("@vercel/postgres");

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS game_scores (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        game_mode VARCHAR(20) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Get all scores ordered by score (best first)
    const result = await sql`
      SELECT username, score, game_mode, timestamp 
      FROM game_scores 
      ORDER BY score ASC, timestamp ASC
    `;

    return result.rows || [];
  } catch (error) {
    console.log(
      "Postgres not configured, using in-memory storage:",
      error.message
    );
    return scores; // Fallback
  }
};

const saveScores = async (newScores) => {
  try {
    const { sql } = await import("@vercel/postgres");

    // Clear existing scores
    await sql`DELETE FROM game_scores`;

    // Insert new scores
    for (const score of newScores) {
      await sql`
        INSERT INTO game_scores (username, score, game_mode, timestamp)
        VALUES (${score.username}, ${score.score}, ${score.gameMode}, ${score.timestamp})
      `;
    }

    return true;
  } catch (error) {
    console.log(
      "Postgres not configured, using in-memory storage:",
      error.message
    );
    scores = newScores; // Fallback
    return true;
  }
};

export async function GET() {
  try {
    const scores = await loadScores();
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Error loading scores:", error);
    return NextResponse.json(
      { error: "Failed to load scores" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { username, score, gameMode } = await request.json();

    if (!username || score === undefined || !gameMode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const currentScores = await loadScores();

    // Add new score
    const newScore = {
      username,
      score,
      gameMode,
      timestamp: new Date().toISOString(),
    };

    const updatedScores = [...currentScores, newScore];

    // Sort by score (best first) and keep only top 10
    updatedScores.sort((a, b) => a.score - b.score);
    const topScores = updatedScores.slice(0, 10);

    await saveScores(topScores);

    return NextResponse.json({ success: true, scores: topScores });
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { sql } = await import("@vercel/postgres");
    await sql`DELETE FROM game_scores`;
    scores = []; // Clear fallback too
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing scores:", error);
    scores = []; // Clear fallback
    return NextResponse.json({ success: true });
  }
}
