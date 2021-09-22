import {
    getBaseItemResponseShape,
    getBaseItemResponseShapeForRelationMap,
} from './getBaseItemResponseShape';
import shouldShowUnstackedReadingPane from './shouldShowUnstackedReadingPane';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { LoadConversationItemActionSource } from '../index';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';

/**
 * The response shape used for conversation is pretty much same as the one for item with
 * some additional conversation only flags
 */
export function getConversationItemResponseShape(
    actionSource: LoadConversationItemActionSource,
    isGroupMailBox: boolean
): ItemResponseShape {
    if (
        !isGroupMailBox &&
        actionSource == 'CreateConversationRelationMap' &&
        shouldShowUnstackedReadingPane()
    ) {
        return getBaseItemResponseShapeForRelationMap();
    }

    const convItemResponseShape = getBaseItemResponseShape();

    convItemResponseShape.ExcludeBindForInlineAttachments = true;
    convItemResponseShape.CalculateOnlyFirstBody = true;
    if (isFeatureEnabled('rp-bodyDiffing')) {
        convItemResponseShape.BodyShape = 'UniqueFragment';
    }

    return convItemResponseShape;
}
