/* eslint-disable import/no-default-export */
import cx from 'classnames';
import { PublicIcon } from '@trello/nachos/icons/public';
import { OrganizationVisibleIcon } from '@trello/nachos/icons/organization-visible';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { forTemplate } from '@trello/i18n';
import { CardFront } from 'app/gamma/src/components/canonical-components';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { getBoardById } from 'app/gamma/src/selectors/boards';
import { getCardById } from 'app/gamma/src/selectors/cards';
import { getListById } from 'app/gamma/src/selectors/lists';
import { getLabelsByIds } from 'app/gamma/src/selectors/labels';
import { useSharedState } from '@trello/shared-state';
import { showLabelsState } from 'app/src/components/Label';
import { isColorBlind, getMembersByIds } from 'app/gamma/src/selectors/members';
import { getUnreadNotificationsCountForCard } from 'app/gamma/src/selectors/notifications';
import {
  AccessLevel,
  BoardModel,
  BoardPermissionLevel,
  CardModel,
  LabelModel,
  ListModel,
  MemberModel,
} from 'app/gamma/src/types/models';
import styles from './search-results.less';
import { Analytics } from '@trello/atlassian-analytics';
import { BoardCard } from 'app/src/components/CardFronts';
import { noop } from 'app/src/noop';

const format = forTemplate('search_results_card');
const SEARCH_CARD_COVER_MAX_HEIGHT = 64;

interface OwnProps {
  id: string;
  onPreviewHover: React.MouseEventHandler;
  onPreviewBlur: React.MouseEventHandler;
}

interface StateProps {
  card: CardModel;
  colorBlind: boolean;
  board?: BoardModel;
  boardUrl: string;
  isTemplate: boolean;
  list?: ListModel;
  labels: LabelModel[];
  members: MemberModel[];
  notificationCount: number;
}

interface CardResultsProps extends OwnProps, StateProps {}

const getPermIcon = (level: BoardPermissionLevel | undefined) => {
  switch (level) {
    case AccessLevel.Public:
      return (
        <PublicIcon
          size="small"
          dangerous_className={styles.permIcon}
          color="green"
        />
      );
    case AccessLevel.Org:
      return (
        <OrganizationVisibleIcon
          size="small"
          dangerous_className={styles.permIcon}
          color="yellow"
        />
      );
    case AccessLevel.Private:
    default:
      return (
        <PrivateIcon
          size="small"
          dangerous_className={styles.permIcon}
          color="red"
        />
      );
  }
};

const trackClickResultEvent = () => {
  Analytics.sendClickedLinkEvent({
    linkName: 'cardSearchResultLink',
    source: 'searchInlineDialog',
  });
};

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
  const card: CardModel = getCardById(state, props.id)!;
  const board = card.idBoard ? getBoardById(state, card.idBoard) : undefined;
  const boardUrl = board?.url || '';
  const list = getListById(state, card.idList as string);
  const members = getMembersByIds(state, card.idMembers || []);
  const labels = getLabelsByIds(state, card.idLabels || []);
  const colorBlind = isColorBlind(state);
  const notificationCount = getUnreadNotificationsCountForCard(state, card.id);
  const isTemplate = card.isTemplate || false;

  return {
    card,
    list,
    board,
    boardUrl,
    isTemplate,
    members,
    labels,
    colorBlind,
    notificationCount,
  };
};

const CardResult = ({
  card,
  colorBlind,
  board,
  isTemplate,
  list,
  members,
  notificationCount,
  labels,
  onPreviewHover,
  onPreviewBlur,
  boardUrl,
}: CardResultsProps) => {
  const [labelState] = useSharedState(showLabelsState);

  const isLinkCard = card.cardRole === 'link';
  const isBoardCard = card.cardRole === 'board';
  if (card.cardRole === 'mirror') return null;
  return (
    <div className={styles.cardResult}>
      <div className={styles.cardPreviewContainer}>
        {isLinkCard || isBoardCard ? (
          <a
            onClick={trackClickResultEvent}
            href={card.name}
            className={styles.cardPreviewHoverTarget}
            onMouseEnter={onPreviewHover}
            onMouseLeave={onPreviewBlur}
            aria-label={card.name}
            target="_blank"
          />
        ) : (
          <RouterLink
            onClick={trackClickResultEvent}
            href={card.url as string}
            className={styles.cardPreviewHoverTarget}
            onMouseEnter={onPreviewHover}
            onMouseLeave={onPreviewBlur}
            aria-label={card.name}
          />
        )}
        {isBoardCard ? (
          <BoardCard
            className={cx(styles.cardPreview, {
              [styles.linkCardFront]: isLinkCard,
            })}
            isClosed={false}
            openEditor={noop}
            removeCardRole={noop}
            boardUrl={card.name}
            isEditable={false}
            inSearchResults={true}
          />
        ) : (
          <CardFront
            name={card.name}
            cover={
              board && board.prefs && board.prefs.cardCovers ? card.cover : null
            }
            coverHeight={SEARCH_CARD_COVER_MAX_HEIGHT}
            archived={card.closed}
            badges={card.badges}
            members={members}
            numNotifications={notificationCount}
            labels={labels}
            colorBlind={colorBlind}
            isTemplate={isTemplate}
            expandLabels={labelState.showText}
            stickers={card.stickers}
            className={cx(styles.cardPreview, {
              [styles.linkCardFront]: isLinkCard,
            })}
            style={{ width: '100%' }}
            truncateNameForFullCover
            cardRole={card.cardRole}
          />
        )}
      </div>
      <div className={styles.cardMetadata}>
        {isLinkCard ? (
          <a
            className={styles.cardLink}
            href={card.name}
            onClick={trackClickResultEvent}
            target="_blank"
          >
            {card.name}
          </a>
        ) : (
          <RouterLink
            className={styles.cardLink}
            href={isBoardCard ? boardUrl : (card.url as string)}
            onClick={trackClickResultEvent}
          >
            {isBoardCard ? boardUrl : card.name}
          </RouterLink>
        )}
        {board && (
          <div className={styles.cardDetails}>
            {list
              ? format('in-listname', {
                  listName: (
                    <strong key={`card-list-name-${card.id}`}>
                      {list.name}
                    </strong>
                  ),
                })
              : null}
            {format('on-boardname', {
              boardName: (
                <span key={`card-board-name-${card.id}`}>
                  <strong>{board.name}</strong>
                  {getPermIcon(board.prefs && board.prefs.permissionLevel)}
                </span>
              ),
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(CardResult);
