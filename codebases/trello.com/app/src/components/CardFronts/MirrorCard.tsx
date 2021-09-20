import React, { useEffect, useCallback, useMemo } from 'react';
import {
  Green400,
  Yellow400,
  Orange400,
  Red400,
  Purple400,
  TrelloBlue400,
  Sky400,
  Lime400,
  Pink400,
  Black,
  N30,
} from '@trello/colors';
import { sortBy } from 'underscore';

import cx from 'classnames';

import {
  CanonicalCard,
  CanonicalBoard,
  CanonicalBoardCard,
} from '@atlassian/trello-canonical-components';

import { labelColorToColorBlindPattern } from '@atlassian/trello-canonical-components/src/card-front/CardLabel';
import { colorCoverColorBlindPattern } from '@atlassian/trello-canonical-components/src/card-front/Card';

const { BoardName, Board } = CanonicalBoard;

const { PlaceholderCard } = CanonicalBoardCard;

const {
  Card,
  CardLabel,
  CardLabels,
  CardTitle,
  CardStickers,
  Sticker,
  CardCover,
  CardMembers,
  CardDetails,
} = CanonicalCard;

import { parseTrelloUrl } from 'app/scripts/lib/util/url/parse-trello-url';
import { useGetCardQuery, GetCardQuery } from './GetCardQuery.generated';

import styles from './MirrorCard.less';

import { CoverColor, CoverPhotoModel } from 'app/gamma/src/types/models';

import { startDecayingInterval } from 'app/scripts/lib/util/decaying-interval';
import { EditCardButton, useEditCardButton } from './EditCardButton';
import { Analytics } from '@trello/atlassian-analytics';
import { EventContainer } from '@atlassiansox/analytics-web-client';

import { Badges } from './Badges';

import { CardNotFound } from './CardNotFound';

import RouterLink from 'app/src/components/RouterLink/RouterLink';

import { sortLabels } from 'app/src/components/Label';
import { Member } from 'app/src/components/CardBacks/MemberSection';
import { LabelState } from 'app/scripts/view-models/label-state';

const bgColors = {
  green: Green400,
  yellow: Yellow400,
  orange: Orange400,
  red: Red400,
  purple: Purple400,
  blue: TrelloBlue400,
  sky: Sky400,
  lime: Lime400,
  pink: Pink400,
  black: Black,
  gray: null,
  none: null,
};

type LabelColor =
  | 'black'
  | 'blue'
  | 'green'
  | 'lime'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'sky'
  | 'yellow'
  | 'gray'
  | 'none';

interface MirrorCardProps {
  cardUrl: string;
  openEditor: () => void;
  removeCardRole: () => void;
  isEditable: boolean;
  analyticsContainers?: EventContainer;
  className?: string;
  mirrorCardUrl: string;
  getCardUrl: () => string;
  isClosed: boolean;
}

interface BoardStyle {
  bgColor?: string;
  bgImage: string | null;
  headerBgColor: string | null;
}

const getBoardStyle = (
  board: NonNullable<GetCardQuery['card']>['board'],
): BoardStyle => {
  let bgColor = undefined;
  let headerBgColor = null;
  let bgImage = null;

  if (board !== null && board !== undefined) {
    if (board.prefs && board.prefs.backgroundColor) {
      bgColor = board.prefs.backgroundColor;
    }

    if (board.prefs && board.prefs.backgroundImage) {
      bgImage = board.prefs.backgroundImage;

      headerBgColor = board.prefs?.backgroundTopColor
        ? board.prefs?.backgroundTopColor
        : board.prefs.backgroundBrightness === 'dark'
        ? '#333'
        : N30;

      if (board.prefs.backgroundImageScaled) {
        const sortedPreviews = sortBy(
          board.prefs.backgroundImageScaled,
          'width',
        );
        const bigEnoughPreviews = sortedPreviews.filter(
          (p) => p.width > 248 && p.height > 158,
        );
        if (bigEnoughPreviews.length > 0) {
          bgImage = bigEnoughPreviews[0].url;
        }
      }
    }
  }

  return {
    bgColor: bgColor,
    bgImage: bgImage,
    headerBgColor: headerBgColor,
  };
};

