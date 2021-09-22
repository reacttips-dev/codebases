import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import {
    INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
    INLINEIMAGE_URL_TEMPLATE,
} from 'owa-inline-image-consts';
import { IsAppendOnSendExtendedProperty } from 'owa-calendar-types/lib/types/IsAppendOnSendExtendedProperty';
import type { CalendarEventItemResponseShapeType } from '../schema/CalendarEventItemResponseShapeType';
import isImageProxyEnabled from 'owa-inline-image-loader/lib/utils/isImageProxyEnabled';
import ImageProxyCapability from 'owa-inline-image-loader/lib/utils/ImageProxyCapability';
import { isFeatureEnabled } from 'owa-feature-flags';
import { assertNever } from 'owa-assert';
import { getRandomNumber } from './getRandomNumber';
import { IsBookedFreeBlocksExtendedProperty } from 'owa-calendar-types/lib/types/IsBookedFreeBlocksExtendedProperty';
import { CollabSpaceExtendedProperty } from 'owa-calendar-types/lib/types/CollabSpaceExtendedProperty';
import { TravelTimeEventsLinkedExtendedProperty } from 'owa-calendar-types/lib/types/TravelTimeEventsLinkedExtendedProperty';
import { FlexEventsMetadataExtendedProperty } from 'owa-calendar-types/lib/types/FlexEventsMetadataExtendedProperty';

export function getItemResponseShape(
    itemResponseShapeType: CalendarEventItemResponseShapeType
): ItemResponseShape {
    const additionalProperties = [IsAppendOnSendExtendedProperty];
    if (isFeatureEnabled('cal-dev-focusTime')) {
        additionalProperties.push(IsBookedFreeBlocksExtendedProperty);
    }
    if (isFeatureEnabled('cal-cmp-fluidCollaborativeSpace')) {
        additionalProperties.push(CollabSpaceExtendedProperty);
    }
    if (isFeatureEnabled('cal-mf-mobility-create')) {
        additionalProperties.push(TravelTimeEventsLinkedExtendedProperty);
        additionalProperties.push(FlexEventsMetadataExtendedProperty);
    }
    const baseShape: ItemResponseShape = {
        BaseShape: 'IdOnly',
        MaximumBodySize: 0, // No body truncation
        BodyType: 'HTML',
        FilterHtmlContent: true,
        InlineImageCustomDataTemplate: INLINEIMAGE_CUSTOM_DATA_TEMPLATE,
        InlineImageUrlTemplate: INLINEIMAGE_URL_TEMPLATE,
        AddBlankTargetToLinks: true,
        CssScopeClassName: 'cal_' + getRandomNumber(),
        AdditionalProperties: additionalProperties,
        // TODO VSO 84450: Support Image proxy in calendar body
        ImageProxyCapability:
            isFeatureEnabled('cal-bodyImageProxy') && isImageProxyEnabled()
                ? ImageProxyCapability.OwaAndConnectorsProxy
                : ImageProxyCapability.None,
    };
    if (isFeatureEnabled('cal-mf-blockExternalContent')) {
        switch (itemResponseShapeType) {
            case 'Default':
                return {
                    ...baseShape,
                    BlockContentFromUnknownSenders: true,
                    BlockExternalImages: true,
                };
            case 'WithBlockedExternalContent':
                return baseShape;
            default:
                return assertNever(itemResponseShapeType);
        }
    } else {
        return baseShape;
    }
}
