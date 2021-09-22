import type InsightsViewState from './InsightsViewState';
import { MruCache } from 'owa-mru-cache';

/**
 * The related content cache with specified max size
 */
export const CACHE_SIZE = 40;
const meetingInsightsCache = new MruCache<InsightsViewState>(CACHE_SIZE);
export default meetingInsightsCache;
