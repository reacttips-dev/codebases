import type SharingMessage from 'owa-service/lib/contract/SharingMessage';
import type SharingMessageActionType from 'owa-service/lib/contract/SharingMessageActionType';

export default function getSharingMessageAction(item: SharingMessage): SharingMessageActionType {
    if (item.SharingMessageActions != null) {
        // newest messages have SharingMessageActions[] defined, check that property first
        // if array is not null but is empty, server has explicitly declared to not show any accept button
        if (item.SharingMessageActions.length == 0) {
            return null;
        }

        // we only expect a single action for now
        return item.SharingMessageActions[0];
    } else if (item.SharingMessageAction != null) {
        // newer messages will have SharingMessageAction defined
        return item.SharingMessageAction;
    } else {
        // if there's no sharing message action types defined, don't show any injected button controls
        return null;
    }
}
