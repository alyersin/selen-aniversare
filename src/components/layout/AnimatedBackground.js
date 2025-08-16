import styles from "../../styles/main.module.css";

export default function AnimatedBackground() {
  return (
    <div className={styles.background}>
      <div className={styles.stars}></div>
      <div className={styles.stars}></div>
      <div className={styles.stars}></div>
      <div className={styles.stars}></div>
      <div className={styles.stars}></div>
      <div className={styles.stars}></div>
    </div>
  );
}
