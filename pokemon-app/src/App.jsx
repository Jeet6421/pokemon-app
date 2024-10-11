import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const results = response.data.results;

        // Fetch details for each Pokemon (name and image)
        const detailedPokemonPromises = results.map(async (pokemon) => {
          const pokemonDetails = await axios.get(pokemon.url);
          return {
            name: pokemonDetails.data.name,
            image: pokemonDetails.data.sprites.front_default
          };
        });

        const detailedPokemon = await Promise.all(detailedPokemonPromises);
        setPokemonList(detailedPokemon);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    };

    fetchPokemon();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="app-container">
      <h1>Pokédex</h1>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="pokemon-list">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon, index) => (
            <div key={index} className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
            </div>
          ))
        ) : (
          <p>No Pokémon found</p>
        )}
      </div>
    </div>
  );
};

export default App;
