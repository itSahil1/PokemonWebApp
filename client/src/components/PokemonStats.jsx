export default function PokemonStats({ stats, colorClass = "bg-pokered" }) {
  // Maximum stat values for base stats
  const MAX_STATS = {
    hp: 255,
    attack: 255,
    defense: 255,
    "special-attack": 255,
    "special-defense": 255,
    speed: 255
  };
  
  // Readable names for stats
  const STAT_NAMES = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed"
  };
  
  return (
    <div className="mt-6 space-y-3 w-full">
      {stats.map(stat => {
        const statName = stat.stat.name;
        const statValue = stat.base_stat;
        const maxValue = MAX_STATS[statName];
        const percentage = (statValue / maxValue) * 100;
        
        return (
          <div key={statName}>
            <div className="flex justify-between text-sm mb-1">
              <span>{STAT_NAMES[statName]}</span>
              <span>{statValue}/{maxValue}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${colorClass} h-2.5 rounded-full stat-fill`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
