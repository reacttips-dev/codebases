import { TokenModel } from 'app/gamma/src/types/models';
import { TokenResponse } from 'app/gamma/src/types/responses';
import genericNormalizer, { normalizeDate } from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeToken = genericNormalizer<TokenResponse, TokenModel>(
  ({ from, has }) => ({
    id: from('id'),
    identifier: from('identifier'),
    permissions: from('permissions'),
    dateCreated: has('dateCreated', normalizeDate),
    dateExpires: has('dateExpires', normalizeDate),
  }),
);
