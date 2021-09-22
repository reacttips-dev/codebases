import moment from 'moment';
import NumberHelpers from 'core/src/helpers/number-helpers';

const TimestampHelper = {

  getTimeAgo: function(dataTimestamp) {
    const nowTime = moment();
    const postedTime = moment.unix(dataTimestamp);
    const mins = nowTime.diff(postedTime, 'minutes');
    const hours = nowTime.diff(postedTime, 'hours');
    const days = nowTime.diff(postedTime, 'days');
    const weeks = nowTime.diff(postedTime, 'weeks');
    const months = nowTime.diff(postedTime, 'months');
    const years = nowTime.diff(postedTime, 'years');
    let timeAgo = '';

    if (mins <= 0) {
      timeAgo = 'less than a minute ago';
    } else if (hours <= 0) {
      timeAgo = NumberHelpers.pluralize(mins, 'minute') + ' ago';
    } else if (days <= 0) {
      timeAgo = NumberHelpers.pluralize(hours, 'hour') + ' ago';
    } else if (weeks <= 0) {
      timeAgo = NumberHelpers.pluralize(days, 'day') + ' ago';
    } else if (months <= 0) {
      timeAgo = NumberHelpers.pluralize(weeks, 'week') + ' ago';
    } else if (years <= 0) {
      timeAgo = NumberHelpers.pluralize(months, 'month') + ' ago';
    } else {
      timeAgo = ('about ' + NumberHelpers.pluralize(years, 'year') + ' ago');
    }

    return timeAgo;
  },

  getTimeFromSeconds: function(totalSeconds) {
    const duration = moment.duration(totalSeconds, 'seconds');

    const hours = this.formatTimeInterval(duration.hours());
    const minutes = this.formatTimeInterval(duration.minutes());
    const seconds = this.formatTimeInterval(duration.seconds());

    if (duration.hours()) {
      return hours + ':' + minutes + ':' + seconds;
    }

    return minutes + ':' + seconds;
  },

  formatTimeInterval: function(interval) {
    if (interval < 10) {
      return '0' + interval;
    }

    return interval;
  },

};

export default TimestampHelper;

