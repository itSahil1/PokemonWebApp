export default function TypeBadge({ type, large = false }) {
  // Calculate the appropriate classes based on the type
  const classes = `${large ? 'px-3 py-1.5' : 'px-2 py-1'} rounded-full ${large ? 'text-sm' : 'text-xs'} font-roboto-condensed font-semibold text-white bg-${type}`;
  
  return (
    <span className={classes}>{type}</span>
  );
}
