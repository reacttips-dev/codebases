import isMeetingRequest from './isMeetingRequest';
import mailStore from 'owa-mail-store/lib/store/Store';
import propertyUri from 'owa-service/lib/factory/propertyUri';

export const featureId = 'MeetingConflicts';
const conflictingMeetingPropertyPath = propertyUri({ FieldURI: 'ConflictingMeetings' });
const adjacentMeetingsPropertyPath = propertyUri({ FieldURI: 'AdjacentMeetings' });

const isPropertyExistedOnItem = (itemId: string): boolean => {
    // Always return false, so that GetItem is issued everytime when reading pane is opened, to fetch the most up-to-date
    // conflicting and adjacent meetings
    return false;
};

const shouldGetItemPropertiesFromServer = (itemId: string): boolean => {
    const item = mailStore.items.get(itemId);
    return !!(item && isMeetingRequest(item.ItemClass));
};

const getDefaultValues = (): any => {
    // When there are no conflicting or adjacent meetings the properties are not returned
    // Adding defaults of empty arrays so that any exist values in the store will be overwritten
    return { AdjacentMeetings: { Items: [] }, ConflictingMeetings: { Items: [] } };
};

const meetingConflictsPropertyEntry = {
    featureId: featureId,
    propertyPaths: [adjacentMeetingsPropertyPath, conflictingMeetingPropertyPath],
    isPropertyExistedOnItem: isPropertyExistedOnItem,
    shouldGetItemPropertiesFromServer: shouldGetItemPropertiesFromServer,
    getDefaultValues: getDefaultValues,
};

export default meetingConflictsPropertyEntry;
