import { useState, useCallback, useEffect } from 'react';

// Base URL for PokeAPI
const API_BASE_URL = 'https://pokeapi.co/api/v2';

export function usePokemonData() {
  const [pokemonList, setPokemonList] = useState([]);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch a list of all pokemon
  const fetchAllPokemon = useCallback(async (limit = 100, offset = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching Pokemon list...');
      const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
      }
      
      const data = await response.json();
      setTotalPokemon(data.count);
      
      console.log(`Fetching details for ${data.results.length} Pokemon...`);
      
      // Fetch detailed data for each pokemon - but limit the number of concurrent requests
      const detailedPokemonList = [];
      const batchSize = 20; // Process in smaller batches to avoid overwhelming the API
      
      for (let i = 0; i < data.results.length; i += batchSize) {
        const batch = data.results.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(pokemon => fetchPokemonByUrl(pokemon.url))
        );
        detailedPokemonList.push(...batchResults.filter(Boolean));
      }
      
      console.log(`Successfully loaded ${detailedPokemonList.length} Pokemon`);
      setPokemonList(detailedPokemonList);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Pokémon list:', err);
      // Even if there's an error, we should stop the loading state
      setIsLoading(false);
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
      console.log(`Fetching evolution chain for Pokemon #${pokemonId}...`);
      
      // First, get the species data which contains the evolution chain URL
      const pokemonResponse = await fetch(`${API_BASE_URL}/pokemon/${pokemonId}`);
      
      if (!pokemonResponse.ok) {
        throw new Error(`Failed to fetch Pokémon data: ${pokemonResponse.status}`);
      }
      
      const pokemonData = await pokemonResponse.json();
      
      if (!pokemonData || !pokemonData.species || !pokemonData.species.url) {
        throw new Error('Pokémon species data not available');
      }
      
      // Get species data directly
      const speciesResponse = await fetch(pokemonData.species.url);
      
      if (!speciesResponse.ok) {
        throw new Error(`Failed to fetch species data: ${speciesResponse.status}`);
      }
      
      const speciesData = await speciesResponse.json();
      
      if (!speciesData || !speciesData.evolution_chain || !speciesData.evolution_chain.url) {
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
      
      try {
        while (currentStage && currentStage.species) {
          const speciesName = currentStage.species.name;
          
          // Get the species details to get the Pokémon ID
          const speciesDetails = await fetch(`${API_BASE_URL}/pokemon-species/${speciesName}`);
          const speciesJson = await speciesDetails.json();
          
          if (speciesJson.varieties && speciesJson.varieties.length > 0) {
            // Find the default variety
            const defaultVariety = speciesJson.varieties.find(v => v.is_default);
            if (defaultVariety && defaultVariety.pokemon && defaultVariety.pokemon.url) {
              const pokemonResponse = await fetch(defaultVariety.pokemon.url);
              const pokemonJson = await pokemonResponse.json();
              
              // Add to the chain
              chain.push({
                id: pokemonJson.id,
                name: speciesName,
                min_level: currentStage.evolution_details[0]?.min_level || null,
                trigger: currentStage.evolution_details[0]?.trigger?.name || null,
                item: currentStage.evolution_details[0]?.item?.name || null,
              });
            }
          }
          
          // Move to the next evolution
          if (currentStage.evolves_to && currentStage.evolves_to.length > 0) {
            currentStage = currentStage.evolves_to[0];
          } else {
            currentStage = null;
          }
        }
      } catch (chainErr) {
        console.error('Error processing evolution chain:', chainErr);
        // Continue with whatever chain data we have so far
      }
      
      console.log(`Successfully fetched evolution chain with ${chain.length} stages`);
      return chain;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching evolution chain:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
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
