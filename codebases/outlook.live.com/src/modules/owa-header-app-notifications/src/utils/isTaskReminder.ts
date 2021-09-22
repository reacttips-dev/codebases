import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';

export default function isTaskReminder(reminderType: ReminderGroupTypes): boolean {
    return reminderType === ReminderGroupTypes.Task;
}
