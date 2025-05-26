import React, { useEffect, useRef } from 'react';
import './Timeline.css';
const events = [
  { time: '16:00', label: 'Сбор гостей', image: 'https://static.tildacdn.com/tild3065-6133-4838-a536-666562306131/_2.png', side: 'left' },
  { time: '16:30', label: 'Выездная церемония', image: 'https://static.tildacdn.com/tild3038-3636-4361-b531-643438393737/photo.png', side: 'right' },
  { time: '17:00', label: 'Банкет', image: 'https://static.tildacdn.com/tild3866-3736-4636-a364-316239616466/photo.png', side: 'left' },
];

const Timeline = () => {
    const eventRefs = useRef([]);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // запуск один раз
            }
          });
        },
        {
          threshold: 0.2, // 20% элемента должно быть видно
        }
      );
  
      eventRefs.current.forEach(ref => {
        if (ref) observer.observe(ref);
      });
  
      return () => observer.disconnect();
    }, []);
  
    return (
      <div className="timeline-wrapper">
        {events.map((event, idx) => (
          <div
            key={idx}
            ref={el => (eventRefs.current[idx] = el)}
            className={`timeline-event ${event.side}`}
          >
            <div className="event-box">
              <img src={event.image} alt={event.label} className="event-icon" />
              <div className="event-time">{event.time}</div>
              <div className="event-label">{event.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Timeline;
