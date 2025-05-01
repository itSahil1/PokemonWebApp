import { useState, useEffect } from 'react';
import { usePokemon } from '../contexts/PokemonContext';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchAndFilters({ isFilterPanelVisible, toggleFilterPanel }) {
  // Context
  const { 
    searchTerm, 
    setSearchTerm, 
    selectedTypes, 
    setSelectedTypes, 
    pokemonTypes, 
    sortBy, 
    setSortBy 
  } = usePokemon();
  
  // Local state for the input value
  const [inputValue, setInputValue] = useState(searchTerm);
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  
  // Update the search term when the debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);
  
  // Handle type filter toggle
  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Pokémon..." 
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pokered"
              value={inputValue}
              onChange={handleSearchChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-2 md:w-64">
          <select 
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pokered"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
          </select>
          
          <button 
            className="bg-pokeblue text-white p-3 rounded-md hover:bg-opacity-90 transition-colors duration-200"
            onClick={toggleFilterPanel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Type Filter Panel (Hidden by default on mobile) */}
      <div className={`mt-4 ${isFilterPanelVisible ? 'block' : 'hidden md:block'}`}>
        <h3 className="text-lg font-poppins font-semibold mb-2">Filter by Type</h3>
        <div className="flex flex-wrap gap-2">
          {pokemonTypes.map(type => (
            <button 
              key={type}
              className={`px-3 py-1.5 rounded-full text-sm font-roboto-condensed font-semibold text-white bg-${type} hover:bg-opacity-90 transition-colors duration-200 ${selectedTypes.includes(type) ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
              onClick={() => handleTypeToggle(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
