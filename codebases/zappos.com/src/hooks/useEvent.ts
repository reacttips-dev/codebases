import { useEffect } from 'react';

const useEvent = (eventTarget: EventTarget | undefined | null, eventType: string, eventHandler: EventListener | EventListenerObject, options: AddEventListenerOptions | boolean | undefined = {}) => {
  useEffect(() => {
    eventTarget?.addEventListener(eventType, eventHandler, options);
    return () => {
      eventTarget?.removeEventListener(eventType, eventHandler, options);
    };
  }, [eventHandler, eventTarget, eventType, options]);
};

// Created so we can get window event typing on the event handler arg
export const useWindowEvent = (...eventArgs: Parameters<typeof window.addEventListener>) => {
  const [eventType, eventHandler, options] = eventArgs;
  useEffect(() => {
    window?.addEventListener(eventType, eventHandler, options);
    return () => {
      window?.removeEventListener(eventType, eventHandler, options);
    };
  }, [eventHandler, eventType, options]);
};

export default useEvent;
