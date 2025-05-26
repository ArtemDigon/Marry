import React, { useEffect, useRef, useState } from 'react';
import './WeddingInvite.css';
import WeddingSchedule from './WeddingSchedule';
import Timeline from './Timeline';
import WeddingCountdown from './WeddingCountdown';

const WeddingInvite = () => {
  const audioRef = useRef(null);
  const recaptchaRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false); // НЕ автостарт
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState(null);

  const toggleMusic = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown > 0) {
      alert(`Подождите ${cooldown} сек перед повторной отправкой`);
      return;
    }

    if (!captchaToken) {
      alert("Пожалуйста, подтвердите, что вы не робот");
      return;
    }

    const form = e.target;
    const data = {
      name: form.name.value,
      attending: form.attendance.value,
      transfer: form.transfer.value,
      captcha: captchaToken,
    };

    const encrypted = encryptData(data);
    const response = await sendEncryptedData(encrypted, captchaToken);

    alert("Ответ отправлен!");
    setCooldown(30);
    setCaptchaToken(null);
    recaptchaRef.current.reset();
  };

  return (
    <div className="invite-section">
      <div className="center-mask">
        <div className="date-block fade-all">
          <div className="date-text">16<br />08<br />25</div>
          <div className="date-line" />
        </div>

        <div className="initials-block fade-all">
          <span className="initial initial-k">A</span>
          <span className="initial initial-v">K</span>
        </div>

        <div className="invite-box">
          <div className="content-block fade-all">
            <h1 className="main-title">Один раз и на всю<br />жизнь...</h1>
            <h2 className="subtitle">Дорогие родные<br />и близкие!</h2>
            <p className="hint">
              Перед прочтением, пожалуйста,<br />включите музыку для атмосферы
            </p>

            <div className="music-toggle" onClick={toggleMusic}>
              <img
                src="https://static.tildacdn.com/tild3963-6466-4538-b335-373364326465/photo.png"
                alt="Music Toggle"
                style={{ opacity: isPlaying ? 1 : 0.3 }}
              />
            </div>
            <p className="hint">
            В нашей жизни предстоят счастливые<br />
            перемены! Мы хотим, чтобы в этот <br />
            день рядом с нами – были самые <br />
            близкие и дорогие для нас люди.<br />
            Будем рады разделить с вами <br /> 
            чудесный  праздник в день нашей свадьбы.</p>
          </div>

          <audio ref={audioRef} loop >
            <source src="/Make_Merry_-_Scott_Reinwand_(SkySound.cc).mp3" type="audio/mpeg" />
          </audio>
        </div>

        <div className="section-divider left" />
        <WeddingSchedule />
        <div className="section-divider right" />
        <h2 className="subtitle-plan">План дня</h2>
        <Timeline />
        <div className="section-divider left" />
        <h2 className="subtitle-plan">Место<br />проведения</h2>
        <h4 className="smalltitle">Ресторан <br />"Империал"</h4>
        <a
          href="https://yandex.com/maps/org/imperial/228923171872/?azimuth=5.497787143782138&ll=40.609283%2C44.897988&mode=search&sctx=ZAAAAAgBEAAaKAoSCcBeYcH9TkRAEbGKNzKPcEZAEhIJYVW9%2FE6TiT8R6%2BQMxR1vkj8iBgABAgMEBSgKOABA3qEBSAFiC2ZyZXNobmVzcz0wYh1zb3VyY2U9YnVzaW5lc3M6c3ByYXZfZXhwX3JlZmoCcnWdAc3MzD2gAQCoAQC9AerhFb6CAhDQmNC80L%2FQtdGA0LjQsNC7igIAkgIAmgIMZGVza3RvcC1tYXBz&sll=40.609283%2C44.897988&sspn=0.003325%2C0.001972&text=Империал&tilt=0.8726646259971648&utm_source=share&z=18.19"
          target="_blank"
          rel="noopener noreferrer"
          className="pretty-map-button"
        >
          📍 Открыть на карте
        </a>
        <div className="contacts">
          <h2 className="contacts-title">Контакты</h2>
          <p>Жених: +7 (989) 296-86-06 <a href="https://wa.me/79892968606">📱</a><br />
          Невеста: +7 (910) 473-31-82 <a href="https://wa.me/79104733182">📱</a></p>
        </div>
        <div className="section-divider right" />
        <h1 className="conten-title-end">С любовью,</h1>
        <h1 className="conten-title-end">Артем и<br />Кристина!</h1>
      </div>
      <WeddingCountdown />
    </div>
  );
};

export default WeddingInvite;
