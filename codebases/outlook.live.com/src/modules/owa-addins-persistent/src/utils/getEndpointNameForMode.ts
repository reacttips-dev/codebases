import PersistentEndpoints from '../schema/PersistedEndpoints';
import { ExtensibilityModeEnum } from 'owa-addins-types';

export default function getEndpointNameForMode(mode: ExtensibilityModeEnum): string {
    switch (mode) {
        case ExtensibilityModeEnum.MessageRead:
        case ExtensibilityModeEnum.MeetingRequest:
            return PersistentEndpoints.MailRead;
        case ExtensibilityModeEnum.MessageCompose:
            return PersistentEndpoints.MailCompose;
        default:
            return PersistentEndpoints.NoEndpoint;
    }
}
