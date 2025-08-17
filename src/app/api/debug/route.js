import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if Postgres is configured
    let postgresConfigured = false;
    let scores = [];
    let error = null;

    try {
      const { sql } = await import("@vercel/postgres");

      // Test connection by getting scores
      const result = await sql`
        SELECT COUNT(*) as count FROM game_scores
      `;

      postgresConfigured = true;

      // Get actual scores
      const scoresResult = await sql`
        SELECT username, score, game_mode, timestamp 
        FROM game_scores 
        ORDER BY score ASC, timestamp ASC
      `;

      scores = scoresResult.rows || [];
    } catch (err) {
      postgresConfigured = false;
      error = err.message;
    }

    return NextResponse.json({
      postgresConfigured,
      scoreCount: scores.length,
      scores: scores,
      error: error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
