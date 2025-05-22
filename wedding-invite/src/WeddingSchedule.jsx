import React from 'react';
import './WeddingSchedule.css';

const WeddingSchedule = () => {
  return (
    
    <div className="calendar-wrapper">
      <div className="calendar-img-block">
        <img
          src="https://static.tildacdn.com/tild6663-3734-4136-a333-333666633039/_25.png"
          alt="Календарь"
          className="calendar-background"
        />
        <img
          src="https://static.tildacdn.com/tild6334-3930-4337-b935-363735373463/_.png"
          alt="Сердце"
          className="calendar-heart-png"
        />
      </div>
    </div>
  );
};

export default WeddingSchedule;
