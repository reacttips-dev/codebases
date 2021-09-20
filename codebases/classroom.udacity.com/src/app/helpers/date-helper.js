import _ from 'lodash';
import {
    __
} from 'services/localization-service';
import moment from 'moment';

const DateHelper = {
    formatDate(date) {
        return moment(date).format('MMMM DD, YYYY');
    },

    todayIsBetween(startDate, endDate) {
        return this.pastToday(startDate) && !this.pastToday(endDate);
    },

    getDaysLeftUntil(date) {
        if (moment(date).isSame(moment(), 'day')) {
            return __('today');
        } else if (moment(date).isSame(moment().add(1, 'day'), 'day')) {
            return __('tomorrow');
        } else if (moment().diff(date, 'days') < 0) {
            return moment(date).fromNow();
        } else {
            // If date is already past
            // admissions depends on falsy value if date has passed, if this behavior
            // changes, notify someone on the admissions team to update the behavior in /me
            return false;
        }
    },

    getDaysSince(date) {
        return moment().diff(moment(date), 'days');
    },

    getNumDaysLeftUntil(date) {
        // Returns a positive number if date is in the future
        return moment(date).diff(moment(), 'days');
    },

    getDaysBeforeFormatted(date) {
        if (moment(date).isSame(moment(), 'day')) {
            return __('today');
        } else if (moment(date).isSame(moment().subtract(1, 'day'), 'day')) {
            return __('yesterday');
        } else {
            return moment(date).format('MMMM DD');
        }
    },

    getTime(date) {
        return moment(date).format('h:mm A');
    },

    formatShortMonth(date) {
        return moment(date).format('MMM D, YYYY');
    },

    formatSuperShort(date) {
        return moment(date).format('MMM D');
    },

    formatShort(date) {
        return moment(date).format('MMM Do');
    },

    formatShortWithDayOfWeek(date) {
        return moment(date).format('MMM D, ddd');
    },

    formatShortWithDayOfWeekAndTime(date) {
        return moment(date).format('ddd, MMM D h:mm a');
    },

    formatLong(date) {
        return moment(date).format('MMMM Do');
    },

    beforeToday(date) {
        return moment().isBefore(date, 'day');
    },

    pastToday(date) {
        return moment().isAfter(date, 'day');
    },

    isWeekend(date) {
        const dayOfWeek = moment(date).format('d');
        // True only for Sunday or Saturday
        return dayOfWeek === '0' || dayOfWeek === '6';
    },

    formatRelativeDueDate(date) {
        return moment(date).fromNow();
    },

    setRelativeTimeThresholds(thresholds) {
        let currentThresholds = {};
        _.each(thresholds, (threshold, metric) => {
            currentThresholds[metric] = moment.relativeTimeThreshold(metric);
            moment.relativeTimeThreshold(metric, threshold);
        });

        return () => DateHelper.setRelativeTimeThresholds(currentThresholds);
    },

    getGracePeriod(date) {
        return moment(date).add(7, 'days').format('MMM D, YYYY');
    },

    getOmacLabDueDate(date, lab) {
        const dueAt = _.get(lab, 'displayNumber') === 1 ? 15 : 90; //omacV2 NDs all have 2 labs only
        return moment(date).clone().add(dueAt, 'days').toISOString();
    },

    isSameMonth(date1, date2) {
        return moment(date1).isSame(moment(date2), 'month');
    },
};

export default DateHelper;