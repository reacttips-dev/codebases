const MESSAGE = `


          learnlearnle      arnlearnlearn     
       learnlearnlearnl   earnlearnlearnlea   
      rnlearnlearnlear  nlearnlearnlearnlearn 
     learnlea      r   nlearnle       arnlearn
     learnle          arnlearn         learnle    Passionate about education? Come work at Coursera!
     arnlear         nlearnle          arnlear           https://about.coursera.org/careers/
     nlearnle      arnlearnlear      nlearnlea
      rnlearnlearnlearnlearnlearnlearnlearnle 
       arnlearnlearnlearn learnlearnlearnle   
          arnlearnlear      nlearnlearnle     



`;

// eslint-disable-next-line import/prefer-default-export
export const notifyConsole = () => {
  const isCsr = typeof window !== 'undefined';
  const shouldLog =
    isCsr &&
    window.console &&
    // eslint-disable-next-line no-console
    typeof console.log === 'function' &&
    window.location.hostname !== 'mock.dev-coursera.org';

  if (!shouldLog) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(MESSAGE);
};
