import { forTemplate } from '@trello/i18n';
import { l } from 'app/scripts/lib/localize';
import moment from 'moment';
import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@trello/nachos/spinner';
import styles from './ChooseDate.less';
import { Button } from '@trello/nachos/button';
import { ChecklistTestIds } from '@trello/test-ids';
import { importWithRetry } from '@trello/use-lazy-component';

const format = forTemplate('choose_date');

interface ChooseDateProps {
  dateInitial: Date | undefined;
  onSelect: (date: Date | null) => void;
  onReady?: () => void;
  testId?: ChecklistTestIds;
}

function getPikadayStrings() {
  return {
    previousMonth: l('prev month button text'),
    nextMonth: l('next month button text'),
    months: moment.months(),
    weekdays: moment.weekdays(),
    weekdaysShort: moment.weekdaysMin(),
  };
}

export function ChooseDate({
  dateInitial,
  onReady,
  onSelect,
}: ChooseDateProps) {
  const [loading, setLoading] = useState(true);
  const [field, setField] = useState<HTMLInputElement | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (field && container) {
      importWithRetry(
        () => import(/* webpackChunkName: "pikaday" */ 'pikaday'),
      ).then(({ default: Pikaday }) => {
        new Pikaday({
          field,
          container,
          bound: false,
          format: 'l',
          firstDay: moment.localeData().firstDayOfWeek(),
          i18n: getPikadayStrings(),
          keyboardInput: false,
          onSelect,
          defaultDate: dateInitial,
          setDefaultDate: true,
        });
        setLoading(false);
        onReady?.();
      });
    }
  }, [field, container, onReady, onSelect, dateInitial]);

  const onClick = useCallback(() => onSelect(null), [onSelect]);

  return (
    <>
      <input type="hidden" ref={setField} />
      <div ref={setContainer} className="calendarContainer" />
      {loading && <Spinner centered />}
      <div className={styles.buttons}>
        <Button
          onClick={onClick}
          shouldFitContainer
          isDisabled={!dateInitial}
          data-test-id={ChecklistTestIds.ChecklistItemRemoveDateButton}
        >
          {format('remove-date')}
        </Button>
      </div>
    </>
  );
}
