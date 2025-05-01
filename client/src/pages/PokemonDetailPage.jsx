import { useState, useEffect, useCallback } from 'react';
import { useRoute, Link } from 'wouter';
import { usePokemon } from '../contexts/PokemonContext';
import { useFavorites } from '../contexts/FavoritesContext';
import PokemonDetail from '../components/PokemonDetail';
import PokemonAbilities from '../components/PokemonAbilities';
import PokemonMoves from '../components/PokemonMoves';
import PokemonEvolution from '../components/PokemonEvolution';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PokemonDetailPage() {
  // Get the Pokemon ID from the URL
  const [, params] = useRoute('/pokemon/:id');
  const pokemonId = params?.id;
  
  // State
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [activeTab, setActiveTab] = useState('abilities');
  
  // Context
  const { fetchPokemonById, fetchEvolutionChain, isLoading, error } = usePokemon();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Fetch Pokemon data
  useEffect(() => {
    if (pokemonId) {
      const loadPokemonData = async () => {
        const data = await fetchPokemonById(pokemonId);
        setPokemon(data);
        
        // Fetch evolution chain
        const evolutionData = await fetchEvolutionChain(pokemonId);
        setEvolutionChain(evolutionData);
      };
      
      loadPokemonData();
    }
  }, [pokemonId, fetchPokemonById, fetchEvolutionChain]);
  
  // Handle "Add to Compare" button
  const handleAddToCompare = useCallback(() => {
    // Store the pokemon in localStorage for comparison
    if (pokemon) {
      const compareList = JSON.parse(localStorage.getItem('pokemonCompare') || '[]');
      
      // Only add if not already in the list and max 2
      if (!compareList.some(p => p.id === pokemon.id) && compareList.length < 2) {
        compareList.push(pokemon);
        localStorage.setItem('pokemonCompare', JSON.stringify(compareList));
        alert(`${pokemon.name} added to comparison.`);
      } else if (compareList.length >= 2) {
        alert('You can only compare 2 Pokémon. Please go to the Compare page to reset.');
      }
    }
  }, [pokemon]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation Bar */}
      <div className="mb-6 flex justify-between items-center">
        <Link to="/" className="flex items-center text-pokeblue hover:text-pokered transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to List
        </Link>
        
        {pokemon && (
          <div className="flex space-x-3">
            <button 
              onClick={handleAddToCompare}
              className="text-pokeblue hover:text-pokered transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Compare
            </button>
            
            <button 
              onClick={() => toggleFavorite(pokemon)}
              className={`${isFavorite(pokemon.id) ? 'text-pokered' : 'text-gray-400 hover:text-pokered'} transition-colors duration-200`}
              aria-label={isFavorite(pokemon.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite(pokemon.id) ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}
      
      {/* Error Message */}
      {error && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-red-500 mb-6">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {/* Pokemon Detail Card */}
      {!isLoading && !error && pokemon && (
        <>
          <PokemonDetail pokemon={pokemon} />
          
          {/* Tabs Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button 
                  className={`px-4 py-3 font-medium ${activeTab === 'abilities' ? 'text-pokeblue border-b-2 border-pokeblue' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('abilities')}
                >
                  Abilities
                </button>
                <button 
                  className={`px-4 py-3 font-medium ${activeTab === 'moves' ? 'text-pokeblue border-b-2 border-pokeblue' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('moves')}
                >
                  Moves
                </button>
                <button 
                  className={`px-4 py-3 font-medium ${activeTab === 'evolution' ? 'text-pokeblue border-b-2 border-pokeblue' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('evolution')}
                >
                  Evolution
                </button>
              </nav>
            </div>
            
            {/* Abilities Tab Content */}
            {activeTab === 'abilities' && (
              <PokemonAbilities abilities={pokemon.abilities} />
            )}
            
            {/* Moves Tab Content */}
            {activeTab === 'moves' && (
              <PokemonMoves moves={pokemon.moves} />
            )}
            
            {/* Evolution Tab Content */}
            {activeTab === 'evolution' && (
              <PokemonEvolution evolutionChain={evolutionChain} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
