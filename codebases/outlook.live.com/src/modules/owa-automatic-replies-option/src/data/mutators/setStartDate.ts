import getStore from '../store/store';
import { mergeDateAndTime } from 'owa-datetime';
import { mutator } from 'satcheljs';
import setStartDate from '../../actions/setStartDate';
import { getStartDate } from '../../selectors/getStoreProperties';
import getEndDateAfterModifications from '../../utils/getEndDateAfterModifications';

/**
 * Function to mutate the start date.
 */
export default mutator(setStartDate, ({ date }) => {
    const { currentState } = getStore();
    currentState.startDate = mergeDateAndTime(date, getStartDate());
    currentState.endDate = getEndDateAfterModifications();
});
