/*
  TimeDuration converts a millisecond duration into a humanized duration with internationalization.

  note: MomentJS was not used, because Moment's humanize is imprecise and only returns the largest interval.
        For example, a duration of 1:30 becomes 1 hour and 1:45 becomes 2 hours.  Third-party plugins were also
        not an option, because they run into internationalization issues.  Also, the FormattedMessage "time" type
        does not support the concept of days and would require customization when we move to multi-day projects.
*/

import PropTypes from 'prop-types';

import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { DAY, HOUR, MINUTE, SECOND } from 'bundles/ondemand/constants/TimeInterval';
import _t from 'i18n!nls/phoenix';

import { TimeInterval } from 'bundles/ondemand/types/TimeInterval';

type IntervalPart = {
  value: number;
  interval: TimeInterval;
};

function durationToParts(duration: number): Array<IntervalPart> {
  let remaining = duration;
  const parts: Array<IntervalPart> = [DAY, HOUR, MINUTE, SECOND].reduce((accum, interval) => {
    const value = Math.floor(remaining / interval.millis);
    remaining %= interval.millis;
    if (value > 0) {
      accum.push({ value, interval });
    }
    return accum;
  }, [] as Array<IntervalPart>);

  if (parts.length === 0) {
    parts.push({ value: 0, interval: SECOND });
  }

  return parts;
}

function itemsToI18nList(items: Array<any>): React.ReactNode {
  let result: React.ReactNode = null;

  switch (items.length) {
    case 4:
      result = (
        <FormattedMessage
          message={_t('{first}, {second}, {third}, and {fourth}')}
          first={items[0]}
          second={items[1]}
          third={items[2]}
          fourth={items[3]}
        />
      );
      break;
    case 3:
      result = (
        <FormattedMessage
          message={_t('{first}, {second}, and {third}')}
          first={items[0]}
          second={items[1]}
          third={items[2]}
        />
      );
      break;
    case 2:
      result = <FormattedMessage message={_t('{first} and {second}')} first={items[0]} second={items[1]} />;
      break;
    case 1:
    default:
      result = <span>{items[0]}</span>;
  }

  return result;
}

class TimeDuration extends React.Component<any> {
  static propTypes = {
    duration: PropTypes.number.isRequired,
    showNumberIfSingular: PropTypes.bool,
    showPrecise: PropTypes.bool,
    showSeconds: PropTypes.bool,
  };

  static defaultProps = {
    showNumberIfSingular: true,
    showPrecise: false,
    showSeconds: false,
  };

  renderDurationPart(value: number, interval: TimeInterval) {
    const { showNumberIfSingular } = this.props;

    if (value === 1 && !showNumberIfSingular) {
      return interval.singular;
    } else {
      return (
        <FormattedMessage
          message="{val} {val, plural, =1 {{singular}} other {{plural}}}"
          val={value.toString()}
          singular={interval.singular}
          plural={interval.plural}
        />
      );
    }
  }

  renderPreciseDuration() {
    const { duration, showSeconds } = this.props;
    const parts = durationToParts(duration);

    // select intervals to display
    const allowedIntervals = parts.filter((part: IntervalPart) => {
      return part.interval !== SECOND || showSeconds;
    });

    // turn each part into a formatted message element (ie. array of components for: 1 day, 2 hours, 30 minutes, etc.)
    const humanizedIntervals = allowedIntervals.map((part: IntervalPart) => {
      return this.renderDurationPart(part.value, part.interval);
    });

    if (!humanizedIntervals.length && parts.length === 1 && ((parts || [])[0] || {}).interval === SECOND) {
      return _t('less than 1 minute');
    }

    return itemsToI18nList(humanizedIntervals);
  }

  renderDuration() {
    const { duration } = this.props;
    const parts = durationToParts(duration);
    return this.renderDurationPart(parts[0].value, parts[0].interval);
  }

  render() {
    const { showPrecise } = this.props;
    return (
      <span className="rc-TimeDuration">
        {showPrecise && this.renderPreciseDuration()}
        {!showPrecise && this.renderDuration()}
      </span>
    );
  }
}

export default TimeDuration;
