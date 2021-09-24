import React from 'react';
import { useCurrentUser } from './hook';
import { State } from './types';

type ProviderValue = {
  state: State;
  fetchCurrentUser: (isFromSignup?: boolean) => Promise<void>;
  resetCurrentUser: () => void;
};

const CurrentUserContext = React.createContext<ProviderValue>({
  state: {
    userId: null,
    webStationId: null,
    status: 'idle',
    imageUrl: null,
    partnerIds: {},
  },
  fetchCurrentUser: async () => {},
  resetCurrentUser: () => {},
});

export const useCurrentUserCtx = () => React.useContext(CurrentUserContext);

export const CurrentUserProvider = ({
  initialState,
  children,
}: {
  initialState?: State | undefined;
  children: JSX.Element;
}) => {
  const { state, fetchCurrentUser, resetCurrentUser } = useCurrentUser();

  return (
    <CurrentUserContext.Provider
      value={{
        state: initialState || state,
        fetchCurrentUser,
        resetCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
