import { Link, useRoute } from 'wouter';
import { usePokemon } from '../contexts/PokemonContext';

export default function Navbar() {
  // Active route check
  const [isHome] = useRoute('/');
  const [isFavorites] = useRoute('/favorites');
  const [isCompare] = useRoute('/compare');
  
  // Random pokemon function
  const { getRandomPokemonId } = usePokemon();
  
  // Handle random pokemon button click
  const handleRandomPokemon = () => {
    const randomId = getRandomPokemonId();
    window.location.href = `#/pokemon/${randomId}`;
  };

  return (
    <nav className="bg-pokered text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white"/>
                <path d="M2 12H8M16 12H22" stroke="white" strokeWidth="2"/>
              </svg>
              <h1 className="font-poppins font-bold text-xl sm:text-2xl tracking-tight">Pokémon Explorer</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className={`text-white hover:text-pokeyellow transition-colors duration-200 font-medium ${isHome ? 'text-pokeyellow' : ''}`}>
              Home
            </Link>
            <Link to="/favorites" className={`text-white hover:text-pokeyellow transition-colors duration-200 font-medium ${isFavorites ? 'text-pokeyellow' : ''}`}>
              Favorites
            </Link>
            <Link to="/compare" className={`text-white hover:text-pokeyellow transition-colors duration-200 font-medium ${isCompare ? 'text-pokeyellow' : ''}`}>
              Compare
            </Link>
            <button 
              onClick={handleRandomPokemon}
              className="bg-white text-pokered rounded-full p-1.5 hover:bg-pokeyellow transition-colors duration-200" 
              aria-label="Random Pokémon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
