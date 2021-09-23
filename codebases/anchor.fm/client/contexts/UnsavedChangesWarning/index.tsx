/**
 *
 * this context allows us to get confirmation from the user when they try to
 * navigate away from the current page.
 *
 * normal <a> tags, closing the current tab, and react router's link tag are
 * handled differently, noted below
 *
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Prompt } from 'react-router-dom';

type ReactRouterPromptHandler = ((location: Location) => boolean) | null;
type UnsavedChangeKeys = string[];
type Value = {
  hasUnsavedChanges: boolean;
  setReactRouterPromptHandler: (fn: any) => void;
  addUnsavedKey: (key: string) => void;
  removeUnsavedKey: (key: string) => void;
  resetUnsavedChanges: () => void;
  clearUnsavedKeys: () => void;
};
const LEAVE_CONFIRMATION_COPY =
  'You have unsaved changes. Are you sure you want to leave?';

const initialState: Value = {
  hasUnsavedChanges: false,
  setReactRouterPromptHandler: () => null,
  addUnsavedKey: key => null,
  removeUnsavedKey: key => null,
  resetUnsavedChanges: () => null,
  clearUnsavedKeys: () => null,
};

const UnsavedChangesWarningContext = createContext<Value>(initialState);

export const useUnsavedChangesWarning = () =>
  useContext(UnsavedChangesWarningContext);

export const UnsavedChangesWarningProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [reactRouterPromptHandler, setHandler] = useState<
    ReactRouterPromptHandler
  >(null);
  const unsavedChangeKeysRef = useRef<UnsavedChangeKeys>([]);

  const addUnsavedKey = useCallback((key: string) => {
    unsavedChangeKeysRef.current = [...unsavedChangeKeysRef.current, key];
    if (unsavedChangeKeysRef.current.length > 0) setHasUnsavedChanges(true);
  }, []);

  const removeUnsavedKey = useCallback((removeKey: string) => {
    unsavedChangeKeysRef.current = unsavedChangeKeysRef.current.filter(
      key => key !== removeKey
    );
    if (unsavedChangeKeysRef.current.length === 0) setHasUnsavedChanges(false);
  }, []);

  const clearUnsavedKeys = useCallback(() => {
    unsavedChangeKeysRef.current = [];
    setHasUnsavedChanges(false);
  }, []);

  const resetUnsavedChanges = useCallback(() => {
    clearUnsavedKeys();
    setHandler(null);
  }, [clearUnsavedKeys]);

  const setReactRouterPromptHandler = useCallback(fn => {
    setHandler(() => fn);
  }, []);

  // this handles navigating away from the current page via react router
  // we have an optional way to determine if we should show the prompt if you
  // set the `reactRouterPromptHandler` function.
  // you would want to use this if your page utilizes different URL paths, like:
  // /dashboard/episode/new -- default page to create a new episode
  // /dashboard/episode/new/library -- same page, but now we're showing the library list
  // in this case if we navigate between the paths above, the default behaviour
  // would show a prompt if there are unsaved changes. we can override that behaviour
  // with this custom `reactRouterPromptHandler` function where returning `true`
  // _will not_ prompt the user and returning a string _will_ prompt the user
  function shouldPrompt(location: Location): string | boolean {
    let showConfirmation = true;
    if (reactRouterPromptHandler !== null) {
      showConfirmation = reactRouterPromptHandler(location);
    }
    return showConfirmation ? LEAVE_CONFIRMATION_COPY : true;
  }

  // this `beforeunload` handles navigating away from the current page via
  // clicking an <a> tag, refreshing, or closing the tab/window
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault(); // shows native prompt for firefox
        e.returnValue = LEAVE_CONFIRMATION_COPY; // shows native prompt for webkit-derived browsers
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <UnsavedChangesWarningContext.Provider
      value={{
        hasUnsavedChanges,
        setReactRouterPromptHandler,
        addUnsavedKey,
        removeUnsavedKey,
        resetUnsavedChanges,
        clearUnsavedKeys,
      }}
    >
      {/* <Prompt> handles navigating away from the current page via react router */}
      {/*
        // @ts-ignore */}
      <Prompt when={hasUnsavedChanges} message={shouldPrompt} />
      {children}
    </UnsavedChangesWarningContext.Provider>
  );
};
