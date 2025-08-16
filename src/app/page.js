"use client";

import { useState, useEffect } from "react";
import styles from "../styles/main.module.css";
import Header from "../components/layout/Header";
import InvitationDetails from "../components/ui/InvitationDetails";
import BirthdayCake from "../components/ui/BirthdayCake";
import InteractiveBalloons from "../components/ui/InteractiveBalloons";
import MapModal from "../components/modals/MapModal";
import AlarmModal from "../components/modals/AlarmModal";
import FunFacts from "../components/ui/FunFacts";
import AgeCounter from "../components/ui/AgeCounter";
import BirthdayMessage from "../components/ui/BirthdayMessage";
import Footer from "../components/layout/Footer";
import GameModal from "../components/modals/GameModal";
import RankingModal from "../components/modals/RankingModal";
import ConnectingDots from "../components/layout/ConnectingDots";
import AnimatedBackground from "../components/layout/AnimatedBackground";
import MusicPlayer from "../components/layout/MusicPlayer";
import Confetti from "../components/game/Confetti";
import MagicEffects from "../components/game/MagicEffects";
import ContactInfo from "../components/ui/ContactInfo";

export default function Home() {
  const [showCake, setShowCake] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [balloonPopCount, setBalloonPopCount] = useState(0);
  const [showMagic, setShowMagic] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [email, setEmail] = useState("");
  const [poppedBalloons, setPoppedBalloons] = useState(new Set());
  const [showGameModal, setShowGameModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showConnectingDots, setShowConnectingDots] = useState(true);
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    // Load ConnectingDots state from localStorage
    const savedConnectingDots = localStorage.getItem("showConnectingDots");
    if (savedConnectingDots !== null) {
      setShowConnectingDots(JSON.parse(savedConnectingDots));
    }

    // Load music state from localStorage
    const savedMusicState = localStorage.getItem("isMusicPlaying");
    if (savedMusicState !== null) {
      setIsMusicPlaying(JSON.parse(savedMusicState));
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Animate elements on page load
    const timer1 = setTimeout(() => setShowCake(true), 500);
    const timer3 = setTimeout(() => setShowBalloons(true), 1500);
    const timer4 = setTimeout(() => setShowMagic(true), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isClient]);

  const toggleMusic = () => {
    const newMusicState = !isMusicPlaying;
    setIsMusicPlaying(newMusicState);
    localStorage.setItem("isMusicPlaying", JSON.stringify(newMusicState));
  };

  const handleCakeClick = () => {
    console.log("Cake clicked! Setting showConfetti to true");
    setClickCount(clickCount + 1);
    setShowConfetti(true);
    setShowMagic(true);

    // Play cake click sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

    setTimeout(() => setShowConfetti(false), 3000);
    setTimeout(() => setShowMagic(false), 2000);
  };

  const handleBalloonClick = (index) => {
    // Don't allow clicking already popped balloons
    if (poppedBalloons.has(index)) return;

    setBalloonPopCount(balloonPopCount + 1);
    setPoppedBalloons((prev) => new Set([...prev, index]));

    // Check if all balloons are popped
    if (poppedBalloons.size + 1 === 5) {
      setTimeout(() => {
        setShowGameModal(true);
      }, 1000); // Show modal after 1 second
    }

    // Play balloon pop sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const openMapModal = () => {
    setShowMapModal(true);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
  };

  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/search/Elite+Beach+Faleza+Nord+Constanta",
      "_blank"
    );
  };

  const openAlarmModal = () => {
    setShowAlarmModal(true);
  };

  const closeAlarmModal = () => {
    setShowAlarmModal(false);
    setEmail("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      // For now, we'll just show a success message
      alert(
        `Mulțumim! Vei primi notificări la ${email} pentru ziua de naștere a Selen! 🎉`
      );
      closeAlarmModal();
    }
  };

  const handlePhoneClick = () => {
    window.open("tel:+40721152216", "_self");
  };

  const closeGameModal = () => {
    setShowGameModal(false);
    setPlayerName("");
  };

  const startGame = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      const encodedName = encodeURIComponent(playerName.trim());
      window.open(`/game?player=${encodedName}`, "_blank");
      closeGameModal();
    }
  };

  const toggleConnectingDots = () => {
    const newState = !showConnectingDots;
    setShowConnectingDots(newState);
    localStorage.setItem("showConnectingDots", JSON.stringify(newState));
  };

  const closeRanking = () => {
    setShowRanking(false);
  };

  const toggleRanking = () => {
    setShowRanking(!showRanking);
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Background layers */}
      {showConnectingDots && <ConnectingDots />}
      <AnimatedBackground />

      {/* Music player */}
      <MusicPlayer
        isMusicPlaying={isMusicPlaying}
        toggleMusic={toggleMusic}
        showConnectingDots={showConnectingDots}
        toggleConnectingDots={toggleConnectingDots}
        showRanking={showRanking}
        toggleRanking={toggleRanking}
      />

      {/* Modals */}
      <MapModal
        showMapModal={showMapModal}
        closeMapModal={closeMapModal}
        openGoogleMaps={openGoogleMaps}
      />

      <AlarmModal
        showAlarmModal={showAlarmModal}
        closeAlarmModal={closeAlarmModal}
        email={email}
        setEmail={setEmail}
        handleEmailSubmit={handleEmailSubmit}
      />

      <GameModal
        showGameModal={showGameModal}
        closeGameModal={closeGameModal}
        playerName={playerName}
        setPlayerName={setPlayerName}
        startGame={startGame}
      />

      <RankingModal showRanking={showRanking} closeRanking={closeRanking} />

      {/* Effects */}
      <Confetti showConfetti={showConfetti} />
      <MagicEffects showMagic={showMagic} />

      {/* Main content */}
      <div className={styles.main}>
        <Header />

        <InvitationDetails openMapModal={openMapModal} />

        <BirthdayCake
          showCake={showCake}
          clickCount={clickCount}
          handleCakeClick={handleCakeClick}
        />

        <InteractiveBalloons
          showBalloons={showBalloons}
          balloonPopCount={balloonPopCount}
          handleBalloonClick={handleBalloonClick}
          poppedBalloons={poppedBalloons}
        />

        <BirthdayMessage />

        <AgeCounter />

        <FunFacts />

        <ContactInfo
          openAlarmModal={openAlarmModal}
          handlePhoneClick={handlePhoneClick}
        />

        <Footer />
      </div>
    </div>
  );
}
