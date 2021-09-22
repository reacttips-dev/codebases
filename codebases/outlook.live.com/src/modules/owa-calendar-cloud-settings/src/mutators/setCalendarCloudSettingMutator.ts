import { setCalendarCloudSetting } from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';

/**
 * Called to set a calendar cloud setting in store
 */
export default mutator(setCalendarCloudSetting, actionMessage => {
    getStore().settings.set(
        actionMessage.calendarCloudSetting.name.toLowerCase(),
        actionMessage.calendarCloudSetting
    );
});
