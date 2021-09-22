import { MruCache } from 'owa-mru-cache';
import type ConversationItemParts from './schema/ConversationItemParts';

const cacheSize = 50;
const conversationCache = new MruCache<ConversationItemParts>(cacheSize);
export default conversationCache;
