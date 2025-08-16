"use client";

import { useEffect, useRef } from "react";

export default function ConnectingDots() {
  const canvasRef = useRef(null);
  const visibilityRadius = 800;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse = { x: null, y: null };
    const stars = [];
    const connectRadius = 100;
    const revealRadius = 300;
    const maxStarDistance = 150;

    const getStarCount = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 8000);
      return Math.max(200, Math.min(count, 3000));
    };

    const getRandomColor = () => {
      const lightRed = `rgba(255, ${Math.floor(
        Math.random() * 50
      )}, ${Math.floor(Math.random() * 50)}, 1)`;
      const lightBlue = `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(
        Math.random() * 50
      )}, 255, 1)`;
      const lightYellow = `rgba(255, 255, ${Math.floor(
        Math.random() * 50
      )}, 1)`;
      const lightPurple = `rgba(${
        150 + Math.floor(Math.random() * 50)
      }, ${Math.floor(Math.random() * 50)}, 255, 1)`;
      const lightGreen = `rgba(${Math.floor(
        Math.random() * 50
      )}, 255, ${Math.floor(Math.random() * 50)}, 1)`;
      const colors = [
        lightRed,
        lightBlue,
        lightYellow,
        lightPurple,
        lightGreen,
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const drawStar = (x, y, radius, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      // Draw a 5-pointed star
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x1 = x + radius * Math.cos(angle);
        const y1 = y + radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }

        const innerAngle = angle + Math.PI / 5;
        const x2 = x + radius * 0.4 * Math.cos(innerAngle);
        const y2 = y + radius * 0.4 * Math.sin(innerAngle);
        ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const generateStars = () => {
      stars.length = 0;
      const numStars = getStarCount();
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3.5 + 2.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: getRandomColor(),
        });
      }
    };

    const setupCanvasSize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const visibilityRadius = 800;

      stars.forEach((star) => {
        let alpha = 1;

        if (mouse.x !== null && mouse.y !== null) {
          const distToMouse = Math.hypot(star.x - mouse.x, star.y - mouse.y);
          if (distToMouse > visibilityRadius) {
            return;
          } else {
            alpha = 1 - distToMouse / visibilityRadius;
          }
        }

        drawStar(star.x, star.y, star.radius, star.color, alpha);
      });

      if (mouse.x !== null && mouse.y !== null) {
        stars.forEach((star) => {
          const distToMouse = Math.hypot(star.x - mouse.x, star.y - mouse.y);
          if (distToMouse < connectRadius) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(120, 180, 255, ${
              0.9 - distToMouse / connectRadius
            })`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });

        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const s1 = stars[i];
            const s2 = stars[j];
            const distBetween = Math.hypot(s1.x - s2.x, s1.y - s2.y);
            const s1ToMouse = Math.hypot(s1.x - mouse.x, s1.y - mouse.y);
            const s2ToMouse = Math.hypot(s2.x - mouse.x, s2.y - mouse.y);

            if (
              distBetween < maxStarDistance &&
              s1ToMouse < revealRadius &&
              s2ToMouse < revealRadius
            ) {
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.strokeStyle = `rgba(100, 149, 237, ${
                0.9 - distBetween / maxStarDistance
              })`;
              ctx.lineWidth = 2.5;
              ctx.stroke();
            }
          }
        }
      }

      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x <= 0 || star.x >= width) star.vx *= -1;
        if (star.y <= 0 || star.y >= height) star.vy *= -1;
      });

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      setupCanvasSize();
      generateStars();
    };

    handleResize();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        width: "100vw",
        height: "100vh",
        background: "transparent",
        pointerEvents: "none",
      }}
    />
  );
}
