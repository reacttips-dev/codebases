import { useEffect } from 'react';

export const useScript = (url: string, callback?: () => void) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => {
      if (callback) {
        callback();
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};
