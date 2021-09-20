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

interface TimelineSuggestionBannerProps {
  idCard: string;
  idBoard: string;
  idOrg: string;
  bannerType: 'label' | 'member' | 'none';
  hasCover?: boolean;
  hasStickers?: boolean;
  setIdToDismiss: (id: string) => void;
  dismissId: string;
}

export const TimelineSuggestionBanner: React.FunctionComponent<TimelineSuggestionBannerProps> = ({
  idCard,
  idBoard,
  idOrg,
  bannerType,
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
      bannerName: 'timelineViewSuggestionBanner',
      source: 'cardDetailScreen',
      containers: {
        card: { id: idCard },
        board: { id: idBoard },
        organization: { id: idOrg },
      },
      attributes: {
        type: bannerType,
      },
    });
  });

  const openTimelineView = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'timelineViewLink',
      source: 'timelineViewSuggestionBanner',
      containers: {
        card: { id: idCard },
        board: { id: idBoard },
        organization: { id: idOrg },
      },
      attributes: {
        type: bannerType,
      },
    });

    const timelineUrl = getBoardUrl(idBoard, 'timeline');

    navigate(timelineUrl, { trigger: true });
  }, [idBoard, idCard, idOrg, bannerType]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.ViewSuggestionUpsell,
      }}
    >
      <ViewSuggestionBanner
        testId={ViewSuggestionTestIds.TimelineSuggestionUpsell}
        idCard={idCard}
        bannerText={
          bannerType === 'label'
            ? format('organize-with-timeline')
            : format('track-workload')
        }
        linkText={format('open-timeline')}
        navigateTo={openTimelineView}
        hasCover={hasCover}
        hasStickers={hasStickers}
      />
    </ErrorBoundary>
  );
};
