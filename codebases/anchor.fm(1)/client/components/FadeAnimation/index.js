import React from 'react';
import { Transition } from 'react-transition-group';

const getDefaultStyle = (duration, fadeOut) => ({
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: fadeOut ? 1 : 0.01,
});

const getTransitionStyles = fadeOut =>
  fadeOut
    ? {
        entering: {
          opacity: 1,
          transition: `opacity 1ms ease-in-out`, // instant show -> fade
        },
        entered: {
          opacity: 0.01,
        },
        exiting: {
          opacity: 0.01,
        },
        exited: {
          opacity: 0.01,
        },
      }
    : {
        entering: { opacity: 0.01 },
        entered: { opacity: 1 },
        exiting: { opacity: 1 },
        exited: { opacity: 1 },
      };

const FadeAnimation = ({
  in: inProp,
  timeout = 300,
  children,
  appear = false,
  mountOnEnter = true,
  unmountOnExit = true,
  fadeOut = false,
  ...props
}) => (
  <Transition
    appear={appear}
    mountOnEnter={mountOnEnter}
    in={inProp}
    timeout={timeout}
    unmountOnExit={unmountOnExit}
    {...props}
  >
    {state => (
      <div
        style={{
          ...getDefaultStyle(timeout, fadeOut),
          ...getTransitionStyles(fadeOut)[state],
        }}
      >
        {children}
      </div>
    )}
  </Transition>
);

export default FadeAnimation;
