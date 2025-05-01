import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Initialize favorites from localStorage or empty array
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Check if a Pokémon is in favorites
  const isFavorite = (pokemonId) => {
    return favorites.some(favorite => favorite.id === pokemonId);
  };
  
  // Add a Pokémon to favorites
  const addFavorite = (pokemon) => {
    if (!isFavorite(pokemon.id)) {
      setFavorites(prevFavorites => [...prevFavorites, pokemon]);
    }
  };
  
  // Remove a Pokémon from favorites
  const removeFavorite = (pokemonId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(favorite => favorite.id !== pokemonId)
    );
  };
  
  // Toggle a Pokémon's favorite status
  const toggleFavorite = (pokemon) => {
    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon);
    }
  };
  
  const value = {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
