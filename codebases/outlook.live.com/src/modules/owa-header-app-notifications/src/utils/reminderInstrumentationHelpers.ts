import { logUsage } from 'owa-analytics';
import type { ReminderInsightType } from 'owa-meeting-insights/lib/selectors/insightsForReminderSelectors';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';

export type ReminderActionType = 'ReminderRendered' | 'ReminderClicked' | 'ReminderDismissed';

// Calendar custom data
export interface CalendarReminderCustomData {
    insightType: ReminderInsightType;
}

export default function logReminderAction(
    actionType: ReminderActionType,
    reminderTypeEnum: ReminderGroupTypes,
    additionalCustomData?: CalendarReminderCustomData
) {
    const reminderType = convertReminderTypeEnumToString(reminderTypeEnum);
    logUsage('reminderAction', null /* customData*/, {
        isCore: true,
        cosmosOnlyData: JSON.stringify({ actionType, reminderType, ...additionalCustomData }),
    });
}

function convertReminderTypeEnumToString(reminderType: ReminderGroupTypes): string {
    switch (reminderType) {
        case ReminderGroupTypes.Calendar:
            return 'Calendar';
        case ReminderGroupTypes.Task:
            return 'Task';
        case ReminderGroupTypes.Birthdays:
            return 'Birthdays';
        case ReminderGroupTypes.All:
            return 'All';

        default:
            return 'None';
    }
}
