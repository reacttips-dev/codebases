import React, { useEffect, useCallback, useMemo } from 'react';
import { defaultRouter } from 'app/src/router';
import { parseTrelloUrl } from 'app/scripts/lib/util/url/parse-trello-url';
import { CardBackHeader } from 'app/src/components/CardBacks/CardBackHeader';
import { LabelSection } from 'app/src/components/CardBacks/LabelSection';
import { CardCover } from 'app/src/components/CardBacks/CardCover';
import { useMirrorCardQuery } from './MirrorCardQuery.generated';
import { ButtonLink } from '@trello/nachos/button';
import { useMemberQuery } from './MemberQuery.generated';
import { forNamespace, forTemplate } from '@trello/i18n';
import { DescriptionSection } from 'app/src/components/CardBacks/DescriptionSection';
import { DueDateSection } from 'app/src/components/CardBacks/DueDateSection';
import { MemberSection } from 'app/src/components/CardBacks/MemberSection';
import { AttachmentSection } from 'app/src/components/CardBacks/AttachmentSection';
import { ChecklistSection } from 'app/src/components/CardBacks/ChecklistSection';
import { Sidebar } from './Sidebar';
import { CustomFieldSection } from 'app/src/components/CardBacks/AttachmentSection/CustomFieldSection';

import {
  useDialog,
  Dialog,
  DialogCloseButton,
} from 'app/src/components/Dialog';

import styles from './MirrorCard.less';
import { setDocumentTitle } from 'app/src/components/DocumentTitle';

const format = forTemplate('card_detail');
const localize = forNamespace('', { shouldEscapeStrings: false });

interface MirrorCardBannerProps {
  isArchived: boolean;
  cardUrl: string;
  onClose: () => void;
}

const MirrorCardBanner = ({
  isArchived,
  cardUrl,
  onClose,
}: MirrorCardBannerProps) => (
  <div className={styles.banner}>
    <span className={styles.bannerText}>
      {isArchived
        ? format('mirror-card-banner-archived')
        : format('mirror-card-banner')}
    </span>
    <div className={styles.bannerButtons}>
      <ButtonLink
        isPrimary
        className={styles.viewOriginalCardButton}
        link={cardUrl}
      >
        {format('mirror-card-view-original-button')}
      </ButtonLink>
      <DialogCloseButton
        onClick={onClose}
        className={styles.closeButton}
        size="medium"
      />
    </div>
  </div>
);

interface MirrorCardProps {
  idBoard: string;
  idMirrorCard: string;
  boardName: string;
  cardUrl: string;
  onClose: () => void;
}

export const MirrorCard = ({
  cardUrl,
  idBoard,
  idMirrorCard,
  boardName,
  onClose,
}: MirrorCardProps) => {
  // We are confident that this is not undefined since before rendering
  // a mirror card in app/scripts/controller/display-board.js, we are
  // already on a valid card route
  const idCard = parseTrelloUrl(cardUrl).shortLink!;

  const { show, hide, dialogProps } = useDialog();

  const { data: cardData, loading: loadingCard } = useMirrorCardQuery({
    variables: {
      idCard,
    },
  });

  const { data: memberData, loading: loadingMember } = useMemberQuery();

  useEffect(() => {
    if (!loadingCard && cardData?.card) {
      show();
      const cardName = cardData.card.name;

      setDocumentTitle(
        localize('card detail title', {
          cardName,
          boardName,
        }),
      );
    }
    return () => {
      hide();
    };
  }, [show, loadingCard, cardData, hide, boardName]);

  const closeCardBack = useCallback(() => {
    hide();
    defaultRouter.setRoute(`/b/${idBoard}`);
    onClose();
  }, [hide, idBoard, onClose]);

  const shouldDisplayCustomFields = useMemo(() => {
    return (
      cardData?.card &&
      (cardData.card.customFieldItems.length > 0 ||
        cardData.card.customFields.some((customField) => {
          customField.type === 'checkbox';
        }))
    );
  }, [cardData?.card]);

  if (loadingCard || loadingMember) return null;
  if (!cardData?.card || !memberData?.member) return null;

  const isColorblindModeEnabled = memberData.member.prefs?.colorBlind || false;

  return (
    <Dialog
      className={styles.mirrorCardBack}
      size="large"
      {...dialogProps}
      hide={closeCardBack /* This must come after {...dialogProps} */}
    >
      <MirrorCardBanner
        isArchived={cardData.card.closed}
        cardUrl={cardUrl}
        onClose={closeCardBack}
      />
      <CardCover
        attachments={cardData.card.attachments}
        colorblind={isColorblindModeEnabled}
        cover={cardData.card.cover}
        idAttachmentCover={cardData.card.idAttachmentCover}
        stickers={cardData.card.stickers}
        areCardCoversEnabled={cardData.card.board.prefs?.cardCovers || false}
      />
      <CardBackHeader
        boardName={cardData.card.board.name}
        boardShortLink={cardData.card.board.shortLink}
        cardName={cardData.card.name}
        listName={cardData.card.list.name}
        closeCardBack={closeCardBack}
        subscribed={cardData.card.subscribed}
      />
      <div className={styles.mainContent}>
        <div className={styles.mainColumn}>
          {cardData.card.members.length > 0 && (
            <MemberSection members={cardData.card.members} />
          )}
          {cardData.card.labels.length > 0 && (
            <LabelSection
              labels={cardData.card.labels}
              colorblind={memberData.member.prefs?.colorBlind || false}
            />
          )}
          {(cardData.card.due || cardData.card.start) && (
            <DueDateSection
              startDate={cardData.card.start}
              dueDate={cardData.card.due}
              isComplete={cardData.card.dueComplete}
            />
          )}
          {cardData.card.desc.length > 0 && (
            <DescriptionSection
              description={cardData.card.desc}
              descriptionData={cardData.card.descData}
            />
          )}
          {shouldDisplayCustomFields && (
            <CustomFieldSection
              customFields={cardData.card.customFields}
              customFieldItems={cardData.card.customFieldItems}
              colorblind={isColorblindModeEnabled}
            />
          )}
          {cardData.card.attachments.length > 0 && (
            <AttachmentSection attachments={cardData.card.attachments} />
          )}
          {cardData.card.checklists.map((checklist) => (
            <ChecklistSection key={checklist.id} checklist={checklist} />
          ))}
        </div>
        <div className={styles.sidebarColumn}>
          <Sidebar idCard={idMirrorCard} closeCardBack={closeCardBack} />
        </div>
      </div>
    </Dialog>
  );
};
