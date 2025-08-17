import styles from "../../styles/main.module.css";

export default function GameModal({
  showGameModal,
  closeGameModal,
  playerName,
  setPlayerName,
  startGame,
}) {
  if (!showGameModal) return null;

  return (
    <div className={styles.gameModal} onClick={closeGameModal}>
      <div
        className={styles.gameContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeGame} onClick={closeGameModal}>
          ✕
        </button>
        <h3>🎮 Vrei să jucăm un joc? 🎈</h3>
        <div className={styles.gameContent}>
          <div className={styles.gameInfo}>
            <h4>🎯 Jocul baloanelor</h4>
            <p>💥 Sparge baloanele cât mai repede!</p>
            <p>⏱️ Timpul se măsoară pentru scorul tău</p>
            <p>🏆 Vezi ranking-ul cu cei mai rapizi</p>
          </div>
          <form onSubmit={startGame} className={styles.gameForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="playerName">👤 Numele tău sau nickname:</label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="ex: Alex, SuperPlayer"
                className={styles.playerNameInput}
                required
                maxLength="20"
              />
            </div>
            <div className={styles.gameButtons}>
              <button type="submit" className={styles.startGameButton}>
                Începe jocul
              </button>
              <button
                type="button"
                onClick={closeGameModal}
                className={styles.cancelGameButton}
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
