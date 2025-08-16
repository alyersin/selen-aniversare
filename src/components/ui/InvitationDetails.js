import styles from "../../styles/main.module.css";

export default function InvitationDetails({ openMapModal }) {
  return (
    <div className={styles.invitationDetails}>
      <div className={styles.detailCard}>
        <h2>🎂 Detalii aniversare</h2>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>📅</span>
            <div className={styles.detailText}>
              <strong>Data:</strong>
              <p>23 August 2025</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>🕐</span>
            <div className={styles.detailText}>
              <strong>Ora:</strong>
              <p>18:00</p>
            </div>
          </div>
          <div className={styles.locationDetail}>
            <span className={styles.detailIcon}>📍</span>
            <div className={styles.detailText}>
              <strong>Locația:</strong>
              <p>Elite Beach, Faleza Nord</p>
            </div>
            <button className={styles.locationButton} onClick={openMapModal}>
              Vezi pe hartă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
