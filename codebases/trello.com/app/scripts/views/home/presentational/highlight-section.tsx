import React from 'react';

import { HomeTestIds } from '@trello/test-ids';
import { HeartIcon } from '@trello/nachos/icons/heart';
import classNames from 'classnames';
import { Spinner } from '@trello/nachos/spinner';
import { ScrolledPastWatcher } from 'app/src/components/ScrolledPastWatcher';

import { DismissAnimation, TransitionGroup } from './dismiss-animation';
import FeedErrorBoundary from './feed-error-boundary';
import { FeedbackLink } from './feedback-link';
import { OrientationCard } from './orientation-card';
import { SectionHeader, SectionHeaderButton } from './section-header';

import styles from './highlight-section.less';

import { forTemplate } from '@trello/i18n';
const l = forTemplate('home');

interface HighlightListProps {
  dismissHighlightsCard: (idAction: string) => void;
  renderHighlight: (idAction: string) => JSX.Element;
  idActions: string[];
}

const HighlightList: React.FunctionComponent<HighlightListProps> = ({
  dismissHighlightsCard,
  idActions,
  renderHighlight,
}) => (
  <TransitionGroup component="ul" data-test-id={HomeTestIds.HighlightsList}>
    {idActions.map((idAction) => (
      <DismissAnimation id={idAction} key={idAction}>
        <li key={idAction} className={styles.highlight}>
          <FeedErrorBoundary
            // eslint-disable-next-line react/jsx-no-bind
            onError={() => dismissHighlightsCard(idAction)}
          >
            {renderHighlight(idAction)}
          </FeedErrorBoundary>
        </li>
      </DismissAnimation>
    ))}
  </TransitionGroup>
);

interface HighlightSectionProps {
  myId: string;
  idActions: string[];
  showUnreadActionsButton: boolean;
  loadingMore: boolean;
  moreHighlightsAvailable: boolean;
  loadMoreHighlights: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showUnreadHighlights: (e: React.MouseEvent<HTMLButtonElement>) => void;
  dismissHighlightsCard: (idAction: string) => void;
  dismissHighlightsOrientationCard: () => void;
  shouldShowHighlightsOrientationCard: boolean;
  dismissFeedbackOrientationCard: () => void;
  shouldShowFeedbackOrientationCard: boolean;
  idOrganization: string | null;
  // renderHighlight() is "connected" to modelCache, similarly to using react-redux's `connect`.
  renderHighlight: (idAction: string) => JSX.Element;
  setFixedButton: (enabled: boolean) => void;
}

export class HighlightSection extends React.PureComponent<HighlightSectionProps> {
  render() {
    const {
      myId,
      idActions,
      showUnreadActionsButton,
      loadingMore,
      moreHighlightsAvailable,
      loadMoreHighlights,
      showUnreadHighlights,
      shouldShowHighlightsOrientationCard,
      dismissHighlightsCard,
      dismissHighlightsOrientationCard,
      shouldShowFeedbackOrientationCard,
      dismissFeedbackOrientationCard,
      idOrganization,
      renderHighlight,
      setFixedButton,
    } = this.props;

    return (
      <div className={styles.highlightSection}>
        {!!idActions.length && (
          <>
            <SectionHeader
              icon={<HeartIcon />}
              button={
                showUnreadActionsButton ? (
                  <ScrolledPastWatcher setScrolledPast={setFixedButton}>
                    <SectionHeaderButton onClick={showUnreadHighlights}>
                      {l('show-new-activity')}
                    </SectionHeaderButton>
                  </ScrolledPastWatcher>
                ) : null
              }
            >
              {idOrganization ? l('team-highlights') : l('highlights')}
            </SectionHeader>
            {shouldShowHighlightsOrientationCard && (
              <OrientationCard
                titleKey="orientation-highlight-title"
                textKey="orientation-highlight-text"
                backgroundName="highlight"
                onDismissClick={dismissHighlightsOrientationCard}
              />
            )}
            {shouldShowFeedbackOrientationCard && (
              <OrientationCard
                titleKey="orientation-feedback-title"
                textKey="orientation-feedback-text"
                backgroundName="feedback"
                textCenter
                onDismissIconClick={dismissFeedbackOrientationCard}
                actionButton={
                  <FeedbackLink
                    idMember={myId}
                    onFeedbackButtonClick={dismissFeedbackOrientationCard}
                  />
                }
              />
            )}
            <HighlightList
              idActions={idActions}
              dismissHighlightsCard={dismissHighlightsCard}
              renderHighlight={renderHighlight}
            />
            {loadingMore && (
              <Spinner wrapperClassName={styles.spinnerWrapper} centered />
            )}
            {!loadingMore && moreHighlightsAvailable && (
              <button
                className={classNames(
                  styles.showMoreButton,
                  'show-more',
                  'u-text-align-center',
                )}
                onClick={loadMoreHighlights}
              >
                {l('show-more-activity')}
              </button>
            )}
          </>
        )}
      </div>
    );
  }
}
