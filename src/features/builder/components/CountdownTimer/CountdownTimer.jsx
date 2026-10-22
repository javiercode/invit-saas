import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

export const CountdownTimer = ({ targetDate, label = "Faltan para el gran día" }) => {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60),
          isExpired: false
        });
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0, isExpired: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="countdown-container countdown-expired">
        <span className="countdown-celebration">¡Hoy es el gran día! 🎉</span>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      {label && <p className="countdown-label">{label}</p>}
      <div className="countdown-grid">
        <div className="countdown-card">
          <span className="countdown-number">{String(timeLeft.dias).padStart(2, '0')}</span>
          <span className="countdown-unit">Días</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-number">{String(timeLeft.horas).padStart(2, '0')}</span>
          <span className="countdown-unit">Horas</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-number">{String(timeLeft.minutos).padStart(2, '0')}</span>
          <span className="countdown-unit">Min</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-number">{String(timeLeft.segundos).padStart(2, '0')}</span>
          <span className="countdown-unit">Seg</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
