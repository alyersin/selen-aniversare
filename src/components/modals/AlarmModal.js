import styles from "../../styles/main.module.css";

export default function AlarmModal({
  showAlarmModal,
  closeAlarmModal,
  email,
  setEmail,
  handleEmailSubmit,
}) {
  if (!showAlarmModal) return null;

  return (
    <div className={styles.alarmModal} onClick={closeAlarmModal}>
      <div
        className={styles.alarmContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeAlarm} onClick={closeAlarmModal}>
          ✕
        </button>
        <h3>🔔 Setează alarma pentru ziua de naștere!</h3>
        <div className={styles.alarmContent}>
          <div className={styles.alarmInfo}>
            <h4>Ziua de naștere a Selen</h4>
            <p>📅 23 August 2025</p>
            <p>🕐 18:00</p>
            <p>📍 Elite Beach, Faleza Nord</p>
          </div>
          <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">📧 Adresa ta de email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplu@email.com"
                className={styles.emailInput}
                required
              />
            </div>
            <div className={styles.alarmButtons}>
              <button type="submit" className={styles.setAlarmButton}>
                🔔 Setează alarma
              </button>
              <button
                type="button"
                onClick={closeAlarmModal}
                className={styles.cancelButton}
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
