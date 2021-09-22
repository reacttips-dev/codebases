import getStore from '../store/store';
import { mergeDateAndTime } from 'owa-datetime';
import { mutator } from 'satcheljs';
import { getStartDate } from '../../selectors/getStoreProperties';
import setStartTime from '../../actions/setStartTime';
import getEndDateAfterModifications from '../../utils/getEndDateAfterModifications';

/**
 * Function to mutate the start time.
 */
export default mutator(setStartTime, ({ dateTime }) => {
    const { currentState } = getStore();
    currentState.startDate = mergeDateAndTime(getStartDate(), dateTime);
    currentState.endDate = getEndDateAfterModifications();
});
