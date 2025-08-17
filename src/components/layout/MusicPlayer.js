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
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Birthday song notes (La mulți ani melody)
  const birthdayNotes = [
    { note: 'C4', duration: 0.5 },
    { note: 'C4', duration: 0.5 },
    { note: 'D4', duration: 1 },
    { note: 'C4', duration: 1 },
    { note: 'F4', duration: 1 },
    { note: 'E4', duration: 2 },
    
    { note: 'C4', duration: 0.5 },
    { note: 'C4', duration: 0.5 },
    { note: 'D4', duration: 1 },
    { note: 'C4', duration: 1 },
    { note: 'G4', duration: 1 },
    { note: 'F4', duration: 2 },
    
    { note: 'C4', duration: 0.5 },
    { note: 'C4', duration: 0.5 },
    { note: 'C5', duration: 1 },
    { note: 'A4', duration: 1 },
    { note: 'F4', duration: 1 },
    { note: 'E4', duration: 1 },
    { note: 'D4', duration: 2 },
    
    { note: 'A#4', duration: 0.5 },
    { note: 'A#4', duration: 0.5 },
    { note: 'A4', duration: 1 },
    { note: 'F4', duration: 1 },
    { note: 'G4', duration: 1 },
    { note: 'F4', duration: 2 }
  ];

  // Convert note to frequency
  const noteToFrequency = (note) => {
    const notes = { 'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23, 'G': 392.00, 'A': 440.00, 'A#': 466.16, 'B': 493.88 };
    const noteName = note.slice(0, -1);
    const octave = parseInt(note.slice(-1));
    return notes[noteName] * Math.pow(2, octave - 4);
  };

  // Play birthday song
  const playBirthdaySong = () => {
    if (!audioContextRef.current || !isMusicPlaying) return;

    let currentTime = audioContextRef.current.currentTime;
    let noteIndex = 0;

    const playNextNote = () => {
      if (!isMusicPlaying || noteIndex >= birthdayNotes.length) {
        // Restart the song
        if (isMusicPlaying) {
          noteIndex = 0;
          currentTime = audioContextRef.current.currentTime;
          playNextNote();
        }
        return;
      }

      const note = birthdayNotes[noteIndex];
      const frequency = noteToFrequency(note.note);
      
      // Create oscillator for this note
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, currentTime);
      oscillator.type = 'sine';
      
      // Set volume envelope
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1, currentTime + note.duration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration;
      noteIndex++;
      
      // Schedule next note
      setTimeout(playNextNote, note.duration * 1000);
    };

    playNextNote();
  };

  // Control music based on state
  useEffect(() => {
    if (isMusicPlaying) {
      // Resume audio context if suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Start playing the birthday song
      playBirthdaySong();
    } else {
      // Stop any ongoing music
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isMusicPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <>
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
