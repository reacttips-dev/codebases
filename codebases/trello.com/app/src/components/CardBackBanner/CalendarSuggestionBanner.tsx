import React, { useCallback, useEffect } from 'react';
import { ViewSuggestionBanner } from './ViewSuggestionBanner';
import { Urls } from 'app/scripts/controller/urls';
const { getBoardUrl } = Urls;
import { navigate } from 'app/scripts/controller/navigate';
import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { ViewSuggestionTestIds } from '@trello/test-ids/src/testIds';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';

const format = forTemplate('card_detail');

interface CalendarSuggestionBannerProps {
  idCard: string;
  idBoard: string;
  idOrg: string;
  hasCover?: boolean;
  hasStickers?: boolean;
  setIdToDismiss: (id: string) => void;
  dismissId: string;
}

export const CalendarSuggestionBanner: React.FunctionComponent<CalendarSuggestionBannerProps> = ({
  idCard,
  idBoard,
  idOrg,
  hasCover,
  hasStickers,
  setIdToDismiss,
  dismissId,
}) => {
  useEffect(() => {
    setIdToDismiss(dismissId);
  }, [dismissId, setIdToDismiss]);

  useEffect(() => {
    Analytics.sendViewedBannerEvent({
      bannerName: 'calendarViewSuggestionBanner',
      source: 'cardDetailScreen',
      containers: {
        card: { id: idCard },
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  });

  const openCalendarView = useCallback(() => {
    const advancedCalendarUrl = getBoardUrl(idBoard, 'calendar-view');

    navigate(advancedCalendarUrl, { trigger: true });

    Analytics.sendClickedLinkEvent({
      linkName: 'calenderViewLink',
      source: 'calendarViewSuggestionBanner',
      containers: {
        card: { id: idCard },
        board: { id: idBoard },
        organization: { id: idOrg },
      },
    });
  }, [idBoard, idCard, idOrg]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.ViewSuggestionUpsell,
      }}
    >
      <ViewSuggestionBanner
        testId={ViewSuggestionTestIds.CalendarSuggestionUpsell}
        idCard={idCard}
        bannerText={format('keep-track-dates')}
        linkText={format('open-calendar')}
        navigateTo={openCalendarView}
        hasCover={hasCover}
        hasStickers={hasStickers}
      />
    </ErrorBoundary>
  );
};
