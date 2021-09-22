import type { Resolvers } from 'owa-graph-schema';
import { lazyCalendarGroupsQueryWeb } from 'calendar-groups-query-web';
import { lazyCreateCalendarEventMutationWeb } from 'createcalendarevent-mutation-web';
import { lazyCreateCalendarGroupMutationWeb } from 'createcalendargroup-mutation-web';
import { lazyCreateCalendarMutationWeb } from 'createcalendar-mutation-web';
import { lazyDeleteCalendarMutationWeb } from 'deletecalendar-mutation-web';
import { lazyCalendarEventsQueryWeb } from 'calendar-events-query-web';
import { lazyBirthdayCalendarEventQueryWeb } from 'birthday-calendar-event-query-web';
import { lazyCalendarEventQueryWeb } from 'calendar-event-query-web';
import { lazyDeleteCalendarGroupMutationWeb } from 'deletecalendargroup-mutation-web';
import { lazyRenameCalendarGroupMutationWeb } from 'renamecalendargroup-mutation-web';
import { lazyUpdateCalendarCharmMutationWeb } from 'updatecalendarcharm-mutation-web';
import { lazyRenameCalendarMutationWeb } from 'renamecalendar-mutation-web';
import { lazyUpdateCalendarHexColorMutationWeb } from 'updatecalendarhexcolor-mutation-web';
import { lazySharedCalendarAdditionalInfoQueryWeb } from 'shared-calendars-additional-info-query-web';
import { lazyCollabObjectsQueryWeb } from 'collabobjects-query-web';
import { lazyImportEventsFromIcsFileMutationWeb } from 'importeventsfromicsfile-mutation-web';

/**
 * Please keep fields alphebatized to minimize merge conflicts
 */
export const webResolvers: Resolvers = {
    /* ======================== */
    /* Resolvers for root types */
    /* ======================== */

    /**
     * The root query type. All queries that fetch data start at the Query type.
     * Resolvers under Query should not have effects
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Query: {
        calendarEvents: lazyCalendarEventsQueryWeb,
        fullCalendarEvent: lazyCalendarEventQueryWeb,
        fullBirthdayCalendarEvent: lazyBirthdayCalendarEventQueryWeb,
        calendarGroups: lazyCalendarGroupsQueryWeb,
        sharedCalendarAdditionalInfo: lazySharedCalendarAdditionalInfoQueryWeb,
        collabObjects: lazyCollabObjectsQueryWeb,
    },

    /**
     * The root mutation type. All queries that alter data start at the Mutation type.
     * Mutations typically return the mutated data.
     *
     * See https://graphql.org/learn/schema/#the-query-and-mutation-types
     */
    Mutation: {
        createCalendar: lazyCreateCalendarMutationWeb,
        createCalendarEvent: lazyCreateCalendarEventMutationWeb,
        createCalendarGroup: lazyCreateCalendarGroupMutationWeb,
        deleteCalendar: lazyDeleteCalendarMutationWeb,
        deleteCalendarGroup: lazyDeleteCalendarGroupMutationWeb,
        importEventsFromIcsFile: lazyImportEventsFromIcsFileMutationWeb,
        renameCalendar: lazyRenameCalendarMutationWeb,
        renameCalendarGroup: lazyRenameCalendarGroupMutationWeb,
        updateCalendarCharm: lazyUpdateCalendarCharmMutationWeb,
        updateCalendarHexColor: lazyUpdateCalendarHexColorMutationWeb,
    },

    /**
     * The root subscription type. Resolvers under subscriptions return an event stream
     * that the client responds to.
     *
     * For for definition and rationale, see https://graphql.org/blog/subscriptions-in-graphql-and-relay/#event-based-subscriptions
     * For resolver implementation, see https://www.apollographql.com/docs/apollo-server/data/subscriptions
     * For client consumption, see https://www.apollographql.com/docs/react/data/subscriptions
     */
    Subscription: {},
};
