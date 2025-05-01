import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { usePokemonData } from '../hooks/usePokemonData';

const PokemonContext = createContext();

export function PokemonProvider({ children }) {
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  // Pokemon types for filtering
  const [pokemonTypes, setPokemonTypes] = useState([]);
  
  // Fetch pokemon data using custom hook
  const {
    pokemonList,
    totalPokemon,
    isLoading,
    error,
    fetchPokemonByUrl,
    fetchPokemonById,
    fetchEvolutionChain,
    fetchAllPokemonTypes,
    getRandomPokemonId
  } = usePokemonData();
  
  // Fetch pokemon types on initial load
  useEffect(() => {
    const loadTypes = async () => {
      const types = await fetchAllPokemonTypes();
      setPokemonTypes(types);
    };
    
    loadTypes();
  }, [fetchAllPokemonTypes]);
  
  // Filtered pokemon list based on search term and selected types
  const filteredPokemonList = useMemo(() => {
    if (!pokemonList) return [];
    
    return pokemonList.filter(pokemon => {
      // Filter by search term (name or id)
      const matchesSearch = 
        searchTerm === '' || 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm);
      
      // Filter by selected types
      const matchesTypes = 
        selectedTypes.length === 0 || 
        selectedTypes.every(type => 
          pokemon.types.some(t => t.type.name === type)
        );
      
      return matchesSearch && matchesTypes;
    });
  }, [pokemonList, searchTerm, selectedTypes]);
  
  // Sorted pokemon list based on sort criteria
  const sortedPokemonList = useMemo(() => {
    if (!filteredPokemonList) return [];
    
    return [...filteredPokemonList].sort((a, b) => {
      if (sortBy === 'id') {
        return a.id - b.id;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [filteredPokemonList, sortBy]);
  
  // Paginated pokemon list
  const paginatedPokemonList = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return sortedPokemonList.slice(startIndex, endIndex);
  }, [sortedPokemonList, currentPage, perPage]);
  
  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.ceil(sortedPokemonList.length / perPage);
  }, [sortedPokemonList, perPage]);
  
  // Handle page change
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Value object to be provided by context
  const value = {
    // Data
    pokemonList: paginatedPokemonList,
    allPokemon: sortedPokemonList,
    totalPokemon,
    pokemonTypes,
    
    // Pagination
    currentPage,
    perPage,
    totalPages,
    goToPage,
    setPerPage,
    
    // Search and filtering
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
    
    // Loading and error states
    isLoading,
    error,
    
    // API functions
    fetchPokemonByUrl,
    fetchPokemonById,
    fetchEvolutionChain,
    getRandomPokemonId
  };
  
  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}
