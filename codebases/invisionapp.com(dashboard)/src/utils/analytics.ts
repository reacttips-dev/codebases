declare global {
  interface Window {
    measure?: {
      collect?: any;
    };
  }
}

const trackEvent = (name: string, args: object): undefined | boolean => {
  if (!name || name.length === 0) {
    return false; // for unit testing purposes
  }

  const collect = (window.measure && window.measure.collect) || console.log;
  return collect(name, args);
};

export default trackEvent;
