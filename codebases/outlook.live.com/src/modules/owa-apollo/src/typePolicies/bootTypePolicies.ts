import type { TypedTypePolicies } from 'owa-graph-schema-type-policies';
import { getConfiguration } from 'owa-userconfiguration-cache';

let initialRender = true;

export const unblockBootResolvers = () => {
    // stop using the type policy for user configuration
    initialRender = false;
};

/*
/* When https://outlookweb.visualstudio.com/Outlook%20Web/_queries/edit/112251/?triage=true is fixed, use this simpler more robust syntax
/* availabled in Apollo 3.3.20 in the policy
const mergeit = { merge: true };
const mergeOptions = {
    SafetyUserOptions: mergeit,
    SegmentationSettings: mergeit,
    ApplicationSettings: mergeit,
    AttachmentPolicy: mergeit,
    TenantThemeData: mergeit,
    SmimeAdminSettings: mergeit,
    Category: mergeit,
    MasterCategoryList: mergeit,
    OutlookFavorites: mergeit,
    PolicySettings: mergeit,
    PrimeBootSettings: mergeit,
    CalendarCloudSettings: mergeit,
    CalendarSurfaceOptions: mergeit,
    UnseenLightening: mergeit,
    SessionSettings: mergeit,
    ConnectedAccountInfo: mergeit,
    UserOptions: mergeit,
    ViewStateConfiguration: mergeit,
};
*/

export const createBootPolicies = (): TypedTypePolicies => ({
    Query: {
        fields: {
            /**
             * UserConfiguration is special and reading it during boot is served by having a read type policy on
             * userConfiguration query. Below code serves the userConfiguration from userConfiguration cache during the initial render that happens at boot.
             * This is done to avoid hitting resolver which would need to initialize the resolver infra at boot. We could write the userConfiguration query
             * to apollo cache but writeQuery api requires all fields to be defined which seems difficult to main as user configuration blob is much
             * prone to changes.
             */
            userConfiguration: {
                read(existing, { args, toReference }) {
                    if (existing) {
                        return existing;
                    } else if (initialRender) {
                        const mergeIntoStore = true;
                        return toReference(getConfiguration(args?.id), mergeIntoStore);
                    } else {
                        return toReference({
                            __typename: 'UserConfiguration',
                            id: args.id,
                        });
                    }
                },
            },
        },
    },
    /**
     * These directives tell Apollo that it should merge all of these non-normalized objects within the UserConfiguration type
     * even though it can't be sure they're the same object.  This is possible because a UserOptions object underneath a given
     * UserConfiguration instance will always refer to the same object (there cannot be two different UserOption types under the
     * same UserConfiguration)
     */
    UserConfiguration: {
        fields: {
            ApplicationSettings: {
                merge: true,
            },
            AttachmentPolicy: {
                merge: true,
            },
            Favorites: {
                merge: true,
            },
            MasterCategoryList: {
                merge: true,
            },
            PolicySettings: {
                merge: true,
            },
            PrimeSettings: {
                merge: true,
            },
            SafetyUserOptions: {
                merge: true,
            },
            SegmentationSettings: {
                merge: true,
            },
            SessionSettings: {
                merge: true,
            },
            SmimeAdminSettings: {
                merge: true,
            },
            TenantThemeData: {
                merge: true,
            },
            UserOptions: {
                merge: true,
            },
            ViewStateConfiguration: {
                merge: true,
            },
        },
    },
});
