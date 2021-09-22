import getStore from '../store/store';
import { mergeDateAndTime } from 'owa-datetime';
import { mutator } from 'satcheljs';
import { getEndDate } from '../../selectors/getStoreProperties';
import setEndTime from '../../actions/setEndTime';
import getEndDateAfterModifications from '../../utils/getEndDateAfterModifications';

/**
 * Function to mutate the end time.
 */
export default mutator(setEndTime, ({ dateTime }) => {
    const { currentState } = getStore();
    currentState.endDate = mergeDateAndTime(getEndDate(), dateTime);
    currentState.endDate = getEndDateAfterModifications();
});
