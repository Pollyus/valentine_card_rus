import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as confetti from 'canvas-confetti'; // <--- Импортируем все как 'confetti'
import './ValentineQuestion.css';

function ValentineQuestion() {
  const [yesScale, setYesScale] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [showNoHint, setShowNoHint] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)' });

  const zoneRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const confettiInstanceRef = useRef(null); // Для хранения экземпляра конфетти
  

  // Инициализация и ресайз конфетти
  const resizeConfettiCanvas = useCallback(() => {
    if (!confettiCanvasRef.current) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    confettiCanvasRef.current.width = Math.floor(window.innerWidth * dpr);
    confettiCanvasRef.current.height = Math.floor(window.innerHeight * dpr);
    confettiCanvasRef.current.style.width = "100vw";
    confettiCanvasRef.current.style.height = "100vh";
  }, []);

  useEffect(() => {
    // Инициализация экземпляра конфетти
    if (confettiCanvasRef.current) {
      // confetti.create() ВОЗВРАЩАЕТ ФУНКЦИЮ, А НЕ ПРОМИС!
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: false,
        useWorker: true
      });
      confettiInstanceRef.current = myConfetti; // Сохраняем полученную функцию
    }

    resizeConfettiCanvas();
    window.addEventListener("resize", resizeConfettiCanvas);
    window.addEventListener("orientationchange", () => setTimeout(resizeConfettiCanvas, 150));

    return () => {
      window.removeEventListener("resize", resizeConfettiCanvas);
      window.removeEventListener("orientationchange", () => clearTimeout(resizeConfettiCanvas));
    };
  }, [resizeConfettiCanvas]);

  // Запуск анимации конфетти
  const fullScreenConfetti = useCallback(() => {
    if (!confettiInstanceRef.current) {
      console.warn("Confetti instance not ready.");
      return;
    }

    const end = Date.now() + 1600;

    (function frame() {
      confettiInstanceRef.current({ // <--- Вызываем сохраненную функцию
        particleCount: 12,
        spread: 90,
        startVelocity: 45,
        ticks: 180,
        origin: { x: Math.random(), y: Math.random() * 0.3 }
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    setTimeout(() => {
      confettiInstanceRef.current({ // <--- Вызываем сохраненную функцию
        particleCount: 300,
        spread: 140,
        startVelocity: 60,
        ticks: 220,
        origin: { x: 0.5, y: 0.55 }
      });
    }, 300);
  }, []);

  // ... остальной код компонента (growYes, clamp, moveNo, handleZonePointerMove, handleYesClick, handleNoClick)
  // ... он остается без изменений, так как он корректен.

  // Обработчик увеличения кнопки "Yes"
  const growYes = useCallback(() => {
    setYesScale(prevScale => Math.min(2.2, prevScale + 0.1));
  }, []);

  // Вспомогательная функция для ограничения значения
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // Обработчик перемещения кнопки "No"
  const moveNo = useCallback((px, py) => {
    if (!zoneRef.current || !noBtnRef.current) return;

    const z = zoneRef.current.getBoundingClientRect();
    const b = noBtnRef.current.getBoundingClientRect();

    let dx = (b.left + b.width / 2) - px;
    let dy = (b.top + b.height / 2) - py;
    let mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;

    let newLeft = (b.left - z.left) + dx * 15;
    let newTop  = (b.top - z.top) + dy * 15;

    newLeft = clamp(newLeft, 0, z.width - b.width);
    newTop  = clamp(newTop, 0, z.height - b.height);

    setNoBtnPosition({ left: `${newLeft}px`, top: `${newTop}px`, transform: 'none' });
    growYes();
  }, [growYes]);

  // Обработчик движения указателя в зоне
  const handleZonePointerMove = useCallback((e) => {
    if (!noBtnRef.current) return;

    const b = noBtnRef.current.getBoundingClientRect();
    const d = Math.hypot(
      (b.left + b.width / 2) - e.clientX,
      (b.top + b.height / 2) - e.clientY
    );
    if (d < 140) moveNo(e.clientX, e.clientY);
  }, [moveNo]);

  // Обработчик клика на "Yes"
  const handleYesClick = () => {
    setShowResult(true);
    resizeConfettiCanvas(); // Пересчитываем размер canvas перед запуском конфетти
    fullScreenConfetti();
  };

  // Обработчик клика на "No" (предотвращаем действие по умолчанию)
  const handleNoClick = (e) => {
    e.preventDefault();
    setShowNoHint(true);
  };


  return (
    <>
      <canvas ref={confettiCanvasRef} id="confettiCanvas"></canvas>

      <main>
        
        {!showResult && <h1>Ты будешь моей валетинкой?</h1>}

        {!showResult && (
          <section className="button-zone" ref={zoneRef} onPointerMove={handleZonePointerMove}>
            <button
              id="yesBtn"
              ref={yesBtnRef}
              onClick={handleYesClick}
              style={{ transform: `translateX(-50%) translateY(-50%) scale(${yesScale})` }}
            >
              ДА!
            </button>
            <button
              id="noBtn"
              ref={noBtnRef}
              onClick={handleNoClick}
              style={noBtnPosition}
            >
              нет
            </button>
          </section>
        )}

        {!showResult && showNoHint && ( // Добавлено условие showNoHint
            <div className="hint" id="hint">Кажется, ты промахнулся и нажал не ту кнопку 😈</div>
        )}

        {showResult && (
          <section className="result" id="result">
            <h2>Ура! 🎉</h2>
            <img
              className="fireworks"
              src="https://media.tenor.com/vpGDms5I3xMAAAAM/1111.gif"
              alt="Fireworks"
            />
          </section>
        )}
      </main>
    </>
  );
}

export default ValentineQuestion;
