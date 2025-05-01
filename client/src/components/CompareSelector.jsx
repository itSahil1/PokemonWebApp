import { useState, useEffect, useRef } from 'react';

export default function CompareSelector({ searchTerm, setSearchTerm, searchResults, onSelectPokemon, placeholder }) {
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef(null);
  
  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Show results when typing
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsResultsVisible(true);
  };
  
  return (
    <div ref={searchRef} className="w-full">
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pokeblue"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsResultsVisible(true)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {/* Search Results Dropdown */}
        {isResultsVisible && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((pokemon) => (
              <div 
                key={pokemon.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  onSelectPokemon(pokemon);
                  setIsResultsVisible(false);
                }}
              >
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                  className="w-10 h-10 mr-2"
                />
                <span className="capitalize">{pokemon.name}</span>
                <span className="ml-auto text-gray-500">#{String(pokemon.id).padStart(3, '0')}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* No Results Message */}
        {isResultsVisible && searchTerm && searchResults.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-center text-gray-500">
            No Pokémon found
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-500">
        <p>Search for a Pokémon by name or ID</p>
      </div>
    </div>
  );
}
