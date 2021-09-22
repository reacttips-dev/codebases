import type { ApplicationSettings } from './schema/ApplicationSettings';
import { ResolverEnabledFor } from './schema/ResolverEnabledFor';

/**
 * All application settings should be defined here following the ECS configuration structure.
 * Please insert new settings in alphabetical order, to preserve readability and reduce chance of merge conflict.
 */
export const defaultApplicationSettings: ApplicationSettings = {
    Loki: {
        resourceUrl: 'https://loki.delve.office.com/',
    },
    Analytics: {
        disabledDatapoints: [] as string[],
    },
    EnabledResolvers: {
        Query: {},
        Mutation: {
            markItemAsRead: ResolverEnabledFor.Hx | ResolverEnabledFor.Remote,
        },
        Subscription: {},
    },
    CAPIv3: {
        isCAPIv3Enabled: false,
    },
};
