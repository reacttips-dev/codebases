import { ListModel } from 'app/gamma/src/types/models';
import { ListResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeList = genericNormalizer<ListResponse, ListModel>(
  ({ from }) => ({
    closed: from('closed'),
    id: from('id'),
    idBoard: from('idBoard'),
    name: from('name'),
    pos: from('pos'),
    subscribed: from('subscribed'),
  }),
);
