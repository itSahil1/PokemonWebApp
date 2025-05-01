/**
 * Format a Pokemon ID with leading zeros
 * @param {number} id - The Pokemon ID
 * @returns {string} - Formatted ID (e.g. "025")
 */
export const formatPokemonId = (id) => {
  return String(id).padStart(3, '0');
};

/**
 * Convert height from decimeters to meters and feet/inches
 * @param {number} height - Height in decimeters
 * @returns {string} - Formatted height string
 */
export const formatPokemonHeight = (height) => {
  const heightInMeters = height / 10;
  const heightInFeet = Math.floor(heightInMeters * 3.281);
  const heightInInches = Math.round((heightInMeters * 3.281 - heightInFeet) * 12);
  
  return `${heightInMeters} m (${heightInFeet}'${heightInInches}")`;
};

/**
 * Convert weight from hectograms to kilograms and pounds
 * @param {number} weight - Weight in hectograms
 * @returns {string} - Formatted weight string
 */
export const formatPokemonWeight = (weight) => {
  const weightInKg = weight / 10;
  const weightInLbs = Math.round(weightInKg * 2.205 * 10) / 10;
  
  return `${weightInKg} kg (${weightInLbs} lbs)`;
};

/**
 * Calculate stat percentage based on max value
 * @param {number} statValue - The stat value
 * @param {number} maxValue - The maximum possible value
 * @returns {number} - Percentage (0-100)
 */
export const calculateStatPercentage = (statValue, maxValue = 255) => {
  return (statValue / maxValue) * 100;
};

/**
 * Format a string by capitalizing first letter and replacing hyphens with spaces
 * @param {string} str - String to format
 * @returns {string} - Formatted string
 */
export const formatString = (str) => {
  if (!str) return '';
  
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get a readable name for a stat
 * @param {string} statName - The stat name from API
 * @returns {string} - Readable stat name
 */
export const getReadableStatName = (statName) => {
  const statNames = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed"
  };
  
  return statNames[statName] || statName;
};
