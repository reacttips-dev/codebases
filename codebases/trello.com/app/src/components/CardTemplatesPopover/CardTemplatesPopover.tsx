import React, { useCallback } from 'react';
import {
  CardTemplatesQuery,
  useCardTemplatesQuery,
} from './CardTemplatesQuery.generated';
import { useCardTemplateMemberQuery } from './CardTemplateMemberQuery.generated';
import { Spinner } from '@trello/nachos/spinner';
import { Button } from '@trello/nachos/button';
import { Tooltip } from '@trello/nachos/tooltip';
import { CardContents } from 'app/gamma/src/components/canonical-components';
import {
  CardLink,
  LinkComponentProps,
} from '@atlassian/trello-canonical-components/src/card-front/Card';
import { normalizeDataForCanonicalCard } from './normalizeDataForCanonicalCard';
import { forTemplate } from '@trello/i18n';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { TemplateCardComposer } from './TemplateCardComposer';
import { useShortcut, Scope, Key } from '@trello/keybindings';
import styles from './CardTemplatesPopover.less';
import { EditIcon } from '@trello/nachos/icons/edit';
import { TrashIcon } from '@trello/nachos/icons/trash';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { useSharedState } from '@trello/shared-state';
import { showLabelsState } from 'app/src/components/Label';
import { CardTemplateTestIds } from '@trello/test-ids';

const format = forTemplate('card-templates');

interface CardTemplatesPopoverProps {
  idBoard: string;
  idList: string;
  onSelect: (idCard: string) => void;
  onTemplateCreated: (card: { id: string; shortLink: string }) => void;
  confirmDelete: (idCard: string) => void;
  editTemplate?: (idCard: string) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}

const CardLinkComponent: React.FunctionComponent<LinkComponentProps> = ({
  onClick,
  ...props
}) => {
  return (
    <a
      {...props}
      href="#"
      role="button"
      onClick={useCallback(
        (e) => {
          e.preventDefault();
          if (onClick) {
            onClick(e);
          }
        },
        [onClick],
      )}
    />
  );
};

const closedComponent = (onClick: () => void) => {
  return (
    <div>
      <p className={styles.emptyStateMessage}>
        {format('you-dont-have-any-templates')}
      </p>
      <Button
        onClick={onClick}
        className={styles.createNewTemplateButton}
        appearance="primary"
        shouldFitContainer
        testId={CardTemplateTestIds.CreateNewTemplateCardButton}
      >
        {format('create-a-new-template')}
      </Button>
    </div>
  );
};

function CardTemplateRow({
  card,
  boardMembers,
  colorBlind,
  isEditing,
  onSelect,
  editTemplate,
  confirmDelete,
}: {
  card: NonNullable<CardTemplatesQuery['board']>['cards'][0];
  boardMembers: NonNullable<CardTemplatesQuery['board']>['members'];
  colorBlind?: boolean;
} & Pick<
  CardTemplatesPopoverProps,
  'isEditing' | 'onSelect' | 'editTemplate' | 'confirmDelete'
>) {
  const {
    cover,
    badges,
    labels,
    members,
    stickers,
  } = normalizeDataForCanonicalCard(card, boardMembers);

  const [labelState] = useSharedState(showLabelsState);

  const onClickCardLink = useCallback(() => onSelect(card.id), [
    card.id,
    onSelect,
  ]);

  const onClickEdit = useCallback(() => {
    trackUe({
      category: Noun.CARD_TEMPLATES,
      verb: Verb.OPENS,
      directObj: Noun.CARD_TEMPLATE,
      indirectObj: Noun.CARD_TEMPLATES_MENU,
      method: 'by clicking the edit this template button',
    });
    editTemplate?.(card.id);
  }, [card.id, editTemplate]);

  const onClickDelete = useCallback(() => confirmDelete(card.id), [
    card.id,
    confirmDelete,
  ]);

  return (
    <div className={styles.templateCardContainer}>
      <CardLink
        className={styles.templateCard}
        onClick={onClickCardLink}
        cover={cover}
        colorBlind={colorBlind}
        hasStickers={!!stickers.length}
        linkComponent={CardLinkComponent}
      >
        <CardContents
          name={card.name}
          cover={cover}
          badges={badges}
          isTemplate={card.isTemplate}
          labels={labels}
          expandLabels={labelState.showText}
          members={members}
          stickers={stickers}
          colorBlind={colorBlind}
        />
      </CardLink>
      {isEditing && (
        <div className={styles.controlButtons}>
          <Tooltip content={format('edit-this-template')}>
            <RouterLink
              className={styles.noTextDecoration}
              onClick={onClickEdit}
              href={`/c/${card.shortLink}`}
            >
              <Button
                tabIndex={-1}
                iconBefore={<EditIcon color="gray" size="small" />}
                className={styles.controlButton}
              />
            </RouterLink>
          </Tooltip>
          <Tooltip content={format('delete-this-template')}>
            <Button
              iconBefore={<TrashIcon color="gray" size="small" />}
              onClick={onClickDelete}
              className={styles.controlButton}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export const CardTemplatesPopover: React.FunctionComponent<CardTemplatesPopoverProps> = ({
  idBoard,
  idList,
  onSelect,
  onTemplateCreated,
  confirmDelete,
  editTemplate,
  isEditing,
  setIsEditing,
}) => {
  useShortcut(
    () => {
      setIsEditing(false);
    },
    {
      scope: Scope.Popover,
      key: Key.Escape,
      enabled: isEditing,
    },
  );

  const { data, loading, error } = useCardTemplatesQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      boardId: idBoard,
    },
  });

  const {
    data: memberData,
    loading: memberLoading,
  } = useCardTemplateMemberQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const cards = data && data.board && data.board.cards ? data.board.cards : [];
  const templateCards = cards
    .filter((card) => card && card.isTemplate)
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        caseFirst: 'upper',
      }),
    );

  const boardMembers =
    data && data.board && data.board.members ? data.board.members : [];

  const onClickFinish = useCallback(() => setIsEditing(false), [setIsEditing]);
  const onClickEdit = useCallback(() => setIsEditing(true), [setIsEditing]);

  if (error) {
    return <div id="cardTemplatesError">{format('something-went-wrong')}</div>;
  }

  const isLoading = loading || memberLoading;

  if (!data && isLoading) {
    return <Spinner centered />;
  }

  if (templateCards.length === 0) {
    return (
      <TemplateCardComposer
        idList={idList}
        idBoard={idBoard}
        onCreate={onTemplateCreated}
        closedComponent={closedComponent}
      />
    );
  }

  const colorBlind = memberData?.member?.prefs?.colorBlind;

  return (
    <>
      <div className={styles.templateCards}>
        {templateCards.map((card) => (
          <CardTemplateRow
            key={card.id}
            card={card}
            boardMembers={boardMembers}
            colorBlind={colorBlind}
            onSelect={onSelect}
            confirmDelete={confirmDelete}
            isEditing={isEditing}
            editTemplate={editTemplate}
          />
        ))}
      </div>
      <TemplateCardComposer
        idList={idList}
        idBoard={idBoard}
        onCreate={onTemplateCreated}
      />
      {isEditing ? (
        <Button
          className={styles.finishEditingButton}
          onClick={onClickFinish}
          shouldFitContainer
        >
          {format('finish-editing')}
        </Button>
      ) : (
        <Button
          className={styles.editTemplatesButton}
          onClick={onClickEdit}
          shouldFitContainer
        >
          {format('edit-templates')}
        </Button>
      )}
    </>
  );
};
