import { useFavorites } from '../contexts/FavoritesContext';
import PokemonCard from '../components/PokemonCard';
import { Link } from 'wouter';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold">Your Favorite Pokémon</h1>
        <p className="text-gray-600">These are the Pokémon you've marked as favorites.</p>
      </div>
      
      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md py-10 px-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-poppins font-semibold mt-3">No favorites yet</h2>
          <p className="text-gray-600 mt-1">Browse Pokémon and click the heart icon to add favorites.</p>
          <Link to="/" className="inline-block mt-4 px-4 py-2 bg-pokeblue text-white rounded-md hover:bg-opacity-90 transition-colors duration-200">
            Browse Pokémon
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
}
