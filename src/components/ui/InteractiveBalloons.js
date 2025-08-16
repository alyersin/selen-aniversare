import styles from "../../styles/main.module.css";

export default function InteractiveBalloons({
  showBalloons,
  balloonPopCount,
  handleBalloonClick,
  poppedBalloons,
}) {
  return (
    <div
      className={`${styles.balloonsContainer} ${
        showBalloons ? styles.show : ""
      }`}
    >
      <h3 className={styles.balloonsTitle}>Sparge baloanele! 🎈</h3>
      <div className={styles.balloons}>
        <div
          className={`${styles.balloon} ${
            poppedBalloons.has(0) ? styles.popped : ""
          }`}
          style={{ "--delay": "0s" }}
          onClick={() => handleBalloonClick(0)}
          data-balloon="0"
        >
          {poppedBalloons.has(0) ? "💥" : "🎈"}
        </div>
        <div
          className={`${styles.balloon} ${
            poppedBalloons.has(1) ? styles.popped : ""
          }`}
          style={{ "--delay": "0.5s" }}
          onClick={() => handleBalloonClick(1)}
          data-balloon="1"
        >
          {poppedBalloons.has(1) ? "💥" : "🎈"}
        </div>
        <div
          className={`${styles.balloon} ${
            poppedBalloons.has(2) ? styles.popped : ""
          }`}
          style={{ "--delay": "1s" }}
          onClick={() => handleBalloonClick(2)}
          data-balloon="2"
        >
          {poppedBalloons.has(2) ? "💥" : "🎈"}
        </div>
        <div
          className={`${styles.balloon} ${
            poppedBalloons.has(3) ? styles.popped : ""
          }`}
          style={{ "--delay": "1.5s" }}
          onClick={() => handleBalloonClick(3)}
          data-balloon="3"
        >
          {poppedBalloons.has(3) ? "💥" : "🎈"}
        </div>
        <div
          className={`${styles.balloon} ${
            poppedBalloons.has(4) ? styles.popped : ""
          }`}
          style={{ "--delay": "2s" }}
          onClick={() => handleBalloonClick(4)}
          data-balloon="4"
        >
          {poppedBalloons.has(4) ? "💥" : "🎈"}
        </div>
      </div>
      {balloonPopCount > 0 && (
        <div className={styles.popCount}>
          Ai spart {balloonPopCount} baloan{balloonPopCount !== 1 ? "e" : ""}!
          🎊
        </div>
      )}
    </div>
  );
}
