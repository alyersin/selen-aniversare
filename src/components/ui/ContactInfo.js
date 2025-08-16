import styles from "../../styles/main.module.css";

export default function ContactInfo({ openAlarmModal, handlePhoneClick }) {
  return (
    <div className={styles.contactInfo}>
      <h3>📞 Informații de contact</h3>
      <div className={styles.contactGrid}>
        <div className={styles.contactItem} onClick={handlePhoneClick}>
          <span className={styles.contactIcon}>📱</span>
          <div>
            <strong>Telefon:</strong>
            <p>0721 152 216</p>
            <p className={styles.clickToCall}>Click pentru a suna</p>
          </div>
        </div>
        <div className={styles.contactItem} onClick={openAlarmModal}>
          <span className={styles.contactIcon}>🔔</span>
          <div>
            <strong>Alarmă:</strong>
            <p>Setează notificări</p>
            <p className={styles.clickToAlarm}>Click pentru alarma</p>
          </div>
        </div>
      </div>
    </div>
  );
}
