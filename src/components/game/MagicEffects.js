import styles from "../../styles/main.module.css";

export default function MagicEffects({ showMagic }) {
  if (!showMagic) return null;

  return (
    <div className={styles.magicContainer}>
      <div className={styles.sparkle}>✨</div>
      <div className={styles.sparkle}>🌟</div>
      <div className={styles.sparkle}>💫</div>
      <div className={styles.sparkle}>⭐</div>
      <div className={styles.sparkle}>✨</div>
    </div>
  );
}
