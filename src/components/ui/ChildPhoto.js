import styles from "../../styles/main.module.css";

export default function ChildPhoto() {
  return (
    <>
      {/* Desktop version - fixed in top left corner */}
      <div className={styles.childPhotoContainerDesktop}>
        <div className={styles.childPhotoWrapper}>
          <img
            src="/photo/selen.jpg"
            alt="Selen - 5 ani"
            className={styles.childPhoto}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className={styles.photoPlaceholder}>
            <p>📸</p>
            <p>Imaginea Selen</p>
            <p className={styles.photoInstructions}>
              Adaugă imaginea în public/photo/selen.jpg
            </p>
          </div>
        </div>
      </div>

      {/* Mobile version - centered above title */}
      <div className={styles.childPhotoContainerMobile}>
        <div className={styles.childPhotoWrapper}>
          <img
            src="/photo/selen.jpg"
            alt="Selen - 5 ani"
            className={styles.childPhoto}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className={styles.photoPlaceholder}>
            <p>📸</p>
            <p>Imaginea Selen</p>
            <p className={styles.photoInstructions}>
              Adaugă imaginea în public/photo/selen.jpg
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
