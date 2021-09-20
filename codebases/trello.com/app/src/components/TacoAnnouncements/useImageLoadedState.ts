import { useState, useEffect } from 'react';

export const useImageLoadedState = (src: string): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [src]);

  return isLoaded;
};
