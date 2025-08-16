"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/main.module.css";

export default function FullRankingPage() {
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores");
        if (response.ok) {
          const data = await response.json();
          setHighScores(data.scores || []);
        }
      } catch (error) {
        console.error("Error loading scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const goBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className={styles.rankingPage}>
        <div className={styles.rankingPageContent}>
          <h1>🏆 Se încarcă ranking-ul...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rankingPage}>
      <div className={styles.rankingPageContent}>
        <button className={styles.backToHomeBtn} onClick={goBack}>
          ← Înapoi la invitație
        </button>

        <h1 className={styles.rankingPageTitle}>
          🏆 Ranking Complet - Jocul baloanelor
        </h1>

        {highScores.length === 0 ? (
          <div className={styles.noScoresPage}>
            <p>📊 Nu există scoruri încă!</p>
            <p>Joacă jocul pentru a apărea aici! 🎮</p>
            <button onClick={goBack} className={styles.backToHomeBtn}>
              ← Înapoi la invitație
            </button>
          </div>
        ) : (
          <>
            <div className={styles.rankingStatsPage}>
              <p>📈 Total jucători: {highScores.length}</p>
              {highScores.length > 0 && (
                <p>⚡ Cel mai rapid: {formatTime(highScores[0].time)}</p>
              )}
            </div>

            <div className={styles.fullRankingList}>
              {highScores.map((score, index) => (
                <div key={index} className={styles.fullRankingItem}>
                  <div className={styles.fullRankPosition}>
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className={styles.fullPlayerInfo}>
                    <span className={styles.fullPlayerName}>
                      {score.player}
                    </span>
                    <span className={styles.fullScoreDate}>{score.date}</span>
                  </div>
                  <div className={styles.fullScoreTime}>
                    {formatTime(score.time)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.rankingPageInstructions}>
              <h3>🎮 Cum să joci:</h3>
              <p>1. Sparge toate baloanele roșii de pe pagina principală</p>
              <p>
                2. Apasă &quot;Da, vreau să joc!&quot; în modalul care apare
              </p>
              <p>3. Introdu numele tău și apasă &quot;Începe jocul!&quot;</p>
              <p>4. Sparge baloanele cât mai repede posibil!</p>
              <p>5. Scorul tău va apărea aici în ranking</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
