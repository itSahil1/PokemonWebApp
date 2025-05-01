import { useState, useEffect } from 'react';
import { usePokemon } from '../contexts/PokemonContext';
import SearchAndFilters from '../components/SearchAndFilters';
import PokemonGrid from '../components/PokemonGrid';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const { 
    pokemonList, 
    isLoading, 
    error, 
    currentPage, 
    totalPages, 
    goToPage, 
    perPage, 
    setPerPage 
  } = usePokemon();
  
  // State for the filter panel visibility
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(window.innerWidth >= 768);
  
  // Handle window resize to show/hide filter panel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterPanelVisible(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle toggling the filter panel
  const toggleFilterPanel = () => {
    setIsFilterPanelVisible(prev => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Search and Filters */}
      <SearchAndFilters 
        isFilterPanelVisible={isFilterPanelVisible} 
        toggleFilterPanel={toggleFilterPanel} 
      />
      
      {/* Error Message */}
      {error && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-red-500 mb-6">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}
      
      {/* Pokemon Grid */}
      {!isLoading && !error && pokemonList && pokemonList.length > 0 && (
        <PokemonGrid pokemonList={pokemonList} />
      )}
      
      {/* Empty State */}
      {!isLoading && !error && (!pokemonList || pokemonList.length === 0) && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">No Pokémon Found</h2>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
      
      {/* Pagination */}
      {!isLoading && !error && pokemonList && pokemonList.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <span className="text-sm">Show</span>
            <select 
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pokered"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">per page</span>
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            goToPage={goToPage} 
          />
        </div>
      )}
    </div>
  );
}
