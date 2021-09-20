import React, { useEffect, useState } from 'react';
import { forTemplate } from '@trello/i18n';
import cx from 'classnames';
import styles from './SelectCover.less';
import { ColorCover } from './ColorCover';
import { Spinner } from '@trello/nachos/spinner';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
  Preview,
} from '@trello/image-previews';
import { useSelectCoverQuery } from './SelectCoverQuery.generated';
import { useUpdateCardCoverMutation } from './UpdateCardCoverMutation.generated';
import { useSearchUnsplashQuery } from './SearchUnsplashQuery.generated';
import { Analytics } from '@trello/atlassian-analytics';
import { SelectSize } from './SelectSize';
import { SelectTextColor } from './SelectTextColor';
import { SelectAttachmentCover } from './SelectAttachmentCover';
import { SelectUnsplashCover } from './SelectUnsplashCover';
import { Cover } from './types';
import { CardCoversSetting } from './CardCoversSetting';
import { SelectPluginCover } from './SelectPluginCover';
import { useSelectPluginCoverQuery } from './SelectPluginCoverQuery.generated';

const format = forTemplate('card_cover_chooser');

enum CoverType {
  Attachment = 'attachment',
  Unsplash = 'unsplash',
}

export interface PotentialCover {
  id: string;
  type: CoverType;
  thumbnailUrl: string;
  edgeColor: string;
  selected: boolean;
}

/**
 * Given all of a card's attachments, getPotentialCovers will return
 * info about the attachments that are valid to set as Card Covers.
 *
 * @param attachments The attachments field on a Card model
 * @returns A list of potential covers for this card
 */
export const getPotentialCovers = (
  attachments: {
    id: string;
    edgeColor?: string | null;
    previews?: Preview[] | null;
  }[] = [],
  idAttachmentCover: string | null,
) => {
  const potentialCovers: PotentialCover[] = [];

  for (const attachment of attachments) {
    const preview =
      smallestPreviewBiggerThan(attachment.previews, 256) ||
      biggestPreview(attachment.previews);

    if (!preview || !preview.url) {
      continue;
    }

    potentialCovers.unshift({
      id: attachment.id,
      type: CoverType.Attachment,
      edgeColor: attachment.edgeColor || 'transparent',
      thumbnailUrl: preview.url,
      selected: idAttachmentCover === attachment.id,
    });
  }

  return potentialCovers;
};

interface SelectCoverProps {
  navigateToAddCover: () => void;
  cardId: string;
  boardId: string;
}

