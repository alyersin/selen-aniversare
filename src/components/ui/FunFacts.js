import styles from "../../styles/main.module.css";

export default function FunFacts() {
  return (
    <div className={styles.funFacts}>
      <h3>Fapte amuzante despre a avea 5 ani! 🎯</h3>
      <div className={styles.factsGrid}>
        <div className={styles.fact}>
          <span className={styles.factIcon}>🎨</span>
          <p>Poți desena imagini minunate!</p>
        </div>
        <div className={styles.fact}>
          <span className={styles.factIcon}>📚</span>
          <p>Înveți să citești!</p>
        </div>
        <div className={styles.fact}>
          <span className={styles.factIcon}>🤝</span>
          <p>Faci prieteni grozavi!</p>
        </div>
        <div className={styles.fact}>
          <span className={styles.factIcon}>🎵</span>
          <p>Îți place să cânți și să dansezi!</p>
        </div>
      </div>
    </div>
  );
}
