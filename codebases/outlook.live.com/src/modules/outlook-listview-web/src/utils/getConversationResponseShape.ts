import type ConversationResponseShape from 'owa-service/lib/contract/ConversationResponseShape';
import conversationResponseShape from 'owa-service/lib/factory/conversationResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';

export function getConversationResponseShape(
    isScheduledFolder: boolean
): ConversationResponseShape {
    if (isScheduledFolder) {
        return conversationResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [
                propertyUri({ FieldURI: 'ConversationReturnTime' }),
                propertyUri({ FieldURI: 'ConversationHashtags' }),
            ],
        });
    }

    return conversationResponseShape({ BaseShape: 'IdOnly' });
}
