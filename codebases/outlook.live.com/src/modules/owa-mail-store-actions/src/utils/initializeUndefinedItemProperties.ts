import type Item from 'owa-service/lib/contract/Item';

// shouldInitializeUndefinedToNull tells if the property is not sent from the server
// and we have to initialize them to Null whenever we store the item on the mailStore
interface ItemMandatoryPropertiesType {
    name: string;
    shouldInitializeUndefinedToNull: boolean;
}

export const itemMandatoryProperties: ItemMandatoryPropertiesType[] = [
    { name: 'ItemClass', shouldInitializeUndefinedToNull: false },
    { name: 'LastModifiedTime', shouldInitializeUndefinedToNull: false },
    { name: 'DateTimeReceived', shouldInitializeUndefinedToNull: false },
    { name: 'ParentFolderId', shouldInitializeUndefinedToNull: false },
    { name: 'SystemCategories', shouldInitializeUndefinedToNull: false },
    { name: 'Hashtags', shouldInitializeUndefinedToNull: false },
    { name: 'PredictedActionReasons', shouldInitializeUndefinedToNull: false },
    { name: 'Flag', shouldInitializeUndefinedToNull: false },
    { name: 'IsRead', shouldInitializeUndefinedToNull: false },
    { name: 'Size', shouldInitializeUndefinedToNull: false },
    { name: 'IconIndex', shouldInitializeUndefinedToNull: false },
    { name: 'Categories', shouldInitializeUndefinedToNull: true },
    { name: 'Likers', shouldInitializeUndefinedToNull: true },
    { name: 'LikeCount', shouldInitializeUndefinedToNull: true },
    { name: 'AdjacentMeetings', shouldInitializeUndefinedToNull: false },
    { name: 'ConflictingMeetings', shouldInitializeUndefinedToNull: false },
    { name: 'DeferredSendTime', shouldInitializeUndefinedToNull: true },
    { name: 'IsSubmitted', shouldInitializeUndefinedToNull: true },
    { name: 'YammerData', shouldInitializeUndefinedToNull: false },
    { name: 'Reactions', shouldInitializeUndefinedToNull: true },
    { name: 'OwnerReactionType', shouldInitializeUndefinedToNull: true },
    { name: 'IsDraft', shouldInitializeUndefinedToNull: false },
    { name: 'SentTime', shouldInitializeUndefinedToNull: false },
];

export default function (item: Item): void {
    // Some properties are undefined (server does not send them) and we need to initialize to Null
    // so we can update their state on the UI and components can render them properly
    itemMandatoryProperties.forEach(property => {
        if (
            property.shouldInitializeUndefinedToNull &&
            typeof item[property.name] === 'undefined'
        ) {
            item[property.name] = null;
        }
    });
}
