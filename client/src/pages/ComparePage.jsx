import { useState, useEffect } from 'react';
import { usePokemon } from '../contexts/PokemonContext';
import CompareSelector from '../components/CompareSelector';
import { Link } from 'wouter';
import { useDebounce } from '../hooks/useDebounce';
import PokemonStats from '../components/PokemonStats';
import TypeBadge from '../components/TypeBadge';

export default function ComparePage() {
  // State for the two Pokemon
  const [firstPokemon, setFirstPokemon] = useState(null);
  const [secondPokemon, setSecondPokemon] = useState(null);
  
  // State for search terms
  const [firstSearch, setFirstSearch] = useState('');
  const [secondSearch, setSecondSearch] = useState('');
  
  // State for search results
  const [firstSearchResults, setFirstSearchResults] = useState([]);
  const [secondSearchResults, setSecondSearchResults] = useState([]);
  
  // Debounced search terms
  const debouncedFirstSearch = useDebounce(firstSearch, 300);
  const debouncedSecondSearch = useDebounce(secondSearch, 300);
  
  // Context
  const { fetchPokemonById, allPokemon } = usePokemon();
  
  // Load any saved Pokemon to compare from localStorage
  useEffect(() => {
    const savedCompare = JSON.parse(localStorage.getItem('pokemonCompare') || '[]');
    
    if (savedCompare.length > 0) {
      setFirstPokemon(savedCompare[0]);
      
      if (savedCompare.length > 1) {
        setSecondPokemon(savedCompare[1]);
      }
    }
  }, []);
  
  // Filter Pokemon for first search
  useEffect(() => {
    if (debouncedFirstSearch.trim() === '') {
      setFirstSearchResults([]);
      return;
    }
    
    const results = allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(debouncedFirstSearch.toLowerCase()) ||
      pokemon.id.toString() === debouncedFirstSearch
    ).slice(0, 5);
    
    setFirstSearchResults(results);
  }, [debouncedFirstSearch, allPokemon]);
  
  // Filter Pokemon for second search
  useEffect(() => {
    if (debouncedSecondSearch.trim() === '') {
      setSecondSearchResults([]);
      return;
    }
    
    const results = allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(debouncedSecondSearch.toLowerCase()) ||
      pokemon.id.toString() === debouncedSecondSearch
    ).slice(0, 5);
    
    setSecondSearchResults(results);
  }, [debouncedSecondSearch, allPokemon]);
  
  // Handle selecting a Pokemon
  const handleSelectFirst = async (pokemon) => {
    setFirstPokemon(pokemon);
    setFirstSearch('');
    setFirstSearchResults([]);
    updateLocalStorage(pokemon, secondPokemon);
  };
  
  const handleSelectSecond = async (pokemon) => {
    setSecondPokemon(pokemon);
    setSecondSearch('');
    setSecondSearchResults([]);
    updateLocalStorage(firstPokemon, pokemon);
  };
  
  // Update localStorage
  const updateLocalStorage = (first, second) => {
    const compareList = [];
    if (first) compareList.push(first);
    if (second) compareList.push(second);
    localStorage.setItem('pokemonCompare', JSON.stringify(compareList));
  };
  
  // Reset comparison
  const resetComparison = () => {
    setFirstPokemon(null);
    setSecondPokemon(null);
    localStorage.removeItem('pokemonCompare');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold">Compare Pokémon</h1>
        <p className="text-gray-600">Select two Pokémon to compare their stats side by side.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Pokemon Selection */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-pokeblue text-white">
            <h2 className="font-poppins font-semibold">First Pokémon</h2>
          </div>
          
          <div className="p-6">
            {!firstPokemon ? (
              <CompareSelector 
                searchTerm={firstSearch}
                setSearchTerm={setFirstSearch}
                searchResults={firstSearchResults}
                onSelectPokemon={handleSelectFirst}
                placeholder="Search for first Pokémon"
              />
            ) : (
              <div className="flex flex-col items-center">
                <img 
                  src={firstPokemon.sprites.other['official-artwork'].front_default || firstPokemon.sprites.front_default} 
                  alt={firstPokemon.name} 
                  className="h-40 object-contain"
                />
                <h3 className="text-xl font-poppins font-semibold mt-2 capitalize">{firstPokemon.name}</h3>
                <div className="text-sm text-gray-500 mb-2">#{String(firstPokemon.id).padStart(3, '0')}</div>
                <div className="flex space-x-2 mt-1">
                  {firstPokemon.types.map(typeInfo => (
                    <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
                  ))}
                </div>
                
                <PokemonStats stats={firstPokemon.stats} colorClass="bg-pokeblue" />
                
                <button 
                  onClick={() => {
                    setFirstPokemon(null);
                    updateLocalStorage(null, secondPokemon);
                  }}
                  className="mt-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Second Pokemon Selection */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-pokered text-white">
            <h2 className="font-poppins font-semibold">Second Pokémon</h2>
          </div>
          
          <div className="p-6">
            {!secondPokemon ? (
              <CompareSelector 
                searchTerm={secondSearch}
                setSearchTerm={setSecondSearch}
                searchResults={secondSearchResults}
                onSelectPokemon={handleSelectSecond}
                placeholder="Search for second Pokémon"
              />
            ) : (
              <div className="flex flex-col items-center">
                <img 
                  src={secondPokemon.sprites.other['official-artwork'].front_default || secondPokemon.sprites.front_default} 
                  alt={secondPokemon.name} 
                  className="h-40 object-contain"
                />
                <h3 className="text-xl font-poppins font-semibold mt-2 capitalize">{secondPokemon.name}</h3>
                <div className="text-sm text-gray-500 mb-2">#{String(secondPokemon.id).padStart(3, '0')}</div>
                <div className="flex space-x-2 mt-1">
                  {secondPokemon.types.map(typeInfo => (
                    <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
                  ))}
                </div>
                
                <PokemonStats stats={secondPokemon.stats} colorClass="bg-pokered" />
                
                <button 
                  onClick={() => {
                    setSecondPokemon(null);
                    updateLocalStorage(firstPokemon, null);
                  }}
                  className="mt-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button 
          onClick={resetComparison}
          className="bg-pokeblue text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors duration-200 mr-4"
          disabled={!firstPokemon && !secondPokemon}
        >
          Reset Comparison
        </button>
        
        <Link to="/" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-200">
          Back to List
        </Link>
      </div>
    </div>
  );
}
