import { default as getApplicationSettings } from '../../selectors/getApplicationSettings';
import { ResolverEnabledFor } from './ResolverEnabledFor';
import { isFeatureEnabled } from 'owa-feature-flags';

export type ResolverEnabledSettings = {
    Query: { [k: string]: ResolverEnabledFor };
    Mutation: { [k: string]: ResolverEnabledFor };
    Subscription: { [k: string]: ResolverEnabledFor };
};

export function enabledForHx(op: string, resolver: string) {
    const enabled = getEnabled(op, resolver);
    return (enabled & ResolverEnabledFor.Hx) == ResolverEnabledFor.Hx;
}

export function enabledForWeb(op: string, resolver: string) {
    const enabled = getEnabled(op, resolver);
    return (enabled & ResolverEnabledFor.Web) == ResolverEnabledFor.Web;
}

export function enabledForRemote(op: string, resolver: string) {
    const enabled = getEnabled(op, resolver);
    return (enabled & ResolverEnabledFor.Remote) == ResolverEnabledFor.Remote;
}

function getEnabled(op: string, resolver: string) {
    const defaultEnabled = ResolverEnabledFor.All;

    if (
        !isFeatureEnabled('fwk-graphql-resolvers-config') ||
        !isFeatureEnabled('fwk-application-settings')
    ) {
        return defaultEnabled;
    } else {
        const resolverLocations = getApplicationSettings('EnabledResolvers');
        const configuredEnabled = resolverLocations?.[op]?.[resolver];

        return configuredEnabled == undefined ? defaultEnabled : configuredEnabled;
    }
}
