'use es6';

import I18n from 'I18n';
import { daysAgo, endOfPrior, now, startOfPrior, startOfThis } from '../core/SimpleDate';
export var TODAY = {
  presetId: 'TODAY',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.THIS_DAY');
  },
  getValue: function getValue(tz) {
    return {
      startDate: now(tz),
      endDate: now(tz)
    };
  }
};
export var YESTERDAY = {
  presetId: 'YESTERDAY',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_DAY');
  },
  getValue: function getValue(tz) {
    return {
      startDate: daysAgo(1, tz),
      endDate: daysAgo(1, tz)
    };
  }
};
export var THIS_WEEK = {
  presetId: 'THIS_WEEK',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.THIS_WEEK');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfThis('week', tz),
      endDate: now(tz)
    };
  }
};
export var LAST_WEEK = {
  presetId: 'LAST_WEEK',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_WEEK');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfPrior('week', 1, tz),
      endDate: endOfPrior('week')
    };
  }
};
export var THIS_MONTH = {
  presetId: 'THIS_MONTH',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.THIS_MONTH');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfThis('month', tz),
      endDate: now(tz)
    };
  }
};
export var LAST_MONTH = {
  presetId: 'LAST_MONTH',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_MONTH');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfPrior('month', 1, tz),
      endDate: endOfPrior('month')
    };
  }
};
export var LAST_THIRTY_DAYS = {
  presetId: 'LAST_THIRTY_DAYS',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_THIRTY_DAYS');
  },
  getValue: function getValue(tz) {
    return {
      startDate: daysAgo(29, tz),
      endDate: now(tz)
    };
  }
};
export var LAST_THREE_MONTHS = {
  presetId: 'LAST_THREE_MONTHS',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_THREE_MONTHS');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfPrior('month', 2, tz),
      endDate: now(tz)
    };
  }
};
export var THIS_QUARTER = {
  presetId: 'THIS_QUARTER',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.THIS_QUARTER');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfThis('quarter', tz),
      endDate: now(tz)
    };
  }
};
export var LAST_QUARTER = {
  presetId: 'LAST_QUARTER',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_QUARTER');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfPrior('quarter', 1, tz),
      endDate: endOfPrior('quarter', 1, tz)
    };
  }
};
export var LAST_YEAR = {
  presetId: 'LAST_YEAR',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.LAST_YEAR');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfPrior('year', 1, tz),
      endDate: endOfPrior('year', 1, tz)
    };
  }
};
export var THIS_YEAR = {
  presetId: 'THIS_YEAR',
  getText: function getText() {
    return I18n.text('salesUI.UIDateRangePicker.rangeType.THIS_YEAR');
  },
  getValue: function getValue(tz) {
    return {
      startDate: startOfThis('year', tz),
      endDate: now(tz)
    };
  }
};