import {useState, useEffect} from 'react';

const useInfiniteScroll = (cb, el, offset = 0) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = ({target}, offset) => {
    if (target.scrollHeight - target.scrollTop - offset > target.clientHeight || isLoading) return;
    setIsLoading(true);
  };

  useEffect(() => {
    if (el.current) {
      const currentEl = el.current;
      currentEl.addEventListener('scroll', e => handleScroll(e, offset));
      return () => currentEl.removeEventListener('scroll', handleScroll);
    }
  }, [el]);

  useEffect(() => {
    if (!isLoading) return;
    cb();
  }, [isLoading]);

  return [isLoading, setIsLoading];
};

export default useInfiniteScroll;
