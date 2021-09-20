import React, { useCallback } from 'react';
import { CardBackPresentationalBanner } from './CardBackPresentationalBanner';
import { Purple100 } from '@trello/colors';
import { Button } from '@trello/nachos/button';
import styles from './ViewSuggestionBanner.less';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';

interface ViewSuggestionBannerProps {
  bannerText: string;
  idCard: string;
  linkText: string;
  navigateTo: () => void;
  testId: string;
  hasCover?: boolean;
  hasStickers?: boolean;
}

export const ViewSuggestionBanner: React.FunctionComponent<ViewSuggestionBannerProps> = ({
  bannerText,
  hasCover,
  hasStickers,
  idCard,
  linkText,
  navigateTo,
  testId,
}) => {
  const clickViewSuggestionLink = useCallback(() => {
    navigateTo();
  }, [navigateTo]);

  return (
    <CardBackPresentationalBanner
      bannerText={bannerText}
      bannerColor={Purple100}
      bannerImageClass="views"
      testId={testId}
      hasCover={hasCover}
      hasStickers={hasStickers}
    >
      <Button
        className={styles.viewLink}
        appearance="link"
        onClick={clickViewSuggestionLink}
      >
        {linkText}
      </Button>
      <ExternalLinkIcon color="blue" size="small" />
    </CardBackPresentationalBanner>
  );
};
