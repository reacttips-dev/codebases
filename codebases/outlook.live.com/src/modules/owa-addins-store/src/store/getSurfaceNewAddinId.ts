import extensibilityState from './store';
import { ExtensibilityModeEnum } from 'owa-addins-types';

export function getSurfaceNewAddinId(extMode: ExtensibilityModeEnum): string {
    switch (extMode) {
        case ExtensibilityModeEnum.MessageRead:
            return extensibilityState.mailReadSurfaceNewAddinId;
        case ExtensibilityModeEnum.MessageCompose:
            return extensibilityState.mailComposeSurfaceNewAddinId;
        case ExtensibilityModeEnum.AppointmentOrganizer:
        case ExtensibilityModeEnum.AppointmentAttendee:
            return extensibilityState.calendarSurfaceNewAddinId;
        default:
            return '';
    }
}
