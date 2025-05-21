"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('name');
  const [filteredGames, setFilteredGames] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/steamdatabase')
        const response = await data.json();
        setGames(response)
        setFilteredGames(response)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredGames([]);
      setHasSearched(false);
      return;
    }

    const results = games.filter((game) => {
      const fieldValue = game[searchColumn];
      return (
        typeof fieldValue === "string" &&
        fieldValue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredGames(results);
    setHasSearched(true);
  };

  return (
    <div>
      <div className="blue-box"><div className="yellow-accent"></div></div>

      <div className="opener">
        <h1 className="title">INTEREST ARCADE:</h1>
        <h1 className="title">STEAM GAME SEARCH</h1>
        <h2 className="names">BY SAM & BRITNEY</h2>
      </div>

      <div className="search-bar">
        <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)}>
          <option value="name">Name</option>
          <option value="developer">Developer</option>
          <option value="genres">Genre</option>
          <option value="steamspy_tags">Steam Tags</option>
        </select>

        <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        placeholder='Search...'
        />
      </div>

      {hasSearched && (
        <div className="game-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div className="game-card" key={game.id}>
              <div className="game-title-wrapper">
                <h3 className="game-title">{game.name}</h3>
                </div>
              <div className="game-content">
                <p className="game-info"><strong>Release:</strong> {game.release_date}</p>
                <p className="game-info"><strong>Developer:</strong> {game.developer}</p>
                <p className="game-info"><strong>Genres:</strong> {game.genres}</p>
                <p className="game-info"><strong>Tags:</strong> {game.steamspy_tags}</p>
                <p className="game-info"><strong>Price:</strong> ${game.price}</p>
              </div>
            </div>
          )) 
        ) : (
          <p>No results found.</p>
        )}
      </div>
      )}
      <div className="blue-box"><div className="yellow-accent"></div></div>
    </div>

  );
}
