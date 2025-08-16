import styles from "../../styles/main.module.css";

export default function Confetti({ showConfetti }) {
  if (!showConfetti) return null;

  const createConfetti = () => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
    ];
    const confetti = [];

    for (let i = 0; i < 50; i++) {
      confetti.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 2,
      });
    }
    return confetti;
  };

  const confetti = createConfetti();

  return (
    <div className={styles.confettiContainer}>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={styles.confetti}
          style={{
            left: piece.x,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
