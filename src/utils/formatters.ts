/**
 * Extracts initials from a name
 * @param name The full name
 * @returns Up to 2 initials in uppercase
 */
export const getAvatarFallback = (name: string): string => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  /**
   * Get a light version of a color for tag backgrounds
   * @param color The base color (hex)
   * @param opacity The opacity to apply (0-100)
   * @returns Color with opacity
   */
  export const getLightColor = (color: string, opacity: number = 20): string => {
    return `${color}${Math.floor(opacity * 2.55).toString(16).padStart(2, '0')}`;
  };