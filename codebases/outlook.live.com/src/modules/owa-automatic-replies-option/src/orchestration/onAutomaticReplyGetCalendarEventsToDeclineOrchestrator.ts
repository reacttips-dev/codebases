import getStore from '../data/store/store';
import updateCalendarEventsToDecline from '../actions/updateCalendarEventsToDecline';
import { orchestrator } from 'satcheljs';
import updateCalendarViewItems from '../data/mutators/updateCalendarViewItems';
import getCalendarViewService from 'owa-calendar-services/lib/services/getCalendarViewService';
import type GetCalendarViewResponse from 'owa-service/lib/contract/GetCalendarViewResponse';
import { getStartDate, getEndDate } from '../selectors/getStoreProperties';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getEwsRequestString } from 'owa-datetime';

export default orchestrator(updateCalendarEventsToDecline, async () => {
    let optionState = getStore().currentState;
    if (optionState.declineExistingCalendarEventsEnabled) {
        let startDate = getEwsRequestString(getStartDate());
        let endDate = getEwsRequestString(getEndDate());
        const response: GetCalendarViewResponse = await getCalendarViewService(
            startDate,
            endDate,
            folderNameToId('calendar')
        );
        updateCalendarViewItems(response.Items);
    }
});
