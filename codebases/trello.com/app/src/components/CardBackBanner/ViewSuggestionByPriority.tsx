import React, { useCallback, useEffect, useState } from 'react';
import { useViewSuggestionQuery } from './ViewSuggestionQuery.generated';
import { CalendarSuggestionBanner } from './CalendarSuggestionBanner';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Auth } from 'app/scripts/db/auth';
import { TimelineSuggestionBanner } from './TimelineSuggestionBanner';

interface ViewSuggestionByPriorityProps {
  idCard: string;
  idBoard: string;
  idOrg: string;
  hasCover?: boolean;
  hasStickers?: boolean;
  setIdToDismiss: (id: string) => void;
}

interface TimelineBannerDisplay {
  type: 'label' | 'member' | 'none';
  displaying: boolean;
}

export const ViewSuggestionByPriority: React.FunctionComponent<ViewSuggestionByPriorityProps> = ({
  idCard,
  idBoard,
  idOrg,
  hasCover,
  hasStickers,
  setIdToDismiss,
}) => {
  const [currentData, setCurrentData] = useState({
    start: false,
    due: false,
    checkItemsDueCount: 0,
    membersCount: 0,
    labelsCount: 0,
  });
  const [previousData, setPreviousData] = useState({
    start: false,
    due: false,
    checkItemsDueCount: 0,
    membersCount: 0,
    labelsCount: 0,
  });
  const [isInitialRun, setIsIntialRun] = useState(true);
  const [showingCalendarBanner, setShowingCalendarBanner] = useState(false);
  const [
    showingTimelineBannerType,
    setShowingTimelineBannerType,
  ] = useState<TimelineBannerDisplay>({ type: 'none', displaying: false });

  const { data: cardData } = useViewSuggestionQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      idCard,
    },
  });

  const calendar_banner_dismissed_id = `calendar-view-suggestion-${idOrg}`;
  const timeline_banner_dismissed_id = `timeline-view-suggestion-${idOrg}`;

  const calendarBannerDismissed = Auth.me().isDismissed(
    calendar_banner_dismissed_id,
  );
  const timelineBannerDismissed = Auth.me().isDismissed(
    timeline_banner_dismissed_id,
  );

  const showCalendarBanner = useCallback(() => {
    //Do not show the banner if it's dismissed or if we have no data
    if (
      calendarBannerDismissed ||
      isInitialRun ||
      showingTimelineBannerType.displaying
    ) {
      return false;
    } else {
      //If the banner isn't dismissed, show the banner if any new date type gets added
      //Do not remove the banner for any further changes to date, to maximize exposure time
      const startAdded = !previousData?.start && currentData.start;
      const dueDateAdded = !previousData?.due && currentData.due;
      const checkItemDateAdded =
        previousData?.checkItemsDueCount < currentData?.checkItemsDueCount;
      const newDateAdded = startAdded || dueDateAdded || checkItemDateAdded;

      if (newDateAdded && !showingCalendarBanner) {
        setShowingCalendarBanner(true);
        return true;
      } else return false;
    }
  }, [
    calendarBannerDismissed,
    showingTimelineBannerType,
    previousData,
    currentData,
    isInitialRun,
    showingCalendarBanner,
  ]);

  const showTimelineBanner = useCallback(() => {
    //Do not show the banner if it's dismissed or if we have no data
    if (timelineBannerDismissed || isInitialRun || showingCalendarBanner) {
      return false;
    } else {
      //If the banner isn't dismissed, show the banner if any new label or member gets added
      //Do not remove the banner for any further changes to dates or labels, to maximize exposure time
      const labelAdded = previousData?.labelsCount < currentData?.labelsCount;
      const memberAdded =
        previousData?.membersCount < currentData?.membersCount;

      if (
        labelAdded &&
        !showingCalendarBanner &&
        !showingTimelineBannerType.displaying
      ) {
        setShowingTimelineBannerType({ type: 'label', displaying: true });
        return true;
      } else if (
        memberAdded &&
        !showingCalendarBanner &&
        !showingTimelineBannerType.displaying
      ) {
        setShowingTimelineBannerType({ type: 'member', displaying: true });
        return true;
      } else return false;
    }
  }, [
    timelineBannerDismissed,
    showingTimelineBannerType,
    showingCalendarBanner,
    previousData,
    currentData,
    isInitialRun,
  ]);

  useEffect(() => {
    const hasDue = Boolean(cardData?.card?.due);
    const hasStart = Boolean(cardData?.card?.start);
    //Store list of CheckItem Ids that have a due date.
    const checkItemDueList = cardData?.card?.checklists
      .flatMap((checklist) => checklist.checkItems)
      .filter((item) => item.due)
      .map((dueItems) => dueItems.id);
    //Store list of current card members
    const membersCount = cardData?.card?.idMembers?.length;
    const labelsCount = cardData?.card?.idLabels?.length;

    const currentData = {
      due: hasDue,
      start: hasStart,
      checkItemsDueCount: checkItemDueList ? checkItemDueList.length : 0,
      membersCount: membersCount ? membersCount : 0,
      labelsCount: labelsCount ? labelsCount : 0,
    };

    if (!calendarBannerDismissed || !timelineBannerDismissed) {
      //If the card has no date to begin with, allow possibility to show it
      //If the card does have a date to begin with, listen for date removal
      //If the card does not have a date to begin with, listen for date addition
      if (isInitialRun && cardData) {
        setIsIntialRun(false);
        setPreviousData(currentData);
        setCurrentData(currentData);
      } else if (cardData) {
        setPreviousData(previousData);
        setCurrentData(currentData);
      }
    }
  }, [
    isInitialRun,
    cardData,
    calendarBannerDismissed,
    timelineBannerDismissed,
    previousData,
    setPreviousData,
    setCurrentData,
  ]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.ViewSuggestionUpsell,
      }}
    >
      {!showingTimelineBannerType.displaying &&
        (showingCalendarBanner || showCalendarBanner()) && (
          <CalendarSuggestionBanner
            idCard={idCard}
            idBoard={idBoard}
            idOrg={idOrg}
            hasCover={hasCover}
            hasStickers={hasStickers}
            setIdToDismiss={setIdToDismiss}
            dismissId={calendar_banner_dismissed_id}
          />
        )}
      {!showingCalendarBanner &&
        (showingTimelineBannerType.displaying || showTimelineBanner()) && (
          <TimelineSuggestionBanner
            idCard={idCard}
            idBoard={idBoard}
            idOrg={idOrg}
            bannerType={showingTimelineBannerType.type}
            hasCover={hasCover}
            hasStickers={hasStickers}
            setIdToDismiss={setIdToDismiss}
            dismissId={timeline_banner_dismissed_id}
          />
        )}
    </ErrorBoundary>
  );
};