export const SelectCover: React.FunctionComponent<SelectCoverProps> = ({
  navigateToAddCover,
  cardId,
  boardId,
}) => {
  const { data, error, loading: loadingSelectCoverQuery } = useSelectCoverQuery(
    {
      variables: { cardId },
      fetchPolicy: 'cache-and-network', // TODO: Remove when ModelCache syncing is ready
      nextFetchPolicy: 'cache-first',
    },
  );
  const {
    error: pluginCoverQueryError,
    loading: loadingPluginCover,
  } = useSelectPluginCoverQuery({
    variables: { boardId },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const [updateCardCover] = useUpdateCardCoverMutation();
  const [
    lastUploadedBackgroundCover,
    setLastUploadedBackgroundCover,
  ] = useState<Cover>();

  const [hasSentScreenEvent, setHasSentScreenEvent] = useState(false);

  const { loading: loadingTopUnsplashPhotos } = useSearchUnsplashQuery({
    variables: {
      query: '',
      perPage: 9,
      page: 1,
    },
  });

  const loading =
    loadingSelectCoverQuery || loadingTopUnsplashPhotos || loadingPluginCover;

  const card = data?.card;
  const board = card?.board;
  const me = data?.member;
  const cardCoversEnabled = Boolean(board?.prefs?.cardCovers ?? true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const containers = {
    organization: {
      id: card?.board.idOrganization,
    },
    board: {
      id: card?.board.id,
    },
    card: {
      id: card?.id,
    },
  };

  const setCover = async (
    cover: {
      idAttachment?: string;
      idUploadedBackground?: string;
    } | null,
  ) => {
    let previousCoverType;
    const currentCover = card?.cover;

    if (currentCover) {
      if (currentCover.color) {
        previousCoverType = 'color';
      } else if (currentCover.idUploadedBackground) {
        previousCoverType = 'unsplash';
      } else if (currentCover.idAttachment) {
        previousCoverType = 'attachment';
      } else if (currentCover.idPlugin) {
        previousCoverType = 'plugin';
      }
    }

    const taskName =
      previousCoverType === 'attachment'
        ? 'edit-card/idAttachmentCover'
        : 'edit-card/cover';

    const traceId = Analytics.startTask({
      taskName,
      source: 'cardCoverInlineDialog',
    });

    try {
      await updateCardCover({
        variables: {
          traceId,
          cardId,
          cover,
        },
      });

      if (cover) {
        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'cover',
          source: 'cardCoverInlineDialog',
          attributes: {
            type: cover.idAttachment ? 'attachment' : 'unsplash',
            value: cover.idAttachment || cover.idUploadedBackground,
            taskId: traceId,
          },
          containers,
        });
      } else {
        Analytics.sendTrackEvent({
          action: 'removed',
          actionSubject: 'cover',
          source: 'cardCoverInlineDialog',
          attributes: {
            type: previousCoverType,
            taskId: traceId,
          },
          containers,
        });
      }

      Analytics.taskSucceeded({
        taskName,
        traceId,
        source: 'cardCoverInlineDialog',
      });
    } catch (error) {
      throw Analytics.taskFailed({
        taskName,
        traceId,
        source: 'cardCoverInlineDialog',
        error,
      });
    }
  };

  useEffect(() => {
    if (card && !hasSentScreenEvent) {
      Analytics.sendScreenEvent({
        name: 'cardCoverInlineDialog',
        containers,
      });

      setHasSentScreenEvent(true);
    }
  }, [card, containers, hasSentScreenEvent]);

  const idAttachmentCover =
    card && card.idAttachmentCover ? card.idAttachmentCover : null;
  const cover = card ? card.cover : null;
  const potentialCovers =
    card && card.attachments
      ? getPotentialCovers(card.attachments, idAttachmentCover)
      : [];

  useEffect(() => {
    if (cover && cover.idUploadedBackground) {
      setLastUploadedBackgroundCover(cover);
    }
  }, [cover]);

  if (!cardCoversEnabled && me && board) {
    const userIsBoardAdmin = (): boolean => {
      return (
        board.memberships?.some((membership) => {
          return (
            membership.idMember === me.id && membership.memberType === 'admin'
          );
        }) ?? false
      );
    };

    const userIsOrgAdminForBoard = (): boolean => {
      if (board.idOrganization && me) {
        return (
          me.organizations
            ?.find((org) => org.id === board.idOrganization)
            ?.memberships.some(
              (membership) =>
                membership.idMember === me.id &&
                membership.memberType === 'admin',
            ) ?? false
        );
      } else {
        return false;
      }
    };

    const userIsEnterpriseAdminForBoard = (): boolean => {
      if (board.idEnterprise && me.enterprises) {
        return (
          me.enterprises
            ?.find((ent) => ent.id === board.idEnterprise)
            ?.idAdmins?.some((adminId) => adminId === me.id) ?? false
        );
      } else {
        return false;
      }
    };

    const isAdmin =
      userIsBoardAdmin() ||
      userIsOrgAdminForBoard() ||
      userIsEnterpriseAdminForBoard();

    return <CardCoversSetting idBoard={board.id} isAdmin={isAdmin} />;
  }

  const usingUnsplashCover = Boolean(
    cover && cover.idUploadedBackground && cover.scaled,
  );
  const unsplashCover = usingUnsplashCover
    ? cover
    : lastUploadedBackgroundCover;

  if (
    unsplashCover &&
    unsplashCover.idUploadedBackground &&
    unsplashCover.scaled
  ) {
    const preview =
      smallestPreviewBiggerThan(unsplashCover.scaled, 256) ||
      biggestPreview(unsplashCover.scaled);

    if (preview && preview.url) {
      potentialCovers.unshift({
        id: unsplashCover.idUploadedBackground,
        edgeColor: unsplashCover.edgeColor || 'transparent',
        thumbnailUrl: preview.url,
        selected: usingUnsplashCover,
        type: CoverType.Unsplash,
      });
    }
  }

  const isCoverSelected =
    potentialCovers.some((potentialCover) => potentialCover.selected) ||
    Boolean(cover?.color) ||
    Boolean(cover?.idPlugin);

  const showSelectTextColor =
    !loading &&
    !error &&
    cover?.size === 'full' &&
    (cover?.idAttachment || cover?.idUploadedBackground || cover?.idPlugin);

  if (loading) {
    return (
      <div>
        <Spinner centered />
      </div>
    );
  }

  if (error || pluginCoverQueryError) {
    return <div>{format('something-went-wrong')}</div>;
  }

  return (
    <div>
      <SelectSize cardId={cardId} cover={cover} />
      {isCoverSelected && (
        <button
          className={cx('button', styles.remove, styles.colorAndFullVersion)}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            setCover(null);
            Analytics.sendClickedButtonEvent({
              buttonName: 'removeCardCoverButton',
              source: 'cardCoverInlineDialog',
              containers,
            });
          }}
        >
          {format('remove-cover')}
        </button>
      )}
      {showSelectTextColor && (
        <SelectTextColor cardId={cardId} cardName={card?.name} cover={cover} />
      )}
      {!cover?.idPlugin && (
        <>
          <ColorCover cardId={cardId} />
          <SelectAttachmentCover cardId={cardId} />
          <SelectUnsplashCover
            cardId={cardId}
            navigateToAddCover={navigateToAddCover}
          />
          <SelectPluginCover cardId={cardId} boardId={boardId} />
        </>
      )}
    </div>
  );
};
