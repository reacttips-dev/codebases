import { TrelloNetworkClient } from '@trello/network-client';

let networkClient: TrelloNetworkClient;

export const getNetworkClient = () => {
  if (!networkClient) {
    networkClient = new TrelloNetworkClient();
  }

  return networkClient;
};
