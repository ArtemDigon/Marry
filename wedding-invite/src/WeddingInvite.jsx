import React, { useEffect, useRef, useState } from 'react';
import './WeddingInvite.css';
import WeddingSchedule from './WeddingSchedule';
import Timeline from './Timeline';
import ReCAPTCHA from 'react-google-recaptcha';
import { encryptData, sendEncryptedData } from './rsvp_form_encrypt';

const WeddingInvite = () => {
  const audioRef = useRef(null);
  const recaptchaRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
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
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(() => setIsPlaying(false));
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
        <div className="initials-line" />
        <div className="date-block fade-all">
          <div className="date-text">16<br />08<br />25</div>
          <div className="date-line" />
        </div>

        <div className="initials-block fade-all">
          <span className="initial initial-k">K</span>
          <span className="initial initial-v">A</span>
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

            <p className="bottom-text">
              Мы будем рады разделить с Вами<br />
              радость неповторимого для нас дня –<br />
              дня нашей свадьбы! Приглашаем<br />
              присоединиться к нашему празднику и<br />
              украсить его своим присутствием!
            </p>
          </div>
          
          <audio ref={audioRef} loop autoPlay>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
          </audio>
        </div>
        <div className="section-divider left" />
        <WeddingSchedule />
        <div className="section-divider right" />
        <h2 className="subtitle">План дня</h2>
        <Timeline />
        <div className="section-divider left" />
        <h2 className="subtitle">Место<br />проведения</h2>
        <h4 className="smalltitle">Ресторан <br />"Маленькая Швейцария"</h4>
        <a
          href="https://yandex.com/maps/-/CHCIRUjJ"
          target="_blank"
          rel="noopener noreferrer"
          className="pretty-map-button"
        >
          📍 Открыть на карте
        </a>
        <div className="section-divider right" />

        <div className="survey-section">
          <h3 className="survey-title">
            Ответьте, пожалуйста, на несколько<br />вопросов, которые<br />мы для Вас подготовили
          </h3>
          <div className="arrow-down">⬇</div>

          <form className="survey-form" onSubmit={handleSubmit}>
            <label>
              Ваше Имя и Фамилия
              <input type="text" name="name" required />
            </label>

            <fieldset>
              <legend>Сможете ли вы присутствовать на нашем торжестве?</legend>
              <label><input type="radio" name="attendance" value="С удовольствием приду" /> С удовольствием приду</label>
              <label><input type="radio" name="attendance" value="К сожалению, не смогу присутствовать" /> К сожалению, не смогу присутствовать</label>
              <label><input type="radio" name="attendance" value="Сообщу позже" /> Сообщу позже</label>
            </fieldset>

            <fieldset>
              <legend>Нужен ли вам трансфер?</legend>
              <label><input type="radio" name="transfer" value="Да" /> Да</label>
              <label><input type="radio" name="transfer" value="Нет" /> Нет</label>
            </fieldset>

            <div className="g-recaptcha">
              <ReCAPTCHA
                sitekey="6LciuEQrAAAAANVhBnd-J5jTuHDt6voadGpqhd55"
                ref={recaptchaRef}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>


            <button type="submit" className="submit-btn" disabled={cooldown > 0}>
              {cooldown > 0 ? `Подождите ${cooldown} сек` : "Отправить"}
            </button>
          </form>

          <div className="contacts">
            <h2 className="contacts-title">Контакты</h2>
            <p>Жених: +7 (989) 296-86-06 <br /><a href="https://wa.me/79892968606">📱</a></p>
            <p>Невеста: +7 (910) 473-31-82 <br /><a href="https://wa.me/79104733182">📱</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingInvite;
