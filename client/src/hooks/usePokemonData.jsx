import { useState, useCallback, useEffect } from 'react';

// Base URL for PokeAPI
const API_BASE_URL = 'https://pokeapi.co/api/v2';

export function usePokemonData() {
  const [pokemonList, setPokemonList] = useState([]);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch a list of all pokemon
  const fetchAllPokemon = useCallback(async (limit = 1000, offset = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
      }
      
      const data = await response.json();
      setTotalPokemon(data.count);
      
      // Fetch detailed data for each pokemon
      const detailedPokemonList = await Promise.all(
        data.results.map(pokemon => fetchPokemonByUrl(pokemon.url))
      );
      
      setPokemonList(detailedPokemonList.filter(Boolean));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Pokémon list:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch a single pokemon by URL
  const fetchPokemonByUrl = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        types: data.types,
        sprites: data.sprites,
        stats: data.stats,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities,
        species: data.species,
        moves: data.moves,
        base_experience: data.base_experience
      };
    } catch (err) {
      console.error(`Error fetching Pokémon details for ${url}:`, err);
      return null;
    }
  }, []);
  
  // Fetch a single pokemon by ID
  const fetchPokemonById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        types: data.types,
        sprites: data.sprites,
        stats: data.stats,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities,
        species: data.species,
        moves: data.moves,
        base_experience: data.base_experience
      };
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching Pokémon with ID ${id}:`, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch species data for a pokemon
  const fetchSpeciesData = useCallback(async (speciesUrl) => {
    try {
      const response = await fetch(speciesUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch species data: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error fetching species data:', err);
      return null;
    }
  }, []);
  
  // Fetch evolution chain for a pokemon
  const fetchEvolutionChain = useCallback(async (pokemonId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get the species data which contains the evolution chain URL
      const pokemonData = await fetchPokemonById(pokemonId);
      
      if (!pokemonData || !pokemonData.species) {
        throw new Error('Pokémon species data not available');
      }
      
      const speciesData = await fetchSpeciesData(pokemonData.species.url);
      
      if (!speciesData || !speciesData.evolution_chain) {
        throw new Error('Evolution chain data not available');
      }
      
      // Fetch the evolution chain data
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      
      if (!evolutionResponse.ok) {
        throw new Error(`Failed to fetch evolution chain: ${evolutionResponse.status}`);
      }
      
      const evolutionData = await evolutionResponse.json();
      
      // Process the evolution chain data
      const chain = [];
      let currentStage = evolutionData.chain;
      
      while (currentStage) {
        const speciesName = currentStage.species.name;
        
        // Get the species details to get the Pokémon ID
        const speciesDetails = await fetch(`${API_BASE_URL}/pokemon-species/${speciesName}`);
        const speciesJson = await speciesDetails.json();
        
        // Get the default variety of the species to get the Pokémon ID
        const defaultVarietyUrl = speciesJson.varieties.find(v => v.is_default).pokemon.url;
        const pokemonResponse = await fetch(defaultVarietyUrl);
        const pokemonJson = await pokemonResponse.json();
        
        // Add to the chain
        chain.push({
          id: pokemonJson.id,
          name: speciesName,
          min_level: currentStage.evolution_details[0]?.min_level || null,
          trigger: currentStage.evolution_details[0]?.trigger?.name || null,
          item: currentStage.evolution_details[0]?.item?.name || null,
        });
        
        // Move to the next evolution
        if (currentStage.evolves_to.length > 0) {
          currentStage = currentStage.evolves_to[0];
        } else {
          currentStage = null;
        }
      }
      
      return chain;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching evolution chain:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [fetchPokemonById, fetchSpeciesData]);
  
  // Fetch all pokemon types
  const fetchAllPokemonTypes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/type`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon types: ${response.status}`);
      }
      
      const data = await response.json();
      // Filter out non-standard types like 'unknown' and 'shadow'
      return data.results
        .filter(type => !['unknown', 'shadow'].includes(type.name))
        .map(type => type.name);
    } catch (err) {
      console.error('Error fetching Pokémon types:', err);
      return [];
    }
  }, []);
  
  // Get a random Pokemon ID
  const getRandomPokemonId = useCallback(() => {
    // Currently limited to the original 898 Pokémon
    return Math.floor(Math.random() * 898) + 1;
  }, []);
  
  // Fetch initial Pokemon data on component mount
  useEffect(() => {
    fetchAllPokemon();
  }, [fetchAllPokemon]);
  
  return {
    pokemonList,
    totalPokemon,
    isLoading,
    error,
    fetchAllPokemon,
    fetchPokemonByUrl,
    fetchPokemonById,
    fetchEvolutionChain,
    fetchAllPokemonTypes,
    getRandomPokemonId
  };
}
