import { LoginModel } from 'app/gamma/src/types/models';
import { LoginResponse } from 'app/gamma/src/types/responses';
import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeLogin = genericNormalizer<LoginResponse, LoginModel>(
  ({ from }) => ({
    email: from('email'),
    id: from('id'),
    primary: from('primary'),
  }),
);
