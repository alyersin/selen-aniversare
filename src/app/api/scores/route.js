import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const SCORES_KEY = "game_scores";

// Load scores from KV storage
const loadScores = async () => {
  try {
    const scores = await kv.get(SCORES_KEY);
    return scores || [];
  } catch (error) {
    console.error("Error loading scores from KV:", error);
    return [];
  }
};

// Save scores to KV storage
const saveScores = async (newScores) => {
  try {
    await kv.set(SCORES_KEY, newScores);
    return true;
  } catch (error) {
    console.error("Error saving scores to KV:", error);
    return false;
  }
};

// GET - Retrieve all scores
export async function GET() {
  try {
    const scores = await loadScores();
    return NextResponse.json({ scores });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load scores" },
      { status: 500 }
    );
  }
}

// POST - Add new score
export async function POST(request) {
  try {
    const body = await request.json();
    const { player, time, date } = body;

    if (!player || !time || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const scores = await loadScores();

    // Check if player already exists
    const existingPlayerIndex = scores.findIndex(
      (score) => score.player === player
    );

    if (existingPlayerIndex !== -1) {
      // Player exists - update only if new score is better (lower time)
      const existingScore = scores[existingPlayerIndex];
      if (time < existingScore.time) {
        // Update with better score
        scores[existingPlayerIndex] = { player, time, date };
      }
      // If new score is worse, don't update
    } else {
      // New player - add to scores
      const newScore = { player, time, date };
      scores.push(newScore);
    }

    // Sort by time (ascending) and keep top 10
    scores.sort((a, b) => a.time - b.time);
    const topScores = scores.slice(0, 10);

    // Save back to KV storage
    const success = await saveScores(topScores);

    if (success) {
      return NextResponse.json({
        success: true,
        scores: topScores,
        message:
          existingPlayerIndex !== -1
            ? "Score updated successfully"
            : "Score saved successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to save score" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Clear all scores
export async function DELETE() {
  try {
    const success = await saveScores([]);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "All scores cleared successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to clear scores" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error clearing scores:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
