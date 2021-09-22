import getStore from '../store/store';
import { mergeDateAndTime } from 'owa-datetime';
import { mutator } from 'satcheljs';
import setEndDate from '../../actions/setEndDate';
import { getEndDate } from '../../selectors/getStoreProperties';
import getEndDateAfterModifications from '../../utils/getEndDateAfterModifications';

/**
 * Function to mutate the end date.
 */
export default mutator(setEndDate, ({ date }) => {
    const { currentState } = getStore();
    currentState.endDate = mergeDateAndTime(date, getEndDate());
    currentState.endDate = getEndDateAfterModifications();
});
