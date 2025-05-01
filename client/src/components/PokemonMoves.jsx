import { useState, useEffect } from 'react';
import TypeBadge from './TypeBadge';

export default function PokemonMoves({ moves }) {
  const [movesWithDetails, setMovesWithDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const movesPerPage = 10;
  
  // Fetch detailed move information
  useEffect(() => {
    const fetchMoveDetails = async () => {
      setIsLoading(true);
      
      try {
        // Fetch first 20 moves only for performance
        const movesToFetch = moves.slice(0, 50);
        
        const detailedMoves = await Promise.all(
          movesToFetch.map(async (move) => {
            const response = await fetch(move.move.url);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch move details: ${response.status}`);
            }
            
            const data = await response.json();
            
            return {
              id: data.id,
              name: data.name,
              type: data.type,
              power: data.power,
              pp: data.pp,
              accuracy: data.accuracy,
              damage_class: data.damage_class
            };
          })
        );
        
        // Sort by move name
        detailedMoves.sort((a, b) => a.name.localeCompare(b.name));
        
        setMovesWithDetails(detailedMoves);
      } catch (error) {
        console.error('Error fetching move details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (moves && moves.length > 0) {
      fetchMoveDetails();
    }
  }, [moves]);
  
  // Filter moves based on search term
  const filteredMoves = movesWithDetails.filter(move => 
    move.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredMoves.length / movesPerPage);
  const indexOfLastMove = currentPage * movesPerPage;
  const indexOfFirstMove = indexOfLastMove - movesPerPage;
  const currentMoves = filteredMoves.slice(indexOfFirstMove, indexOfLastMove);
  
  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading moves...</div>;
  }
  
  if (!moves || moves.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No moves found for this Pokémon.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex mb-4">
        <input 
          type="text" 
          placeholder="Search moves..." 
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pokered w-full max-w-xs"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      {filteredMoves.length === 0 ? (
        <p className="text-center text-gray-500">No moves found matching "{searchTerm}"</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Power</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PP</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMoves.map((move) => (
                  <tr key={move.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium capitalize">{move.name.replace('-', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {move.type && <TypeBadge type={move.type.name} />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{move.damage_class?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{move.power || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{move.accuracy ? `${move.accuracy}%` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{move.pp || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mr-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 ml-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
