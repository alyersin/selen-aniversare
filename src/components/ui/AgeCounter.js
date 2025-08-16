import styles from "../../styles/main.module.css";

export default function AgeCounter() {
  return (
    <div className={styles.ageCounter}>
      <div className={styles.ageNumber}>5</div>
      <p>Ani!</p>
    </div>
  );
}
