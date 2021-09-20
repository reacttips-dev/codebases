import { HomeTestIds } from '@trello/test-ids';
import { ScrolledPastWatcher } from 'app/src/components/ScrolledPastWatcher';
import React from 'react';
import { DismissAnimation, TransitionGroup } from './dismiss-animation';
import FeedErrorBoundary from './feed-error-boundary';
import { OrientationCard } from './orientation-card';
import { SectionHeader, SectionHeaderButton } from './section-header';

import { forTemplate } from '@trello/i18n';
const l = forTemplate('home');

import styles from './up-next-section.less';
import { ClockIcon } from '@trello/nachos/icons/clock';

interface ItemModel {
  dismissed: boolean;
  id: string;
  pos: number;
  type: string;
  actionId: string;
}

export interface UpNextModel {
  boardId: string;
  cardId: string;
  dismissed?: boolean;
  id: string;
  item: ItemModel;
  listId: string;
  orgId: string;
}

type RenderUpNext = (upNextModel: UpNextModel) => JSX.Element;

interface UpNextListProps {
  numUpNextCardsVisible: number;
  renderUpNext: RenderUpNext;
  upNextCards: UpNextModel[];
  optimisticallyDismissCard: (
    upNextId: string,
    dismissed?: boolean,
    delay?: boolean,
  ) => void;
}

const UpNextList: React.FunctionComponent<UpNextListProps> = ({
  numUpNextCardsVisible,
  renderUpNext,
  upNextCards,
  optimisticallyDismissCard,
}) => (
  <TransitionGroup
    component="ul"
    className={styles.upNextCardList}
    data-test-id={HomeTestIds.UpNextList}
  >
    {upNextCards
      .filter((upNextCard, index) => index < numUpNextCardsVisible)
      .map((upNextCard) => {
        const upNextCardId = upNextCard ? upNextCard.id : '';

        return (
          <DismissAnimation id={upNextCardId} key={upNextCardId}>
            <li key={upNextCardId} className={styles.upNextCardListItem}>
              {/* Need to put this inside of the li because if there is an error in a hidden card
              and you click "Show more" an error get's thrown in CSSTransition and crashes the page */}
              <FeedErrorBoundary
                // eslint-disable-next-line react/jsx-no-bind
                onError={() => optimisticallyDismissCard(upNextCardId)}
              >
                {renderUpNext(upNextCard)}
              </FeedErrorBoundary>
            </li>
          </DismissAnimation>
        );
      })}
  </TransitionGroup>
);

interface UpNextSectionProps {
  dismissUpNextOrientationCard: () => void;
  numUpNextCardsVisible: number;
  onShowMoreUpNextClick: () => void;
  renderUpNext: RenderUpNext; // "connected" to modelCache, similarly to using react-redux's `connect`
  setFixedButton: (shouldShow: boolean) => void;
  shouldShowUpNextOrientationCard: boolean;
  showNewUpNextItems: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showUnreadUpNextActionsButton: boolean;
  upNextCards: UpNextModel[];
  optimisticallyDismissCard: (
    upNextId: string,
    dismissed?: boolean,
    delay?: boolean,
  ) => void;
}

export class UpNextSection extends React.PureComponent<UpNextSectionProps> {
  render() {
    const {
      dismissUpNextOrientationCard,
      numUpNextCardsVisible,
      onShowMoreUpNextClick,
      renderUpNext,
      setFixedButton,
      shouldShowUpNextOrientationCard,
      showNewUpNextItems,
      showUnreadUpNextActionsButton,
      upNextCards,
      optimisticallyDismissCard,
    } = this.props;

    return (
      <div className={styles.upNextCards}>
        {upNextCards.length ? (
          <SectionHeader
            icon={<ClockIcon />}
            button={
              showUnreadUpNextActionsButton ? (
                <ScrolledPastWatcher setScrolledPast={setFixedButton}>
                  <SectionHeaderButton onClick={showNewUpNextItems}>
                    {l('show-new-up-next')}
                  </SectionHeaderButton>
                </ScrolledPastWatcher>
              ) : null
            }
            data-test-id={HomeTestIds.UpNextSectionHeader}
          >
            {l('up-next')}
          </SectionHeader>
        ) : (
          <div className={styles.homeNoUpNextCards} />
        )}

        {shouldShowUpNextOrientationCard && !!upNextCards.length && (
          <OrientationCard
            backgroundName="up-next"
            onDismissClick={dismissUpNextOrientationCard}
            textKey="orientation-up-next-text"
            titleKey="orientation-up-next-title"
          />
        )}

        <UpNextList
          numUpNextCardsVisible={numUpNextCardsVisible}
          renderUpNext={renderUpNext}
          upNextCards={upNextCards}
          optimisticallyDismissCard={optimisticallyDismissCard}
        />

        {upNextCards.length > numUpNextCardsVisible && (
          <DismissAnimation id="show-more">
            <a
              className="show-more u-text-align-center"
              href="#"
              onClick={onShowMoreUpNextClick}
              role="button"
              data-test-id={HomeTestIds.UpNextShowMoreBtn}
            >
              {l('show-more')}
            </a>
          </DismissAnimation>
        )}
      </div>
    );
  }
}
