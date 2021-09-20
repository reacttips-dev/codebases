import { QueryQrCodeArgs } from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { trelloFetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const qrCodeResolver = async (
  _parent: unknown,
  args: QueryQrCodeArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/share/qrcode');
  const url = encodeURIComponent(args.url);
  const response = await trelloFetch(
    `${apiUrl}?url=${url}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Board_History.cardsPerList',
        operationName: context.operationName,
      },
    },
  );
  const qrCode = await response.json();

  return prepareDataForApolloCache({ imageData: qrCode._value || '' }, info);
};
