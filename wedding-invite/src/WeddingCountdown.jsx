import React, { useState, useEffect } from 'react';
import './WeddingCountdown.css';

const WeddingCountdown = () => {
  const calculateTimeLeft = () => {
    const weddingDate = new Date('2025-08-16T16:00:00');
    const now = new Date();
    const difference = weddingDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-wrapper">
      <h2 className="countdown-title">До свадьбы осталось...</h2>
      <div className="countdown-timer">
        <div className="countdown-segment">
          <span className="number">{timeLeft.days}</span>
          <span className="label">Дней</span>
        </div>
        <div className="countdown-segment">
          <span className="number">{timeLeft.hours}</span>
          <span className="label">Часов</span>
        </div>
        <div className="countdown-segment">
          <span className="number">{timeLeft.minutes}</span>
          <span className="label">Минут</span>
        </div>
        <div className="countdown-segment">
          <span className="number">{timeLeft.seconds}</span>
          <span className="label">Секунд</span>
        </div>
      </div>
    </div>
  );
};

export default WeddingCountdown;
