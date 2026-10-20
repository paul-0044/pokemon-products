import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const ANNOUNCEMENTS = [
  '5% OFF YOUR ORDER - USE CODE "5PERCENT"',
  'FREE SHIPPING ON ALL ORDERS $150+ USD (USA & CANADA)',
  'WORLDWIDE EXPRESS SHIPPING - FREE ON ORDERS $1,000+ USD',
  'LEAVE A VERIFIED REVIEW, GET A FREE HOLO IN YOUR ORDER',
  'OVER 20,000+ ORDERS FULFILLED | 4.9 OUT OF 5 RATING'
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      {/* Social links on desktop left */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="announcement-socials">
        <a href="https://www.facebook.com/PTCCollectibles/" target="_blank" rel="noreferrer" title="Facebook" style={{ color: '#aaa', fontSize: '0.8rem' }}>FB</a>
        <a href="https://www.instagram.com/ptccollectibles/" target="_blank" rel="noreferrer" title="Instagram" style={{ color: '#aaa', fontSize: '0.8rem' }}>IG</a>
        <a href="https://www.youtube.com/@PTCCollectibles" target="_blank" rel="noreferrer" title="YouTube" style={{ color: '#aaa', fontSize: '0.8rem' }}>YT</a>
        <a href="https://www.tiktok.com/@ptccollectibles" target="_blank" rel="noreferrer" title="TikTok" style={{ color: '#aaa', fontSize: '0.8rem' }}>TK</a>
      </div>

      {/* Rotating Announcement */}
      <div className="announcement-slider">
        <span
          key={currentIndex}
          className="animate-fade-down"
          style={{ letterSpacing: '0.06em', display: 'inline-block' }}
        >
          {ANNOUNCEMENTS[currentIndex]}
        </span>
      </div>

      {/* Currency Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#999' }}>Country/region:</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            background: '#222',
            color: '#fff',
            border: '1px solid #444',
            padding: '0.2rem 0.5rem',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <option value="USD">USD ($)</option>
          <option value="CAD">CAD ($)</option>
        </select>
      </div>
    </div>
  );
}
