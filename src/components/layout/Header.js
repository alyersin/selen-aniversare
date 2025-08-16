import styles from "../../styles/main.module.css";
import ChildPhoto from "../ui/ChildPhoto";

export default function Header() {
  return (
    <header className={styles.header}>
      <ChildPhoto />
      <h1 className={styles.title}>
        <span className={styles.rainbow}>🎉</span>
        <span className={styles.name}>Selen</span>
        <span className={styles.rainbow}>🎉</span>
      </h1>
      <h2 className={styles.subtitle}>Invitație la ziua de naștere!</h2>
      <p className={styles.date}>Vă invităm să sărbătorim împreună!</p>
    </header>
  );
}
