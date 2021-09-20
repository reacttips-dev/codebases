import schema from './schema';
import { buildASTSchema } from 'graphql/utilities';

// eslint-disable-next-line @trello/no-module-logic
export const astSchema = buildASTSchema(schema, {
  assumeValidSDL: true,
});
