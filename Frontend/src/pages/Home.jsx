import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/cookies';
import '../styles/Home.css';

// Example club logo mapping (expand as needed)
const clubLogos = {
  'Manchester United': 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  'Manchester City': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  'Arsenal': 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'Liverpool': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  'Chelsea': 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  'Tottenham': 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  'Barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  'Bayern Munich': 'https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo_%282017%29.svg',
  // ...add more clubs as needed
};

const defaultBg = 'linear-gradient(120deg, #232526 0%, #414345 100%)';

const newsHeadlines = [
  'Champions League Final set for Wembley showdown!',
  'Transfer window heats up: Big names on the move.',
  'Liverpool secures dramatic late win in derby.',
  'Barcelona unveils new manager for next season.',
  'VAR controversy in Premier League sparks debate.',
  'Real Madrid eyes another La Liga title.',
  'Bundesliga: Bayern Munich extends unbeaten run.',
  'Serie A: Inter Milan clinches top spot.',
  'Saudi Pro League attracts more international stars.',
  'MLS: Messi scores stunning hat-trick for Inter Miami.'
];

export default function Home() {
  const [club, setClub] = useState('');
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const token = getCookie('token');
        if (!token) return;
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // console.log('Favorite API response:', res.data); // <-- For debugging
        const favClub = res.data?.favoriteClub;
        setClub(favClub);
        if (favClub && clubLogos[favClub]) {
          setBgUrl(clubLogos[favClub]);
        } else {
          setBgUrl('');
        }
      } catch (err) {
        setBgUrl('');
      }
    };
    fetchFavorite();
  }, []);

  return (
    <div
      className="home-bg home-layout"
      style={{
        background: bgUrl
          ? `linear-gradient(rgba(20,20,28,0.92), rgba(20,20,28,0.96)), url('${bgUrl}') center center/contain no-repeat, #232526`
          : defaultBg,
      }}
    >
      <div className="home-main-content">
        {club && <h2 className="fav-club-heading">Your favorite club: {club}</h2>}
      </div>
      <aside className="news-sidebar">
        <h3>Latest News</h3>
        <div className="news-marquee">
          <div className="news-marquee-inner">
            {newsHeadlines.map((headline, idx) => (
              <div className="news-item" key={idx}>{headline}</div>
            ))}
            {/* Repeat for seamless scroll */}
            {newsHeadlines.map((headline, idx) => (
              <div className="news-item" key={idx + newsHeadlines.length}>{headline}</div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
