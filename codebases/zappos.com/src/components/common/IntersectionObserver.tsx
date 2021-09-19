import React from 'react';
import { useInView } from 'react-intersection-observer';

import { STANDARD_INTERSECTION_OBSERVER_MARGIN } from 'constants/appConstants';

const defaultOptions = {
  triggerOnce: true,
  rootMargin: STANDARD_INTERSECTION_OBSERVER_MARGIN
};

interface Props {
  forceLoad?: boolean;
  children: JSX.Element;
  placeholder?: JSX.Element;
  options?: any;
}

// TODO figure out way to mock react-intersection-observer in unit tests
const IntersectionObserver = ({ forceLoad, children, placeholder, options }: Props): JSX.Element => {
  const [ref, inView] = useInView({ ...defaultOptions, ...options });
  return (inView || forceLoad) ? children : <div ref={ref}>{placeholder}</div>;
};

export default IntersectionObserver;
