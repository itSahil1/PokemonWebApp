import { Link } from 'wouter';
import { useFavorites } from '../contexts/FavoritesContext';
import TypeBadge from './TypeBadge';

export default function PokemonCard({ pokemon }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Format the ID to have leading zeros
  const formattedId = String(pokemon.id).padStart(3, '0');
  
  // Get the image URL, fallback to default sprite if official artwork not available
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-200 hover:shadow-lg">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={pokemon.name} 
          className="w-full h-40 object-contain bg-gray-100 p-2"
        />
        <button 
          onClick={() => toggleFavorite(pokemon)}
          className={`absolute top-2 right-2 ${isFavorite(pokemon.id) ? 'text-pokered' : 'text-gray-400 hover:text-pokered'} focus:outline-none transition-colors duration-200`}
          aria-label={isFavorite(pokemon.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite(pokemon.id) ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          #{formattedId}
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg font-poppins font-semibold mb-2 capitalize">{pokemon.name}</h2>
        <div className="flex gap-2">
          {pokemon.types.map(typeInfo => (
            <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
          ))}
        </div>
      </div>
      
      <Link 
        to={`/pokemon/${pokemon.id}`} 
        className="block text-center py-2 bg-pokeblue text-white hover:bg-opacity-90 transition-colors duration-200"
      >
        View Details
      </Link>
    </div>
  );
}
