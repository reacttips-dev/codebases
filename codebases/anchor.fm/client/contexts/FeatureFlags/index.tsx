import React, { createContext, useContext } from 'react';
import { useFeatureFlags } from './hook';
import { State } from './types';

const DEFAULT_STATE: State = {
  status: 'idle',
  featureFlags: undefined,
};
const DEFAULT_VALUE = {
  state: DEFAULT_STATE,
  handleSetFeatureFlags: () => {},
};

type ProviderValue = {
  state: State;
  handleSetFeatureFlags: () => void;
};

const FeatureFlagsContext = createContext<ProviderValue>(DEFAULT_VALUE);

export const useFeatureFlagsCtx = () => useContext(FeatureFlagsContext);
export const FeatureFlagsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { state, handleSetFeatureFlags } = useFeatureFlags();
  return (
    <FeatureFlagsContext.Provider
      value={{
        state,
        handleSetFeatureFlags,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};
