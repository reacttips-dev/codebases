import { ChooseDate } from 'app/src/components/ChooseDate';
import momentDefault from 'moment';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import React, { useCallback } from 'react';
import { Util } from 'app/scripts/lib/util';
import { Analytics } from '@trello/atlassian-analytics';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

interface OptionsV2 {
  title: string;
  //For tracking if toggled from checkItemView, EditableView, or checkItemComposer
  toggleSource?: string;
  // In V2, we can set the date directly, rather than embedding it in the
  // checkItem name.
  getInitialDate: () => string | undefined;
  setDate: (value: Date | null) => void;
  moment?: typeof momentDefault.utc;
  hourTime?: number;
}

function PopOverContents({
  setDate,
  dateInitial,
  moment,
  hourTime,
}: Required<Pick<OptionsV2, 'setDate' | 'moment' | 'hourTime'>> & {
  dateInitial?: Date;
}) {
  const onSelect = useCallback(
    (date) => {
      PopOver.hide();

      // Since the user doesn't pick a time, and the time isn't visible
      // shown, set the time to 6:00p. That way, the checkItem won't
      // appear overdue until after the workday is over and won't appear on the next day
      // for the majority of timezone overlaps.
      const endOfDay = date
        ? moment(date).hour(hourTime).minute(0).toDate()
        : null;

      setDate(endOfDay);
    },
    [hourTime, moment, setDate],
  );

  return <ChooseDate dateInitial={dateInitial} onSelect={onSelect} />;
}

export function toggleDatePopoverV2({
  title,
  toggleSource,
  getInitialDate,
  setDate,
  moment = momentDefault,
  hourTime = 18,
}: OptionsV2) {
  return function toggle(e: Event) {
    Util.stop(e);

    const dateString = getInitialDate() || undefined;
    const dateInitial = dateString ? moment(dateString).toDate() : undefined;

    Analytics.sendClickedButtonEvent({
      buttonName: 'checkItemDueButton',
      source: 'cardDetailScreen',
      attributes: {
        toggleSource: toggleSource,
      },
    });

    PopOver.toggle({
      elem: e.currentTarget,
      getViewTitle: () => title,
      keepEdits: true,
      reactElement: (
        <React.Fragment key="choose-date">
          <ErrorBoundary
            tags={{
              ownershipArea: 'trello-panorama',
              feature: Feature.Checklists,
            }}
          >
            <PopOverContents {...{ dateInitial, setDate, moment, hourTime }} />
          </ErrorBoundary>
        </React.Fragment>
      ),
    });
  };
}
