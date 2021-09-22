import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
    INLINEIMAGE_URL_TEMPLATE,
} from 'owa-inline-image-consts';
import isImageProxyEnabled from 'owa-inline-image-loader/lib/utils/isImageProxyEnabled';
import ImageProxyCapability from 'owa-inline-image-loader/lib/utils/ImageProxyCapability';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import { getExtendedPropertyUri } from 'owa-service/lib/ServiceRequestUtils';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import { isFeatureEnabled } from 'owa-feature-flags';

const cssScopeClassName = 'rps_' + getRandomBetween(1, 0xffff).toString(16);
const maximumBodySize = 2 * 1024 * 1024;
const maximumRecipientsToReturn = 20;
const EXPLICIT_MESSAGE_CARD_PROPERTY_NAME = 'ExplicitMessageCard';
const COMMON_PROPERTY_SET_GUID = '00062008-0000-0000-C000-000000000046';

const MESSAGE_CARD_PAYLOAD_PROPERTY_NAME = 'IOpenTypedFacet.Com.Microsoft.Graph.MessageCard';
const MESSAGE_CARD_PAYLOAD_PROPERTY_SET_GUID = 'E550B918-9859-47B9-8095-97E4E72F1926';

function getRandomBetween(min: number, max: number): number {
    return Math.ceil(Math.random() * (max - min) + min);
}

function getBlockContentFromUnknownSenders() {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.SafetyUserOptions
        ? userConfiguration.SafetyUserOptions.BlockContentFromUnknownSenders
        : false;
}

function getExtendedPropertyUriForExplicitMessageCard(): ExtendedPropertyUri {
    return getExtendedPropertyUri(
        COMMON_PROPERTY_SET_GUID,
        EXPLICIT_MESSAGE_CARD_PROPERTY_NAME,
        'String'
    );
}

function getExtendedPropertyUriForMessageCardPropertyDefinition(): ExtendedPropertyUri {
    return getExtendedPropertyUri(
        MESSAGE_CARD_PAYLOAD_PROPERTY_SET_GUID,
        MESSAGE_CARD_PAYLOAD_PROPERTY_NAME,
        'String'
    );
}

export function getBaseItemResponseShape(): ItemResponseShape {
    const shape = itemResponseShape({
        BaseShape: 'IdOnly',
        AddBlankTargetToLinks: true,
        BlockContentFromUnknownSenders: getBlockContentFromUnknownSenders(),
        BlockExternalImagesIfSenderUntrusted: true,
        ClientSupportsIrm: true,
        CssScopeClassName: cssScopeClassName,
        FilterHtmlContent: true,
        FilterInlineSafetyTips: true,
        InlineImageCustomDataTemplate: INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
        InlineImageUrlTemplate: INLINEIMAGE_URL_TEMPLATE,
        MaximumBodySize: maximumBodySize,
        MaximumRecipientsToReturn: maximumRecipientsToReturn,
        ImageProxyCapability: isImageProxyEnabled()
            ? ImageProxyCapability.OwaAndConnectorsProxy
            : ImageProxyCapability.None,
        AdditionalProperties: [
            propertyUri({ FieldURI: 'CanDelete' }),
            extendedPropertyUri(getExtendedPropertyUriForExplicitMessageCard()),
        ]
            .concat(
                isFeatureEnabled('rp-reactions')
                    ? [
                          propertyUri({ FieldURI: 'OwnerReactionType' }),
                          propertyUri({ FieldURI: 'Reactions' }),
                      ]
                    : []
            )
            .concat(
                isFeatureEnabled('rp-actionableMessagesGciFetch')
                    ? [
                          extendedPropertyUri(
                              getExtendedPropertyUriForMessageCardPropertyDefinition()
                          ),
                      ]
                    : []
            ),
    });

    // Bug 42744: fwk-enforceCsp disable inline code which also disables inline image load
    // https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/42744
    // To workaround CSP disabling inline code, we will use a InlineImageHandler (a content handler) that runs
    // after content is loaded in reading pane
    shape.InlineImageUrlOnLoadTemplate = '';

    return shape;
}

export function getBaseItemResponseShapeForRelationMap(): ItemResponseShape {
    const shape = itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [propertyUri({ FieldURI: 'ItemParentId' })].concat(
            isFeatureEnabled('mon-rp-unstackedConversation')
                ? [
                      propertyUri({ FieldURI: 'Preview' }),
                      propertyUri({ FieldURI: 'From' }),
                      propertyUri({ FieldURI: 'Sender' }),
                      propertyUri({ FieldURI: 'Flag' }),
                      propertyUri({ FieldURI: 'InternetMessageId' }),
                      propertyUri({ FieldURI: 'ConversationId' }),
                      propertyUri({ FieldURI: 'ItemClass' }),
                      propertyUri({ FieldURI: 'MentionedMe' }),
                      propertyUri({ FieldURI: 'IconIndex' }),
                      propertyUri({ FieldURI: 'Importance' }),
                      propertyUri({ FieldURI: 'HasAttachments' }),
                  ]
                : []
        ),
    });

    return shape;
}
