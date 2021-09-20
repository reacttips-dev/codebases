import ReducerHelper from 'helpers/reducer-helper';
import _ from 'lodash';
import moment from 'moment';

const ActivityHelper = {
    State: {
        getConceptCompletionDatesByNdKey(state) {
            return state.activity.conceptCompletionDatesByNdKey;
        },
    },

    dailyActivityFromCompletionDates(completionDates = []) {
        const datesToActivity = completionDates.reduce((datesToActivity, date) => {
            const dayDate = moment(date).format('YYYY-MM-DD');
            datesToActivity[dayDate] = (datesToActivity[dayDate] || 0) + 1;
            return datesToActivity;
        }, {});

        return Object.keys(datesToActivity)
            .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
            .map((date) => ({
                date,
                activity: datesToActivity[date]
            }));
    },

    conceptCompletionDatesFromNanodegree(nanodegree) {
        return ReducerHelper.getConceptsForNanodegree(nanodegree)
            .filter((concept) => !!_.get(concept, 'user_state.completed_at'))
            .map((concept) => concept.user_state.completed_at);
    },
};

export default ActivityHelper;