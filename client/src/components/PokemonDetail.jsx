import TypeBadge from './TypeBadge';
import PokemonStats from './PokemonStats';

export default function PokemonDetail({ pokemon }) {
  // Get dominant type for background color
  const mainType = pokemon.types[0].type.name;
  
  // Format the height from decimeters to meters
  const heightInMeters = pokemon.height / 10;
  const heightInFeet = Math.floor(heightInMeters * 3.281);
  const heightInInches = Math.round((heightInMeters * 3.281 - heightInFeet) * 12);
  const formattedHeight = `${heightInMeters} m (${heightInFeet}'${heightInInches}")`;
  
  // Format the weight from hectograms to kilograms
  const weightInKg = pokemon.weight / 10;
  const weightInLbs = Math.round(weightInKg * 2.205 * 10) / 10;
  const formattedWeight = `${weightInKg} kg (${weightInLbs} lbs)`;
  
  // Get the image URL, fallback to default sprite if official artwork not available
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`bg-${mainType} text-white py-4 px-6 flex flex-col md:flex-row justify-between items-center`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold capitalize">{pokemon.name}</h1>
          <div className="text-sm opacity-80">#{String(pokemon.id).padStart(3, '0')}</div>
        </div>
        
        <div className="flex mt-2 md:mt-0 space-x-2">
          {pokemon.types.map(typeInfo => (
            <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} large />
          ))}
        </div>
      </div>
      
      <div className="p-6 flex flex-col md:flex-row">
        <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
          <img src={imageUrl} alt={pokemon.name} className="h-64 object-contain"/>
        </div>
        
        <div className="md:w-2/3 md:pl-8">
          <div className="mb-6">
            <h2 className="text-xl font-poppins font-semibold mb-2">Base Stats</h2>
            <PokemonStats stats={pokemon.stats} />
          </div>
          
          <div>
            <h2 className="text-xl font-poppins font-semibold mb-2">Physical Attributes</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p>{formattedHeight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p>{formattedWeight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Base Experience</p>
                <p>{pokemon.base_experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Abilities</p>
                <p>{pokemon.abilities.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
