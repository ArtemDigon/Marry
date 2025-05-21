import React, { useEffect, useRef, useState } from 'react';
import './WeddingInvite.css';

const WeddingInvite = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  return (
    <div className="invite-section">
      {/* Белый центральный блок */}
      <div className="center-mask">
        <div className="date-block fade-all">
          <div className="date-text">16<br />08<br />25</div>
          <div className="date-line" />
        </div>

        <div className="initials-block fade-all">
          <span className="initial initial-k">K</span>
          <div className="initials-line" />
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
              Мы будем рады разделить с Вами радость неповторимого для нас дня — дня нашей свадьбы!<br />
              Приглашаем присоединиться к нашему празднику и украсить его своим присутствием!
            </p>
          </div>

          <audio ref={audioRef} loop autoPlay>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default WeddingInvite;
