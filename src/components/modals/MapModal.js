import styles from "../../styles/main.module.css";

export default function MapModal({
  showMapModal,
  closeMapModal,
  openGoogleMaps,
}) {
  if (!showMapModal) return null;

  return (
    <div className={styles.mapModal} onClick={closeMapModal}>
      <div className={styles.mapContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeMap} onClick={closeMapModal}>
          ✕
        </button>
        <h3>📍 Locația evenimentului</h3>
        <div className={styles.mapContent}>
          <div className={styles.locationInfo}>
            <h4>Elite Beach, Faleza Nord</h4>
            <p>Constanța</p>
          </div>
          <div className={styles.mapButtons}>
            <button className={styles.mapButton} onClick={openGoogleMaps}>
              🗺️ Deschide în Google Maps
            </button>
            <button
              className={styles.directionsButton}
              onClick={openGoogleMaps}
            >
              🚗 Obține direcții
            </button>
          </div>
          <div className={styles.mapPreview}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.268581439!2d28.6344!3d44.1733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDEwJzIzLjkiTiAyOMKwMzgnMDMuOSJF!5e0!3m2!1sen!2sro!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-cross-origin"
              title="Elite Beach, Faleza Nord"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
