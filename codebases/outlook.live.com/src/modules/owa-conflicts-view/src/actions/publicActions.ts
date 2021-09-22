import type { ConflictsViewScenario } from '../store/schema/ConflictsViewState';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import { action } from 'satcheljs';

export const initializeConflictsView = action(
    'ConflictsView_initialize',
    (scenario: ConflictsViewScenario, meetingRequest: MeetingRequestMessageType) => ({
        scenario,
        meetingRequest,
    })
);

export const resetConflictsView = action(
    'ConflictsView_reset',
    (scenario: ConflictsViewScenario) => ({
        scenario,
    })
);
