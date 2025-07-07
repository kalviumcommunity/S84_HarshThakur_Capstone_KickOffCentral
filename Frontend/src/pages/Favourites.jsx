import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Favourites.css';
import { getCookie } from '../utils/cookies';

// League data with clubs and players
const leaguesData = {
  'Premier League': {
    clubs: {
      'Manchester United': ['Marcus Rashford', 'Bruno Fernandes', 'Rasmus Højlund'],
      'Manchester City': ['Erling Haaland', 'Kevin De Bruyne', 'Phil Foden'],
      'Arsenal': ['Bukayo Saka', 'Martin Ødegaard', 'Gabriel Martinelli'],
      'Liverpool': ['Mohamed Salah', 'Darwin Núñez', 'Luis Díaz'],
      'Chelsea': ['Cole Palmer', 'Nicolas Jackson', 'Raheem Sterling'],
      'Tottenham': ['Son Heung-min', 'Richarlison', 'Dejan Kulusevski'],
      'Aston Villa': ['Ollie Watkins', 'Douglas Luiz', 'Leon Bailey'],
      'Newcastle': ['Alexander Isak', 'Anthony Gordon', 'Callum Wilson']
    }
  },
  'La Liga': {
    clubs: {
      'Real Madrid': ['Jude Bellingham', 'Vinícius Júnior', 'Rodrygo'],
      'Barcelona': ['Robert Lewandowski', 'Frenkie de Jong', 'Raphinha'],
      'Atlético Madrid': ['Antoine Griezmann', 'Álvaro Morata', 'Marcos Llorente'],
      'Girona': ['Artem Dovbyk', 'Viktor Tsygankov', 'Sávio'],
      'Athletic Bilbao': ['Gorka Guruzeta', 'Iñaki Williams', 'Nico Williams'],
      'Real Sociedad': ['Takefusa Kubo', 'Mikel Oyarzabal', 'Brais Méndez'],
      'Real Betis': ['Isco', 'Ayoze Pérez', 'Willian José'],
      'Las Palmas': ['Marc Cardona', 'Sory Kaba', 'Sandro Ramírez']
    }
  },
  'Bundesliga': {
    clubs: {
      'Bayern Munich': ['Harry Kane', 'Jamal Musiala', 'Leroy Sané'],
      'Bayer Leverkusen': ['Victor Boniface', 'Florian Wirtz', 'Jeremie Frimpong'],
      'VfB Stuttgart': ['Serhou Guirassy', 'Deniz Undav', 'Chris Führich'],
      'RB Leipzig': ['Lois Openda', 'Xavi Simons', 'Benjamin Šeško'],
      'Borussia Dortmund': ['Donyell Malen', 'Julian Brandt', 'Karim Adeyemi'],
      'Eintracht Frankfurt': ['Omar Marmoush', 'Ansgar Knauff', 'Fares Chaibi'],
      'TSG Hoffenheim': ['Maximilian Beier', 'Andrej Kramarić', 'Ihlas Bebou'],
      'SC Freiburg': ['Vincenzo Grifo', 'Ritsu Dōan', 'Lucas Höler']
    }
  },
  'Ligue 1': {
    clubs: {
      'Paris Saint-Germain': ['Kylian Mbappé', 'Ousmane Dembélé', 'Randal Kolo Muani'],
      'AS Monaco': ['Wissam Ben Yedder', 'Takumi Minamino', 'Folarin Balogun'],
      'Brest': ['Steve Mounié', 'Mahdi Camara', 'Romain Del Castillo'],
      'Lille': ['Jonathan David', 'Yusuf Yazıcı', 'Edon Zhegrova'],
      'Nice': ['Terem Moffi', 'Gaëtan Laborde', 'Evann Guessand'],
      'Lens': ['Elye Wahi', 'Florian Sotoca', 'Wesley Saïd'],
      'Reims': ['Teddy Teuma', 'Mohamed Daramy', 'Amir Richardson'],
      'Strasbourg': ['Emanuel Emegha', 'Dilane Bakwa', 'Angelo Gabriel']
    }
  },
  'Serie A': {
    clubs: {
      'Inter Milan': ['Lautaro Martínez', 'Marcus Thuram', 'Federico Dimarco'],
      'Juventus': ['Dusan Vlahovic', 'Federico Chiesa', 'Kenan Yildiz'],
      'AC Milan': ['Olivier Giroud', 'Rafael Leão', 'Christian Pulisic'],
      'Napoli': ['Victor Osimhen', 'Khvicha Kvaratskhelia', 'Matteo Politano'],
      'Atalanta': ['Gianluca Scamacca', 'Ademola Lookman', 'Charles De Ketelaere'],
      'Fiorentina': ['Nicolás González', 'Giacomo Bonaventura', 'Lucas Beltrán'],
      'Roma': ['Romelu Lukaku', 'Paulo Dybala', 'Stephan El Shaarawy'],
      'Lazio': ['Ciro Immobile', 'Felipe Anderson', 'Mattia Zaccagni']
    }
  },
  'Saudi Pro League': {
    clubs: {
      'Al Hilal': ['Neymar Jr', 'Aleksandar Mitrović', 'Malcom'],
      'Al Nassr': ['Cristiano Ronaldo', 'Sadio Mané', 'Otávio'],
      'Al Ahli': ['Roberto Firmino', 'Gabri Veiga', 'Allan Saint-Maximin'],
      'Al Ittihad': ['Karim Benzema', 'N\'Golo Kanté', 'Fabinho'],
      'Al Shabab': ['Yannick Carrasco', 'Iago Aspas', 'Ever Banega'],
      'Al Ettifaq': ['Jordan Henderson', 'Georginio Wijnaldum', 'Moussa Dembélé'],
      'Al Taawoun': ['Álvaro Medrán', 'André Biyogo Poko', 'Khalid Al-Sumairi'],
      'Al Fateh': ['Cristian Tello', 'Firas Al-Buraikan', 'Sofiane Bendebka']
    }
  },
  'MLS': {
    clubs: {
      'Inter Miami': ['Lionel Messi', 'Luis Suárez', 'Jordi Alba'],
      'LA Galaxy': ['Riqui Puig', 'Dejan Joveljić', 'Douglas Costa'],
      'Seattle Sounders': ['Raúl Ruidíaz', 'Jordan Morris', 'Cristian Roldan'],
      'Portland Timbers': ['Evander', 'Felipe Mora', 'Santiago Moreno'],
      'New York City FC': ['Santiago Rodríguez', 'Mounsef Bakrar', 'Hannes Wolf'],
      'Atlanta United': ['Thiago Almada', 'Giorgos Giakoumakis', 'Saba Lobjanidze'],
      'FC Cincinnati': ['Luciano Acosta', 'Brandon Vazquez', 'Brenner'],
      'Columbus Crew': ['Cucho Hernández', 'Diego Rossi', 'Aidan Morris']
    }
  }
};

