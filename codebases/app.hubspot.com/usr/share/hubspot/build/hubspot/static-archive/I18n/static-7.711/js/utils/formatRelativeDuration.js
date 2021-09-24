'use es6';

import I18n from 'I18n';
import RelativeDurationFormats from '../constants/RelativeDurationFormats';
export default (function (duration, options) {
  var format = options && options.format || RelativeDurationFormats.MEDIUM;
  var combined = options && options.combined;
  var seconds = Math.round(duration.asSeconds());

  if (seconds < 60) {
    var secondsAmount = {
      seconds: seconds > 0 ? seconds : 1
    };

    if (format === RelativeDurationFormats.SHORT) {
      return I18n.text('i18n.duration.shortForm.seconds', secondsAmount);
    }

    return I18n.text('i18n.duration.seconds', secondsAmount);
  }

  var minutes = Math.round(duration.asMinutes());

  if (minutes < 60) {
    if (format === RelativeDurationFormats.SHORT) {
      return I18n.text('i18n.duration.shortForm.minutes', {
        minutes: minutes
      });
    }

    return I18n.text('i18n.duration.minutes', {
      minutes: minutes
    });
  }

  var hours = Math.round(duration.asHours());

  if (hours < 24) {
    if (combined) {
      var flooredHours = Math.floor(duration.asHours());
      var flooredMins = Math.floor(duration.asMinutes());

      if (flooredMins % 60 > 0) {
        if (format === RelativeDurationFormats.SHORT) {
          return I18n.text('i18n.duration.shortForm.hoursAndMinutes', {
            hours: flooredHours,
            minutes: flooredMins % 60
          });
        } else {
          return I18n.text('i18n.duration.hoursAndMinutes', {
            hours: flooredHours,
            minutes: flooredMins % 60
          });
        }
      }
    }

    if (format === RelativeDurationFormats.SHORT) {
      return I18n.text('i18n.duration.shortForm.hours', {
        hours: hours
      });
    }

    return I18n.text('i18n.duration.hours', {
      hours: hours
    });
  }

  var days = Math.round(duration.asDays());

  if (format === RelativeDurationFormats.SHORT) {
    return I18n.text('i18n.duration.shortForm.days', {
      days: days
    });
  }

  return I18n.text('i18n.duration.days', {
    days: days
  });
});