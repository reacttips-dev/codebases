import getItem from 'owa-mail-store/lib/services/getItem';
import { getExtendedPropertyUri } from 'owa-service/lib/ServiceRequestUtils';
import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type { InternetHeaders } from 'owa-addins-core';
import setInternetHeaders from 'owa-addins-editor-plugin/lib/actions/setInternetHeaders';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import setIsDirty from 'owa-mail-compose-actions/lib/actions/setIsDirty';

const PS_INTERNET_HEADERS_GUID = '00020386-0000-0000-C000-000000000046';
const PR_TRANSPORT_MESSAGE_HEADERS_W_PROPERTY_TAG = '0x007D';

export async function updateViewStateWithAnyMissingHeaders(
    viewState: ComposeViewState,
    headerNames: string[]
) {
    let headers: InternetHeaders;
    const keysOfHeadersToGetFromItem: string[] = [];
    headerNames.forEach(name => {
        if (
            !viewState.addin.internetHeaders.get(name) &&
            (!viewState.addin.keysOfInternetHeadersToBeRemoved ||
                viewState.addin.keysOfInternetHeadersToBeRemoved.indexOf(name) == -1)
        ) {
            keysOfHeadersToGetFromItem.push(name);
        }
    });
    if (keysOfHeadersToGetFromItem.length > 0) {
        headers = await tryGetHeaders(keysOfHeadersToGetFromItem, viewState.itemId.Id);
        setInternetHeaders(viewState.addin, headers);
        setIsDirty(viewState);
    }
}

export async function tryGetHeaders(headerNames: string[], id: string): Promise<InternetHeaders> {
    const itemShape = itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: createExtendedPropertyUrisForInternetHeaders(headerNames),
    });

    let nameValuePairs: InternetHeaders = {};
    try {
        const message = await getItem(id, itemShape, null /* shapeName */);
        if (message && !(message instanceof Error)) {
            if (message.ExtendedProperty) {
                nameValuePairs = convertArrayToNameValuePairs(message.ExtendedProperty);
            }
        }
    } catch (error) {
        throw error;
    }

    return nameValuePairs;
}

function convertArrayToNameValuePairs(extendedProperties: ExtendedPropertyType[]): InternetHeaders {
    return extendedProperties.reduce((dictionary, extendedProperty) => {
        dictionary[extendedProperty.ExtendedFieldURI.PropertyName] = extendedProperty.Value;
        return dictionary;
    }, {} as InternetHeaders);
}

function createExtendedPropertyUrisForInternetHeaders(
    headerNames: string[]
): ExtendedPropertyUri[] {
    const uris: ExtendedPropertyUri[] = [];
    headerNames.forEach(name => {
        uris.push(getExtendedPropertyUri(PS_INTERNET_HEADERS_GUID, name, 'String'));
    });
    return uris;
}

export async function tryGetAllHeaders(id: string): Promise<String> {
    const itemShape = itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: createExtendedPropertyUrisForAllInternetHeaders(),
    });

    try {
        const message = await getItem(id, itemShape, null /* shapeName */);
        if (message && !(message instanceof Error)) {
            if (message.ExtendedProperty) {
                return message.ExtendedProperty[0].Value;
            } else {
                return '';
            }
        }
    } catch (error) {
        throw error;
    }

    return undefined;
}

function createExtendedPropertyUrisForAllInternetHeaders(): ExtendedPropertyUri[] {
    const uris: ExtendedPropertyUri[] = [];
    uris.push(
        extendedPropertyUri({
            PropertyTag: PR_TRANSPORT_MESSAGE_HEADERS_W_PROPERTY_TAG,
            PropertyType: 'String',
        })
    );

    return uris;
}
