"use client";

import { useRef, useEffect } from "react";
import styles from "../../styles/main.module.css";

export default function MusicPlayer({
  isMusicPlaying,
  toggleMusic,
  showConnectingDots,
  toggleConnectingDots,
  showRanking,
  toggleRanking,
}) {
  const youtubeRef = useRef(null);

  // Control YouTube iframe based on music state
  useEffect(() => {
    const iframe = youtubeRef.current;
    if (!iframe) return;

    if (isMusicPlaying) {
      // Start music
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    } else {
      // Pause music
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  }, [isMusicPlaying]);

  return (
    <>
      {/* Hidden YouTube iframe for background music */}
      <iframe
        ref={youtubeRef}
        src="https://www.youtube.com/embed/Q9N74UDE6Wc?enablejsapi=1&autoplay=0&loop=1&playlist=Q9N74UDE6Wc&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0"
        width="1"
        height="1"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
        title="Background Music"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Control buttons */}
      <div className={styles.controlButtons}>
        <button className={styles.musicButton} onClick={toggleMusic}>
          {isMusicPlaying ? "🔇" : "🎵"}
        </button>

        <button
          className={`${styles.toggleButton} ${
            showConnectingDots ? styles.active : ""
          }`}
          onClick={toggleConnectingDots}
          title={showConnectingDots ? "Oprește stelele" : "Pornește stelele"}
        >
          {showConnectingDots ? "⭐" : "✨"}
        </button>

        <button
          className={styles.rankingButton}
          onClick={toggleRanking}
          title="Vezi ranking-ul"
        >
          🏆
        </button>
      </div>
    </>
  );
}
