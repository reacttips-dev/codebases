import loadTableViewFromTableQuery from './loadTableViewFromTableQuery';
import { getDefaultInboxTableQuery } from 'owa-mail-triage-table-utils/lib/getDefaultInboxTableQueries';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { SessionData } from 'owa-service/lib/types/SessionData';

// Function that loads the default table view.
export function loadDefaultTable(
    sessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
) {
    // Load default inbox table
    loadTableViewFromTableQuery(
        getDefaultInboxTableQuery(),
        undefined,
        undefined,
        sessionData,
        apolloClientPromise
    );
}
