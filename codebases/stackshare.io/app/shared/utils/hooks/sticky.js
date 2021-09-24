import {useEffect, useState} from 'react';

const handleScroll = ({current: el}, setStuck, offset) => {
  let isStuck = null;
  return () => {
    if (el && typeof el.getBoundingClientRect === 'function') {
      const {top} = el.getBoundingClientRect();
      if (top === offset && isStuck !== true) {
        isStuck = true;
        setStuck(true);
      } else if (top !== offset && isStuck !== false) {
        isStuck = false;
        setStuck(false);
      }
    }
  };
};

export default (navEl, offset = 0) => {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const cb = handleScroll(navEl, setStuck, offset);
    if (navEl.current) {
      cb();
    }
    window.addEventListener('scroll', cb, true);
    return () => window.removeEventListener('scroll', cb, true);
  }, [navEl.current]);
  return stuck;
};
