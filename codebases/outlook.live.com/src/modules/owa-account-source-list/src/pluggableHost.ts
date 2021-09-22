import { MailboxInfo } from 'owa-client-ids';
import { errorThatWillCauseAlert } from 'owa-trace';

import { SourceInformation } from './types';

/**
 * The information on accounts that is obtained from the host application is
 * provided in the following interface.
 */
export interface HostAccountInformation {
    displayName: string;
    stableId: string;
    properties: Map<string, string>;
    mailboxInfo?: MailboxInfo;
}

/**
 * Defines the interface that the hosting application must implement
 */
export interface PluggableHostAccountSource {
    getAccounts: () => Promise<HostAccountInformation[]>;
}

/**
 * Implements the PluggableHostAccountSource and throws an error if any of the
 * methods are called.
 */
class DefaultPluggableHostAccountSource implements PluggableHostAccountSource {
    public getAccounts(): Promise<HostAccountInformation[]> {
        errorThatWillCauseAlert('PluggableAccountHostNotSet');
        throw new Error('The pluggable account host has not been set');
    }
}

// The pluggable host instance
let thePluggableHost = new DefaultPluggableHostAccountSource();

/**
 * Sets the pluggable host
 * @param host provides the host specific implementation for getting account information
 */
export function setPluggableHost(host: PluggableHostAccountSource) {
    thePluggableHost = host;
}

/**
 * Restores the pluggable host to the default pluggable host
 */
export function testHookToResetPluggableHost() {
    thePluggableHost = new DefaultPluggableHostAccountSource();
}

// The Win32 Desktop version of outlook provides support for profiles and allows for the same
// account to be stored in multiple profiles. To support this model the sourceId contains a
// profile identifier, applications that don't have profile support use the' main' profile while
// additional profiles are identified by a '|name|' where the || inidicate it is not main.
const globalProfile = 'main';

// The next part of the sourceId is the type of source, currently the only type of source that is being
// supported is a mailbox type. Eventually support will be provided for PST and local sources.
const mailboxSourceType = 'mailbox';

// Specifies the delimiter used to seperate the parts of the sourceId
const sourcePartDelimiter = ':';

/**
 * Creates a sourceId from the three component parts
 * @param profilePart The profile associated with teh source
 * @param sourceType The type of the source
 * @param sourceIdentifier The stable identifier for the source
 * @returns a string represeting the source
 */
function buildSourceId(profilePart: string, sourceType: string, sourceIdentifier: string): string {
    return profilePart + sourcePartDelimiter + sourceType + sourcePartDelimiter + sourceIdentifier;
}

/**
 * Provides sourceIds that can be used for referring to accounts
 * @returns The list of sourceId that can be used for getting an account
 */
export async function getSourceIdListDetails(): Promise<SourceInformation[]> {
    const hostAccounts = await thePluggableHost.getAccounts();
    return hostAccounts.map(value => {
        return {
            id: buildSourceId(globalProfile, mailboxSourceType, value.stableId),
            displayName: value.displayName,
            stableId: value.stableId,
            properties: value.properties,
            mailboxInfo: value.mailboxInfo,
        };
    });
}
