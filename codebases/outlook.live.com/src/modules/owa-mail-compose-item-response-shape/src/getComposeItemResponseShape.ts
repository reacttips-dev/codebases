import type BodyType from 'owa-service/lib/contract/BodyType';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import {
    INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
    INLINEIMAGE_URL_TEMPLATE,
} from 'owa-inline-image-consts';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import isImageProxyEnabled from 'owa-inline-image-loader/lib/utils/isImageProxyEnabled';
import ImageProxyCapability from 'owa-inline-image-loader/lib/utils/ImageProxyCapability';
import { isFeatureEnabled } from 'owa-feature-flags';
import { configItemResponseShapeForCLP } from 'owa-mail-configure-response-shape-for-clp/lib/configItemResponseShapeForCLP';

export function getComposeItemResponseShape(bodyType: BodyType) {
    const shape = itemResponseShape({
        BaseShape: 'IdOnly',
        ClientSupportsIrm: true,
        FilterHtmlContent: true,
        InlineImageCustomDataTemplate: INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
        // Bug 25298: Compose send may accidentally include inline image place holder
        // https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/25298
        // ComposeItemResponseShape is used for requesting item to be loaded in compose, i.e. draft
        // In the past, we trigger inline image load through injecting client side javascript reference
        // "onload=InlineImageLoader.GetLoader().Load(this)" just like reading pane. This causes a place holder
        // to be displayed and may accidently be sent out if users send too fast before image loads
        // The fix is to not to rely on this script injection, but to hook on editor ContentChange event
        // and fire up inline image load programatically where we can control using of place holder
        InlineImageUrlOnLoadTemplate: '',
        InlineImageUrlTemplate: INLINEIMAGE_URL_TEMPLATE,
        AdditionalProperties: [propertyUri({ FieldURI: 'ItemLastModifiedTime' })],
    });

    configItemResponseShapeForCLP(shape);

    if (bodyType) {
        shape.BodyType = bodyType;
    }

    // When image proxy is disabled, send a 'None' to receive zero change to external images from server side
    shape.ImageProxyCapability =
        isFeatureEnabled('rp-replyImageProxy') && isImageProxyEnabled()
            ? ImageProxyCapability.OwaConnectorsProxyAndCompose
            : ImageProxyCapability.None;

    return shape;
}
