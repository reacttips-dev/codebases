import React, { createContext, useContext } from 'react';
import { Status, useFetchData } from '../../hooks/useFetchData';
import {
  fetchCurrentUserPodcastNetwork,
  NetworkRole,
  NetworkRoleObject,
} from '../../modules/AnchorAPI/account/fetchCurrentUserPodcastNetwork';

type State = Pick<NetworkRoleObject, 'networkRoleUserId'> & {
  status: Status;
  error: string;
  networkRole: NetworkRole | undefined;
};

const initialState = {
  status: 'loading' as Status,
  networkRole: null,
  networkRoleUserId: null,
  error: '',
  fetchNetworkRole: () => null,
};

type ProviderValue = State & {
  fetchNetworkRole: () => void;
};

const NetworkRoleContext = createContext<ProviderValue>(initialState);

export const useNetworkRole = () => useContext(NetworkRoleContext);
export const NetworkRoleProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const {
    state: { json, error, status },
    fetchData,
  } = useFetchData({
    fetchFunction: fetchCurrentUserPodcastNetwork,
    options: { fetchOnFirstRender: false },
  });
  return (
    <NetworkRoleContext.Provider
      value={{
        ...json,
        error,
        status,
        fetchNetworkRole: fetchData,
      }}
    >
      {children}
    </NetworkRoleContext.Provider>
  );
};
