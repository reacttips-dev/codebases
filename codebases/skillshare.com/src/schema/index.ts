import { merge } from 'lodash';
import { CBCTypes } from './cbc';
import { CommentResolvers, CommentTypes } from './comments';
import { searchClientDefaults, searchClientResolvers, SearchTypes } from './search';
import { ServerTypes } from './server';
export var Defaults = merge(searchClientDefaults);
export var Resolvers = merge(searchClientResolvers, CommentResolvers);
export var Types = [ServerTypes, SearchTypes, CommentTypes, CBCTypes];
export * from './input';
//# sourceMappingURL=index.js.map