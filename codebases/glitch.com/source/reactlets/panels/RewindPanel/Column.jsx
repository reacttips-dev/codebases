import React, { useMemo } from 'react';
import cn from 'classnames';
import moment from 'moment';
import Item from './Item';

export default function Column({ revision, previousRevision, nextRevision, highlighted, select, users }) {
  const { dateTime, monthDay, time, year } = useMemo(() => {
    const dateMoment = moment(new Date(revision.timestamp * 1000));
    return {
      dateTime: dateMoment.format(),
      monthDay: dateMoment.format('MMM Do'),
      time: dateMoment.format('LT'),
      year: dateMoment.format('YYYY'),
    };
  }, [revision.timestamp]);

  // Only show the month/day if this is the most recent revision of that month/day
  // Only show the year if this is the most recent revision of that year
  // Show it all for the most recent revision
  const { showMonthDay, showYear } = useMemo(() => {
    if (!previousRevision || !nextRevision) {
      return {
        showMonthDay: true,
        showYear: true,
      };
    }

    const nextDateMoment = moment(new Date(nextRevision.timestamp * 1000));
    return {
      showMonthDay: nextDateMoment.format('MMM Do') !== monthDay,
      showYear: nextDateMoment.format('YYYY') !== year,
    };
  }, [previousRevision, nextRevision, monthDay, year]);

  return (
    /* Existing a11y issue ported to React */
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div className={cn('rewind-column', { highlighted })} data-revision-id={revision.hash} onClick={select}>
      <div className="time cell">
        <time dateTime={dateTime} title={dateTime} className="time-label">
          <span className={cn('time-label-year', !showYear && 'time-label-year-show-on-hover')}>{year}</span>
          <span className={cn('time-label-monthday', !showMonthDay && 'time-label-monthday-show-on-hover')}>{monthDay}</span>
          <span className="time-label-time">{time}</span>
        </time>
      </div>
      {users.map((user, i) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <Item key={i} index={i} revision={revision} previousRevision={previousRevision} user={user} />
      ))}
    </div>
  );
}
