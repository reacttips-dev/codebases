import {useEffect, useState} from 'react';

const usePopper = () => {
  const [c, setC] = useState({Manager: null, Reference: null, Popper: null});

  useEffect(() => {
    import(/* webpackChunkName: "react-popper" */ 'react-popper').then(module => {
      const {Manager, Reference, Popper} = module;
      setC({Manager, Reference, Popper});
    });
  }, []);

  return c;
};

export default usePopper;
