import { mutatorAction } from 'satcheljs';
import type WorkingHoursType from 'owa-service/lib/contract/WorkingHoursType';
import { getStore } from '../store/store';

export const updateCalendarWorkingHours = mutatorAction(
    'updateCalendarWorkingHours',
    (folderId: string, workingHours: WorkingHoursType) => {
        const { calendarFolderWorkingHours } = getStore();
        calendarFolderWorkingHours.set(folderId, workingHours);
    }
);
