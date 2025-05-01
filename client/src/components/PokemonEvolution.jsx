import { useState, useEffect } from 'react';
import { usePokemon } from '../contexts/PokemonContext';
import { Link } from 'wouter';

export default function PokemonEvolution({ evolutionChain }) {
  const [evolutionData, setEvolutionData] = useState([]);
  const { fetchPokemonById, isLoading } = usePokemon();
  
  // Load detailed Pokemon data for each evolution stage
  useEffect(() => {
    const loadEvolutionDetails = async () => {
      if (evolutionChain && evolutionChain.length > 0) {
        const detailedEvolutions = await Promise.all(
          evolutionChain.map(async (evo) => {
            const pokemonData = await fetchPokemonById(evo.id);
            return {
              ...evo,
              pokemonData
            };
          })
        );
        
        setEvolutionData(detailedEvolutions);
      }
    };
    
    loadEvolutionDetails();
  }, [evolutionChain, fetchPokemonById]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading evolution data...</div>;
  }
  
  if (!evolutionChain || evolutionChain.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No evolution data available for this Pokémon.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-4">
        {evolutionData.map((evo, index) => (
          <div key={evo.id} className="flex flex-col items-center">
            {/* Add evolution arrows between Pokemon */}
            {index > 0 && (
              <div className="hidden md:flex flex-col items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="text-xs text-gray-500 mt-1">
                  {evo.min_level ? `Level ${evo.min_level}` : 
                   evo.trigger ? `${evo.trigger}` : 
                   evo.item ? `Use ${evo.item}` : 
                   'Special'}
                </div>
              </div>
            )}
            
            {/* Show arrow on mobile in vertical layout */}
            {index > 0 && (
              <div className="flex md:hidden flex-col items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="text-xs text-gray-500 mt-1">
                  {evo.min_level ? `Level ${evo.min_level}` : 
                   evo.trigger ? `${evo.trigger}` : 
                   evo.item ? `Use ${evo.item}` : 
                   'Special'}
                </div>
              </div>
            )}
            
            {/* Pokemon card */}
            <div className="text-center">
              {evo.pokemonData && (
                <>
                  <Link to={`/pokemon/${evo.id}`}>
                    <img 
                      src={evo.pokemonData.sprites?.other?.['official-artwork']?.front_default || evo.pokemonData.sprites?.front_default} 
                      alt={evo.name} 
                      className="h-32 mx-auto cursor-pointer hover:scale-110 transition-transform"
                    />
                  </Link>
                  <div className="mt-2">
                    <h3 className="font-poppins font-semibold capitalize">{evo.name}</h3>
                    <div className="text-sm text-gray-500">#{String(evo.id).padStart(3, '0')}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
