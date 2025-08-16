import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/main.module.css";

export default function RankingModal({ showRanking, closeRanking }) {
  const [highScores, setHighScores] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Load scores from API
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores");
        if (response.ok) {
          const data = await response.json();
          setHighScores(data.scores || []);
        }
      } catch (error) {
        console.error("Error loading scores:", error);
      }
    };

    if (showRanking) {
      fetchScores();
    }
  }, [showRanking]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const goToFullRanking = () => {
    closeRanking();
    router.push("/ranking");
  };

  if (!showRanking) return null;

  return (
    <div className={styles.rankingModal} onClick={closeRanking}>
      <div
        className={styles.rankingContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeRanking} onClick={closeRanking}>
          ✕
        </button>

        <h2 className={styles.rankingTitle}>🏆 Ranking - Jocul baloanelor</h2>

        <div className={styles.rankingContent}>
          {highScores.length === 0 ? (
            <div className={styles.noScores}>
              <p>📊 Nu există scoruri încă!</p>
              <p>Joacă jocul pentru a apărea aici! 🎮</p>
            </div>
          ) : (
            <>
              <div className={styles.rankingList}>
                {highScores.slice(0, 3).map((score, index) => (
                  <div key={index} className={styles.rankingItem}>
                    <div className={styles.rankPosition}>
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                    </div>
                    <div className={styles.playerInfo}>
                      <span className={styles.playerName}>{score.player}</span>
                      <span className={styles.scoreDate}>{score.date}</span>
                    </div>
                    <div className={styles.scoreTime}>
                      {formatTime(score.time)}
                    </div>
                  </div>
                ))}
              </div>

              {highScores.length > 0 && (
                <div className={styles.viewAllButton}>
                  <button
                    onClick={goToFullRanking}
                    className={styles.viewAllRankingBtn}
                  >
                    📊 Vezi toate scorurile ({highScores.length} jucători)
                  </button>
                </div>
              )}

              <div className={styles.rankingStats}>
                <p>📈 Total jucători: {highScores.length}</p>
                {highScores.length > 0 && (
                  <p>⚡ Cel mai rapid: {formatTime(highScores[0].time)}</p>
                )}
              </div>

              <div className={styles.gameInstructions}>
                <h4>🎮 Cum să joci:</h4>
                <p>1. Sparge toate baloanele roșii de pe pagina principală</p>
                <p>2. Apasă "Da, vreau să joc!" în modalul care apare</p>
                <p>3. Introdu numele tău și apasă "Începe jocul!"</p>
                <p>4. Sparge baloanele cât mai repede posibil!</p>
                <p>5. Scorul tău va apărea aici în ranking</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
