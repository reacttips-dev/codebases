'use es6';

import I18n from 'I18n';
import { timestampIsToday } from './timestampIsToday';
import { timestampIsTomorrow } from './timestampIsTomorrow';
export var formatOfficeHoursWillReturnTimestamp = function formatOfficeHoursWillReturnTimestamp(timestamp, locale) {
  var time = new Date(timestamp); // format: 8:00 AM

  var formattedTime = time.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (timestampIsToday(timestamp)) {
    return I18n.text('conversationsVisitorUIAvailability.sameDay', {
      time: formattedTime
    });
  }

  if (timestampIsTomorrow(timestamp)) {
    return I18n.text('conversationsVisitorUIAvailability.nextDay', {
      time: formattedTime
    });
  }

  return I18n.text('conversationsVisitorUIAvailability.nextWeek', {
    dayOfWeek: time.toLocaleDateString(locale, {
      weekday: 'long'
    }),
    time: formattedTime
  });
};