export const MirrorCard = ({
  cardUrl,
  openEditor,
  isEditable,
  analyticsContainers,
  className,
  mirrorCardUrl,
  isClosed,
}: MirrorCardProps) => {
  const cardId = parseTrelloUrl(cardUrl).shortLink;

  const { data, loading, refetch } = useGetCardQuery({
    variables: { cardId: cardId || '' },
  });

  const safeRefetch = useCallback(() => {
    if (navigator.onLine) refetch();
  }, [refetch]);

  const {
    showEditCardButton,
    hideEditCardButton,
    shouldShowEditCardButton,
  } = useEditCardButton();

  useEffect(() => {
    if (!loading && data?.card) {
      Analytics.sendViewedComponentEvent({
        componentType: 'card',
        componentName: 'mirrorCard',
        source: 'cardView',
        containers: analyticsContainers,
        attributes: {
          linkBoardId: data.card.id,
        },
      });
    }

    if (cardId !== parseTrelloUrl(window.location.href).shortLink) {
      return startDecayingInterval(safeRefetch);
    }
  }, [
    analyticsContainers,
    cardId,
    data?.card,
    data?.card?.id,
    loading,
    safeRefetch,
  ]);

  const sortedLabels = useMemo(
    () =>
      data?.card?.labels && data?.card?.labels.length
        ? sortLabels(data?.card?.labels)
        : [],
    [data?.card?.labels],
  );

  const sortedMembers = useMemo(() => {
    const m = data?.card?.members
      ? [...data?.card?.members].sort((a, b) => {
          const aName = (
            a.nonPublic?.fullName ||
            a.fullName ||
            ''
          ).toLocaleLowerCase();
          const bName = (
            b.nonPublic?.fullName ||
            b.fullName ||
            ''
          ).toLocaleLowerCase();

          if (aName > bName) {
            return -1;
          } else if (bName > aName) {
            return 1;
          }
          return 0;
        })
      : [];
    return m;
  }, [data?.card?.members]);

  const shouldShowStickers = useMemo(() => {
    return !!data?.card?.stickers?.length;
  }, [data?.card?.stickers?.length]);

  const cardHeight = useMemo(() => {
    if (shouldShowStickers && data?.card?.cover?.size === 'full') {
      return 120;
    } else if (shouldShowStickers && data?.card?.cover?.bgColor) {
      return 64;
    } else if (data?.card?.cover?.size === 'full' || shouldShowStickers) {
      return 56;
    } else if (data?.card?.cover?.bgColor) {
      return 32;
    }
  }, [data?.card?.cover?.bgColor, data?.card?.cover?.size, shouldShowStickers]);

  if (data?.card !== null && data?.card !== undefined) {
    const card = data.card || {};
    const board = data.card.board || {};
    const colorBlind = data.member?.prefs?.colorBlind;

    return (
      <div
        className={className}
        onFocus={showEditCardButton}
        onBlur={hideEditCardButton}
        onMouseOver={showEditCardButton}
        onMouseOut={hideEditCardButton}
      >
        <Board
          className={cx('board-background', styles.mirrorCardBoard)}
          gradientLocation="bottom"
          {...getBoardStyle(board)}
        >
          <Card
            colorBlind={colorBlind}
            className={
              card.cover?.size === 'full'
                ? styles.mirrorCardFull
                : styles.mirrorCard
            }
            cover={
              ({
                ...card.cover,
                previews: card.cover?.scaled,
              } as CoverPhotoModel) || {}
            }
          >
            <CardCover
              {...card.cover}
              height={cardHeight}
              sharedSourceUrl={
                card.cover?.sharedSourceUrl as string | undefined
              }
              size={card.cover?.size || undefined}
              bgColor={bgColors[(card.cover?.bgColor as LabelColor) || 'none']}
              previews={card.cover?.scaled || undefined}
              colorBlind={colorBlind}
              pattern={
                colorBlind && card.cover?.bgColor
                  ? colorCoverColorBlindPattern[
                      card.cover?.bgColor as CoverColor
                    ]
                  : undefined
              }
            >
              {!!card.stickers?.length && (
                <CardStickers
                  className={
                    card.cover?.scaled ? styles.stickersWithImage : undefined
                  }
                >
                  {card.stickers.map((sticker) => (
                    <Sticker key={sticker.id} {...sticker} />
                  ))}
                </CardStickers>
              )}
            </CardCover>
            <CardDetails className={styles.CardDetails}>
              {!!sortedLabels.length && (
                <CardLabels className={styles.cardLabels}>
                  {sortedLabels.map((label) => (
                    <CardLabel
                      title={label.name}
                      key={label.id}
                      color={label.color as LabelColor}
                      pattern={
                        colorBlind && label.color
                          ? labelColorToColorBlindPattern[
                              label.color as LabelColor
                            ]
                          : null
                      }
                    >
                      {LabelState.getShowText()
                        ? label.name || <>&nbsp;</>
                        : undefined}
                    </CardLabel>
                  ))}
                </CardLabels>
              )}
              <CardTitle>
                <span>{card.name}</span>
              </CardTitle>
              <Badges
                checklists={card?.checklists}
                isClosed={card.closed}
                isTemplate={card.isTemplate}
                {...card?.badges}
              />
              {!!sortedMembers.length && (
                <CardMembers className={styles.mirrorCardMemberSection}>
                  {sortedMembers.map((member) => {
                    return <Member key={member.id} member={member} size={28} />;
                  })}
                </CardMembers>
              )}
            </CardDetails>
          </Card>
          <EditCardButton
            onClick={openEditor}
            shouldShow={isEditable && shouldShowEditCardButton}
          />
          <BoardName className={styles.boardTitle}>{board.name}</BoardName>
        </Board>
        {!isClosed && mirrorCardUrl && (
          <RouterLink
            href={`/c/${parseTrelloUrl(mirrorCardUrl).shortLink}`}
            className={styles.clickSurface}
            title={`/c/${parseTrelloUrl(mirrorCardUrl).shortLink}`}
          />
        )}
      </div>
    );
  } else if (loading) {
    return <PlaceholderCard className={styles.mirrorCardLoading} />;
  } else
    return (
      <div
        className={className}
        onFocus={showEditCardButton}
        onBlur={hideEditCardButton}
        onMouseOver={showEditCardButton}
        onMouseOut={hideEditCardButton}
      >
        <CardNotFound
          isEditable={isEditable}
          shouldShowEditCardButton={shouldShowEditCardButton}
          openEditor={openEditor}
        />
      </div>
    );
};
