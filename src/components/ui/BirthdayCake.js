import styles from "../../styles/main.module.css";

export default function BirthdayCake({
  showCake,
  clickCount,
  handleCakeClick,
}) {
  return (
    <div className={`${styles.cakeContainer} ${showCake ? styles.show : ""}`}>
      <div className={styles.cake} onClick={handleCakeClick}>
        <div className={styles.cakeBase}>
          <div className={styles.cakeLayer}></div>
          <div className={styles.cakeLayer}></div>
          <div className={styles.cakeLayer}></div>
        </div>
        <div className={styles.candles}>
          <div className={styles.candle}></div>
          <div className={styles.candle}></div>
          <div className={styles.candle}></div>
          <div className={styles.candle}></div>
          <div className={styles.candle}></div>
        </div>
        <div className={styles.flames}>
          <div className={styles.flame}></div>
          <div className={styles.flame}></div>
          <div className={styles.flame}></div>
          <div className={styles.flame}></div>
          <div className={styles.flame}></div>
        </div>
      </div>
      <p className={styles.cakeText}>Apasă pe tort! 🎂</p>
      {clickCount > 0 && (
        <div className={styles.clickCount}>
          Ai apăsat de {clickCount} ori! 🎈
        </div>
      )}
    </div>
  );
}
