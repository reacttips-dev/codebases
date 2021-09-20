import { clientVersion, locale } from '@trello/config';
import { AppContext } from './types';

export const appContext: AppContext[] = [
  {
    schema: 'iglu:com.trello/web-context/jsonschema/1-0-4',
    data: {
      client_version: clientVersion,
      client_locale: locale,
    },
  },
];