export default function Favourites() {
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLeagueChange = (league) => {
    setSelectedLeague(league);
    setSelectedClub('');
    setSelectedPlayer('');
  };

  const handleClubChange = (club) => {
    setSelectedClub(club);
    setSelectedPlayer('');
  };

  const handlePlayerChange = (player) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLeague || !selectedClub || !selectedPlayer) {
      setMessage({ text: 'Please select a league, club, and player', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/favorites`,
        {
          league: selectedLeague,
          club: selectedClub,
          player: selectedPlayer
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({ text: 'Favorites saved successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('Error saving favorites:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to save favorites', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const availableClubs = selectedLeague ? Object.keys(leaguesData[selectedLeague].clubs) : [];
  const availablePlayers = selectedClub ? leaguesData[selectedLeague]?.clubs[selectedClub] || [] : [];

  return (
    <div className="favourites-container">
      <div className="favourites-form">
        <h1>Select Your Favorites</h1>
        <p className="subtitle">Choose your favorite club and player from top leagues</p>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="selection-group">
            <label>
              <span className="label-text">League</span>
              <select 
                value={selectedLeague} 
                onChange={(e) => handleLeagueChange(e.target.value)}
                required
              >
                <option value="">Select a League</option>
                {Object.keys(leaguesData).map(league => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
            </label>
          </div>

          {selectedLeague && (
            <div className="selection-group">
              <label>
                <span className="label-text">Club</span>
                <select 
                  value={selectedClub} 
                  onChange={(e) => handleClubChange(e.target.value)}
                  required
                >
                  <option value="">Select a Club</option>
                  {availableClubs.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {selectedClub && (
            <div className="selection-group">
              <label>
                <span className="label-text">Player</span>
                <select 
                  value={selectedPlayer} 
                  onChange={(e) => handlePlayerChange(e.target.value)}
                  required
                >
                  <option value="">Select a Player</option>
                  {availablePlayers.map(player => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {selectedPlayer && (
            <div className="selection-summary">
              <h3>Your Selection</h3>
              <div className="summary-item">
                <strong>League:</strong> {selectedLeague}
              </div>
              <div className="summary-item">
                <strong>Club:</strong> {selectedClub}
              </div>
              <div className="summary-item">
                <strong>Player:</strong> {selectedPlayer}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !selectedPlayer}
            className="submit-btn"
          >
            {loading ? 'Saving...' : 'Save Favorites'}
          </button>
        </form>
      </div>
    </div>
  );
}
