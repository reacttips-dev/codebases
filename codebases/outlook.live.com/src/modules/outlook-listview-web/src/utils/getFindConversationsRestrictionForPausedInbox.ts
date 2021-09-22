import constant from 'owa-service/lib/factory/constant';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import isLessThanOrEqualTo from 'owa-service/lib/factory/isLessThanOrEqualTo';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import restrictionType from 'owa-service/lib/factory/restrictionType';
import type RestrictionType from 'owa-service/lib/contract/RestrictionType';

/**
 * Gets the restrictions for the findConversation call based upon the current state of the table
 * @param inboxPausedTime the paused time of the folder
 */
export function getFindConversationsRestrictionForPausedInbox(
    inboxPausedTime: string
): RestrictionType {
    const restriction = isLessThanOrEqualTo({
        Item: propertyUri({ FieldURI: 'ConversationLastDeliveryTime' }),
        FieldURIOrConstant: fieldURIOrConstantType({
            Item: constant({
                Value: inboxPausedTime,
            }),
        }),
    });

    return restrictionType({
        Item: restriction,
    });
}
