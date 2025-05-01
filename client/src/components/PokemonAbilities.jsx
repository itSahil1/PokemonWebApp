import { useState, useEffect } from 'react';

export default function PokemonAbilities({ abilities }) {
  const [abilitiesWithDetails, setAbilitiesWithDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch detailed ability information
  useEffect(() => {
    const fetchAbilityDetails = async () => {
      setIsLoading(true);
      
      try {
        const detailedAbilities = await Promise.all(
          abilities.map(async (ability) => {
            const response = await fetch(ability.ability.url);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch ability details: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Find English description
            const englishFlavor = data.flavor_text_entries.find(
              entry => entry.language.name === 'en'
            );
            
            return {
              ...ability,
              name: ability.ability.name,
              is_hidden: ability.is_hidden,
              description: englishFlavor ? englishFlavor.flavor_text : 'No description available.'
            };
          })
        );
        
        setAbilitiesWithDetails(detailedAbilities);
      } catch (error) {
        console.error('Error fetching ability details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (abilities && abilities.length > 0) {
      fetchAbilityDetails();
    }
  }, [abilities]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading abilities...</div>;
  }
  
  if (!abilities || abilities.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No abilities found for this Pokémon.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ul className="space-y-4">
        {abilitiesWithDetails.map((ability) => (
          <li key={ability.name}>
            <h3 className="font-poppins font-semibold capitalize">
              {ability.name.replace('-', ' ')}
              {ability.is_hidden && <span className="ml-2 text-sm font-normal text-gray-500">(Hidden)</span>}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{ability.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
