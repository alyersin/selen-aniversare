"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/main.module.css";

export default function BalloonGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerName = searchParams.get("player") || "Jucător";

  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [time, setTime] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [totalBalloons] = useState(20);
  const [gameTime, setGameTime] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [isInsanityMode, setIsInsanityMode] = useState(false);
  const [showInsanityOption, setShowInsanityOption] = useState(false);
  const [balloonMovementInterval, setBalloonMovementInterval] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [criticismIndex, setCriticismIndex] = useState(0);
  const [selectedCriticism, setSelectedCriticism] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Load high scores from API and check if player is in top 3
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores");
        if (response.ok) {
          const data = await response.json();
          setHighScores(data.scores || []);

          // Check if current player is in top 3
          const top3Players = data.scores?.slice(0, 3) || [];
          const isPlayerInTop3 = top3Players.some(
            (score) => score.player === playerName
          );
          setShowInsanityOption(isPlayerInTop3);
        }
      } catch (error) {
        console.error("Error loading scores:", error);
      }
    };

    fetchScores();
  }, [playerName]);

  // Initialize balloons
  useEffect(() => {
    if (gameStarted && !gameFinished) {
      const newBalloons = [];
      for (let i = 0; i < totalBalloons; i++) {
        newBalloons.push({
          id: i,
          x: Math.random() * (window.innerWidth - 60), // Reduced margin for mobile
          y: Math.random() * (window.innerHeight - 120) + 80, // Reduced margin for mobile
          popped: false,
          color: getRandomBalloonColor(),
          vx: isInsanityMode ? (Math.random() - 0.5) * 86 : 0, // velocity X for insanity mode (MUCH faster!)
          vy: isInsanityMode ? (Math.random() - 0.5) * 86 : 0, // velocity Y for insanity mode (MUCH faster!)
        });
      }
      setBalloons(newBalloons);
      startTimeRef.current = Date.now();
    }
  }, [gameStarted, gameFinished, totalBalloons, isInsanityMode]);

  // Timer and balloon movement for insanity mode
  useEffect(() => {
    if (gameStarted && !gameFinished) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 10;

          // Auto-finish game if time exceeds 30 seconds in insanity mode
          if (isInsanityMode && newTime >= 30000) {
            finishGame();
          }

          return newTime;
        });
      }, 10);

      // Balloon movement for insanity mode
      if (isInsanityMode) {
        const movementInterval = setInterval(() => {
          setBalloons((prev) =>
            prev.map((balloon) => {
              if (balloon.popped) return balloon;

              let newX = balloon.x + balloon.vx;
              let newY = balloon.y + balloon.vy;
              let newVx = balloon.vx;
              let newVy = balloon.vy;

              // Bounce off walls with reduced margins for mobile
              if (newX <= 0 || newX >= window.innerWidth - 60) {
                newVx = -newVx;
                newX = Math.max(0, Math.min(window.innerWidth - 60, newX));
              }
              if (newY <= 80 || newY >= window.innerHeight - 120) {
                newVy = -newVy;
                newY = Math.max(80, Math.min(window.innerHeight - 120, newY));
              }

              return {
                ...balloon,
                x: newX,
                y: newY,
                vx: newVx,
                vy: newVy,
              };
            })
          );
        }, 50); // Update every 50ms for smooth movement

        setBalloonMovementInterval(movementInterval);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (balloonMovementInterval) {
        clearInterval(balloonMovementInterval);
      }
    };
  }, [gameStarted, gameFinished, isInsanityMode]);

  const getRandomBalloonColor = () => {
    const colors = ["🎈", "🎈", "🎈", "🎈", "🎈"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const startGame = (insanityMode = false) => {
    if (insanityMode) {
      // Start countdown for insanity mode
      setCountdown(5);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCountdown(null);
            // Start the actual game after countdown
            setGameStarted(true);
            setIsInsanityMode(true);
            setTime(0);
            setPoppedCount(0);
            setGameFinished(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Normal mode starts immediately
      setGameStarted(true);
      setIsInsanityMode(false);
      setTime(0);
      setPoppedCount(0);
      setGameFinished(false);
    }
  };

  const popBalloon = (id) => {
    if (gameFinished) return;

    setBalloons((prev) =>
      prev.map((balloon) =>
        balloon.id === id ? { ...balloon, popped: true } : balloon
      )
    );

    setPoppedCount((prev) => {
      const newCount = prev + 1;
      if (newCount === totalBalloons) {
        finishGame();
      }
      return newCount;
    });

    // Play pop sound
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

  const finishGame = async () => {
    setGameFinished(true);
    const endTime = Date.now();
    const gameDuration = endTime - startTimeRef.current;
    setGameTime(gameDuration);

    // If game was auto-finished due to time limit, set the time to 30 seconds
    if (isInsanityMode && time >= 30000) {
      setGameTime(30000);
    }

    // Select and save one criticism message for insanity mode
    if (isInsanityMode) {
      const criticism = getInsanityCriticism();
      setSelectedCriticism(criticism);
    }

    // Save score to server (only for normal mode, not insanity mode)
    if (!isInsanityMode) {
      try {
        const response = await fetch("/api/scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player: playerName,
            time: gameDuration,
            date: new Date().toLocaleDateString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setHighScores(data.scores || []);
        } else {
          console.error("Failed to save score");
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (balloonMovementInterval) {
      clearInterval(balloonMovementInterval);
    }
  };

  // All criticism messages organized by time thresholds
  const criticismMessages = {
    slow30: [
      {
        title: "🐌 Prea lent pentru INSANITY!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🐌 Viteza melcului nu e suficientă!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🐌 Ai viteza unui melc cu rucsac!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🐌 Mă mișc mai repede decât tine!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🐌 Ai nevoie de un scutec pentru viteza ta!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🦥 Ai viteza unui leneș!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🦥 Mă plictisesc așteptând după tine!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🦥 Ai nevoie de cafea pentru viteza ta!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🦥 Leneșii se mișcă mai repede!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un controller mai bun!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎮 Ai lag în realitate!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un upgrade la mouse!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un gaming chair!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un boost de viteză!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un motor mai puternic!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un turbo!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un rocket boost!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🔥 Nu ești suficient de nebun!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🔥 Ai nevoie de mai multă nebunie!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🔥 Nu ești suficient de INSANE!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🔥 Ai nevoie de mai multă energie!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎯 Ai nevoie de mai multă precizie!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎯 Ai nevoie de un upgrade la ochi!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎯 Ai nevoie de mai multă concentrare!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🎯 Ai nevoie de un upgrade la reflexe!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🏆 Nu ești suficient de bun!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🏆 Ai nevoie de mai mult antrenament!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🏆 Nu ești suficient de rapid!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
      {
        title: "🏆 Ai nevoie de mai multă practică!",
        message: "30 de secunde maxim pentru a termina nivelul!",
        action: "Jocul s-a oprit automat! Încearcă din nou! 🎮",
      },
    ],
    slow20: [
      {
        title: "🐔 Treci înapoi la nivelul găinilor!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐔 Nu ai ce cauta aici!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐔 Ești mai lent decât o găină cu ochelari!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐔 Găinile se mișcă mai repede decât tine!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐔 Ai nevoie de antrenament cu găinile!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un controller mai bun!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai lag în realitate!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un upgrade la mouse!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un gaming chair!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un boost de viteză!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un motor mai puternic!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un turbo!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un rocket boost!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },

      {
        title: "🔥 Nu ești suficient de nebun!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🔥 Ai nevoie de mai multă nebunie!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🔥 Nu ești suficient de INSANE!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🔥 Ai nevoie de mai multă energie!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de mai multă precizie!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de un upgrade la ochi!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de mai multă concentrare!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de un upgrade la reflexe!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Nu ești suficient de bun!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Ai nevoie de mai mult antrenament!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Nu ești suficient de rapid!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Ai nevoie de mai multă practică!",
        message:
          "20 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
    ],
    slow10: [
      {
        title: "🐢 Prea lent pentru INSANITY!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐢 Viteza țestoasei nu e suficientă!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐢 Ai nevoie de un motor pentru viteza ta!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐢 Țestoasele se mișcă mai repede!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🐢 Ai viteza unui melc cu rucsac!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un controller mai bun!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai lag în realitate!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un upgrade la mouse!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎮 Ai nevoie de un gaming chair!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un boost de viteză!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un motor mai puternic!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un turbo!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "⚡ Ai nevoie de un rocket boost!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },

      {
        title: "🔥 Nu ești suficient de nebun!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🔥 Ai nevoie de mai multă nebunie!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🔥 Nu ești suficient de INSANE!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🔥 Ai nevoie de mai multă energie!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de mai multă precizie!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de un upgrade la ochi!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de mai multă concentrare!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🎯 Ai nevoie de un upgrade la reflexe!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Nu ești suficient de bun!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Ai nevoie de mai mult antrenament!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Nu ești suficient de rapid!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
      {
        title: "🏆 Ai nevoie de mai multă practică!",
        message:
          "10 de secunde sau mai puțin pentru a fi considerat un jucător adevărat!",
        action: "Încearcă din nou sau revino la modul normal! 🎮",
      },
    ],
  };

  // Check different time thresholds for insanity mode criticism
  const getInsanityCriticism = () => {
    if (!isInsanityMode) return null;

    let messages;
    if (gameTime >= 30000) {
      messages = criticismMessages.slow30;
    } else if (gameTime >= 20000) {
      messages = criticismMessages.slow20;
    } else if (gameTime >= 10000) {
      messages = criticismMessages.slow10;
    } else {
      return null;
    }

    // Use random selection for variety
    const selectedMessage =
      messages[Math.floor(Math.random() * messages.length)];

    return selectedMessage;
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const goBack = () => {
    router.push("/");
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameFinished(false);
    setIsInsanityMode(false);
    setTime(0);
    setPoppedCount(0);
    setBalloons([]);
    setSelectedCriticism(null); // Reset selected criticism
    // Increment criticism index for next attempt
    setCriticismIndex((prev) => prev + 1);
  };

  if (countdown !== null) {
    return (
      <div className={styles.countdownScreen}>
        <div className={styles.countdownContent}>
          <h1>🔥 INSANITY ÎNCEPE ÎN</h1>
          <div className={styles.countdownNumber}>{countdown}</div>
          <p>Pregătește-te pentru nebunie! 🔥</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className={styles.gameStartScreen}>
        <div className={styles.gameStartContent}>
          <h1>🎈 Jocul baloanelor</h1>
          <p>
            Bună, <strong>{playerName}</strong>! 👋
          </p>

          {showInsanityOption && (
            <div className={styles.insanityUnlock}>
              <h3>🔥 Nivel special deblocat!</h3>
              <p>
                Ești în top 3! Ai acces la nivelul <strong>INSANITY</strong>!
              </p>
            </div>
          )}

          <div className={styles.gameModes}>
            <div className={styles.normalMode}>
              <h3>📋 Mod Normal:</h3>
              <ul>
                <li>💥 Sparge toate cele {totalBalloons} baloane</li>
                <li>⏱️ Timpul se măsoară automat</li>
                <li>🏆 Scorul mai mic = mai bun</li>
                <li>🎯 Fii cât mai rapid!</li>
              </ul>
              <button
                onClick={() => startGame(false)}
                className={styles.startGameBtn}
              >
                🎮 Începe jocul normal
              </button>
            </div>

            {showInsanityOption && (
              <div className={styles.insanityMode}>
                <h3>🔥 Mod INSANITY:</h3>
                <ul>
                  <li>💥 Sparge toate cele {totalBalloons} baloane</li>
                  <li>⚡ Baloanele se mișcă foarte repede!</li>
                  <li>🎯 Nivel extrem de dificil</li>
                  <li>🏆 Doar pentru cei mai buni!</li>
                  <li>⚠️ Scorul nu se salvează în ranking</li>
                </ul>
                <button
                  onClick={() => startGame(true)}
                  className={styles.insanityBtn}
                >
                  🔥 Începe Nebunia!
                </button>
              </div>
            )}
          </div>

          <button onClick={goBack} className={styles.backBtn}>
            ← Înapoi la invitație
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gamePageContainer}>
      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.gameStats}>
          <span>⏱️ Timp: {formatTime(time)}</span>
          <span>
            💥 Sparte: {poppedCount}/{totalBalloons}
          </span>
          <span>👤 {playerName}</span>
          {isInsanityMode && (
            <span className={styles.insanityBadge}>🔥 INSANITY</span>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className={styles.gameArea}>
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className={`${styles.gameBalloon} ${
              balloon.popped ? styles.popped : ""
            }`}
            style={{
              left: balloon.x,
              top: balloon.y,
            }}
            onClick={() => !balloon.popped && popBalloon(balloon.id)}
          >
            {balloon.popped ? "💥" : balloon.color}
          </div>
        ))}
      </div>

      {/* Game Finished Modal */}
      {gameFinished && (
        <div className={styles.gameFinishedModal}>
          <div className={styles.gameFinishedContent}>
            {isInsanityMode ? (
              selectedCriticism ? (
                <>
                  <h2>{selectedCriticism.title}</h2>
                  <p>
                    <strong>{playerName}</strong>, ai terminat în{" "}
                    <strong>{formatTime(gameTime)}</strong>!
                  </p>
                  <div className={styles.chickenMessage}>
                    <h3>🐔 Nu ai ce cauta aici!</h3>
                    <p>{selectedCriticism.message}</p>
                    <p>{selectedCriticism.action}</p>
                  </div>
                </>
              ) : (
                <>
                  <h2>🔥 INSANITY COMPLETAT!</h2>
                  <p>
                    Felicitări, <strong>{playerName}</strong>! Ai terminat
                    nivelul INSANITY în <strong>{formatTime(gameTime)}</strong>!
                  </p>
                  <div className={styles.insanityAchievement}>
                    <h3>🏆 Achievement deblocat!</h3>
                    <p>Ai dovedit că ești unul dintre cei mai buni jucători!</p>
                  </div>
                </>
              )
            ) : (
              <>
                <h2>🎉 Felicitări, {playerName}!</h2>
                <p>
                  Ai terminat jocul în <strong>{formatTime(gameTime)}</strong>!
                </p>

                <div className={styles.highScores}>
                  <h3>🏆 Top 10 Scoruri:</h3>
                  <div className={styles.scoresList}>
                    {highScores.map((score, index) => (
                      <div
                        key={index}
                        className={`${styles.scoreItem} ${
                          score.player === playerName && score.time === gameTime
                            ? styles.currentScore
                            : ""
                        }`}
                      >
                        <span className={styles.rank}>#{index + 1}</span>
                        <span className={styles.player}>{score.player}</span>
                        <span className={styles.time}>
                          {formatTime(score.time)}
                        </span>
                        <span className={styles.date}>{score.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className={styles.gameFinishedButtons}>
              <button onClick={playAgain} className={styles.playAgainBtn}>
                🎮 Joacă din nou
              </button>
              <button onClick={goBack} className={styles.backToInvitationBtn}>
                ← Înapoi la invitație
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
