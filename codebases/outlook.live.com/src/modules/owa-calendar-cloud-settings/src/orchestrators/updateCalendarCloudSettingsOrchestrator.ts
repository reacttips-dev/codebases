import { setCalendarCloudSetting, updateCalendarCloudSettings } from '../actions/internalActions';
import { orchestrator } from 'satcheljs';

orchestrator(updateCalendarCloudSettings, actionMessage => {
    const { calendarCloudSettings } = actionMessage;

    calendarCloudSettings.forEach(setting => {
        setCalendarCloudSetting(setting);
    });
});
