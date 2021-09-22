import findMetatag from './findMetatag';

// Boot features
//    `acctmonaccounts` -- when enabled, uses the monarch account manager
//    `appservicequery` -- when enabled, fetch metaOs apps from app service api
//    `gqlfolders` -- when enabled, renders the GraphQL-based folder view
//    `localBootError` -- Will show the boot error without a redirect
//    `novaappbar` -- when enabled, renders the Nova app bar
//    `outlookdotcom` -- This flag enables support for adding outlook.com accounts to Monarch.
//    `strictsourceid` -- When set this flag will cause an errorThatWillCauseAlert when a non-sourceId method is used in Monarch.
export type BootFeature =
    | 'acctmonaccounts'
    | 'appservicequery'
    | 'disablemiddleware'
    | 'gqlfolders'
    | 'localBootError'
    | 'novaappbar'
    | 'pieAddNewAccount'
    | 'strictsourceid'
    | 'pieUpdateOtherEmailAddresses';

// these are specifically for features that need to be decided before userbootsettings comes back.
let bootFlights: string[] | undefined;
export function isBootFeatureEnabled(feature: BootFeature) {
    return getBootFlights().indexOf(feature) > -1;
}

export function getBootFlights(): string[] {
    if (!bootFlights) {
        const meta = findMetatag('bootFlights');
        bootFlights = meta ? meta.split(',') : [];
    }
    return bootFlights;
}

export function test_reset() {
    bootFlights = <string[]>(<unknown>undefined);
}
