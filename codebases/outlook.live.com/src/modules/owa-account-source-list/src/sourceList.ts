import { MailboxInfo } from 'owa-client-ids';

import { SourceIdAndDisplayName, SourceInformation } from './types';
import { getSourceIdListDetails } from './pluggableHost';

/**
 * Locates the SourceInformation associated with the specified id
 * @param sourceList list of sources
 * @param sourceId id of the source being looked for
 * @returns The SourceInformaiton or undefined
 */
function findSourceInfoBySourceId(
    sourceList: SourceInformation[],
    sourceId: string
): SourceInformation | undefined {
    return sourceList.filter(sourceInfo => sourceInfo.id === sourceId)[0];
}

/**
 * Locates the SourceInformation associated with the account that contains the
 * specified value of the property
 * @param sourceList the list of source information to be searched
 * @param property the property that is being looked for
 * @param value the value of the property being looked for
 * @returns if found returns the SourceInformation otherwsie returns undefined
 */
function findSourceInfoByProperty(
    sourceList: SourceInformation[],
    property: string,
    value: string
): SourceInformation | undefined {
    return sourceList.filter(
        sourceInfo =>
            sourceInfo.properties.has(property) && sourceInfo.properties.get(property) === value
    )[0];
}

/**
 * Provides sourceIds that can be used for referring to accounts
 * @returns The list of sourceId that can be used for getting an account
 */
export async function getSourceIdList(): Promise<SourceIdAndDisplayName[]> {
    const details = await getSourceIdListDetails();
    return details.map(value => {
        return {
            id: value.id,
            displayName: value.displayName,
        };
    });
}

/**
 * Returns the MailboxInfo for the specified sourceId
 * @param sourceId the sourceId for the account
 * @returns The mailbox information, or undefined if the account is not a mailbox
 */
export async function getMailboxBySourceId(sourceId: string): Promise<MailboxInfo | undefined> {
    // ensure the map is up to date
    const sourceList = await getSourceIdListDetails();

    const sourceInfo = findSourceInfoBySourceId(sourceList, sourceId);
    return sourceInfo?.mailboxInfo;
}

/**
 * Returns the specified properties
 * @param sourceId the source id for the account
 * @returns undefined if the sourceId is not found otherwise a map of the properties found in the sourceId
 */
export async function getPropertiesForSourceId(
    sourceId: string,
    properties: string[]
): Promise<Map<string, string> | undefined> {
    // ensure the map is up to date
    const sourceList = await getSourceIdListDetails();

    const sourceInfo = findSourceInfoBySourceId(sourceList, sourceId);
    if (!sourceInfo) {
        return undefined;
    }
    const values = new Map<string, string>();
    properties.forEach(name => {
        if (sourceInfo.properties.has(name)) {
            const sourceValue = sourceInfo.properties.get(name);
            if (sourceValue) {
                values.set(name, sourceValue);
            }
        }
    });

    return values;
}

/**
 * Returns the specified property for the specified sourceId
 * @param sourceId the source id for the account
 * @returns undefined if the sourceId is not found or if the sourceId does not contain the specified property
 */
export async function getPropertyForSourceId(
    sourceId: string,
    property: string
): Promise<string | undefined> {
    const properties = await getPropertiesForSourceId(sourceId, [property]);
    if (properties?.has(property)) {
        return properties?.get(property);
    }

    return undefined;
}

// Gets the sourceId by associated by the HxAccount
export async function getSourceIdByProperty(
    property: string,
    value: string
): Promise<string | undefined> {
    // ensure the map is up to date
    const sourceList = await getSourceIdListDetails();

    const sourceInfo = findSourceInfoByProperty(sourceList, property, value);
    return sourceInfo?.id;
}
