import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useCardTemplateQuery } from './CardTemplateQuery.generated';
import { useCreateCardFromTemplateListsQuery } from './CreateCardFromTemplateListsQuery.generated';
import { useCardTemplateMemberQuery } from './CardTemplateMemberQuery.generated';
import { Spinner } from '@trello/nachos/spinner';
import { Button } from '@trello/nachos/button';
import { Select } from '@trello/nachos/select';
import { forTemplate } from '@trello/i18n';
import styles from './CreateCardFromTemplatePopover.less';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Key, getKey } from '@trello/keybindings';
import { CardContents } from 'app/gamma/src/components/canonical-components';
import { normalizeDataForCanonicalCard } from './normalizeDataForCanonicalCard';
import { useSharedState } from '@trello/shared-state';
import { showLabelsState } from 'app/src/components/Label';
import { CardTemplateTestIds } from '@trello/test-ids';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';

const format = forTemplate('card-templates');

export function useSyncedState<T>(
  sourceValue: T,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(sourceValue || initialValue);
  const [isSynced, setIsSynced] = useState(false);
  useEffect(() => {
    setValue(sourceValue);
    if (!isSynced && sourceValue !== initialValue) {
      setIsSynced(true);
    }
  }, [initialValue, isSynced, sourceValue]);

  return [value, setValue, isSynced];
}

export type KeepFromSourceTypes =
  | 'checklists'
  | 'attachments'
  | 'stickers'
  | 'members'
  | 'labels';

interface CreateCardFromTemplateProps {
  idCard: string;
  showLists?: boolean;
  hideEditButton?: boolean;
  createCard: (
    name: string,
    idCardSource: string,
    keepFromSource: KeepFromSourceTypes[],
    idList?: string,
  ) => Promise<void>;
  editTemplate?: (idCard: string) => void;
}

interface KeepFromSourceCheckboxProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  id: string;
  labelKey: string;
  count: number;
  disabled: boolean;
}

export const KeepFromSourceCheckbox: React.FunctionComponent<KeepFromSourceCheckboxProps> = ({
  checked,
  setChecked,
  id,
  labelKey,
  count,
  disabled,
}) => {
  return (
    <div className="check-div u-clearfix">
      <input
        disabled={disabled}
        type="checkbox"
        id={id}
        aria-checked={checked}
        checked={checked}
        onChange={useCallback((e) => setChecked(e.target.checked), [
          setChecked,
        ])}
      />
      <label htmlFor={id}>
        {format(labelKey, {
          count: count,
        })}
      </label>
    </div>
  );
};

interface AutofocusTextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  loaded: boolean;
}

const AutofocusTextarea: React.FunctionComponent<AutofocusTextareaProps> = ({
  loaded,
  ...props
}) => {
  const textareaElement = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaElement.current) {
      textareaElement.current.focus();
      textareaElement.current.select();
    }
  }, [loaded]);

  return (
    <textarea
      className={styles.templateCardEditTitle}
      ref={textareaElement}
      {...props}
    />
  );
};

export const CreateCardFromTemplatePopover: React.FunctionComponent<CreateCardFromTemplateProps> = ({
  idCard,
  createCard,
  showLists,
  hideEditButton,
  editTemplate,
}) => {
  const {
    data,
    loading: loadingCard,
    error: errorLoadingCard,
  } = useCardTemplateQuery({
    variables: {
      cardId: idCard,
    },
  });

  const cardTemplate = data && data.card ? data.card : undefined;

  const {
    data: listData,
    loading: loadingLists,
    error: errorLoadingLists,
  } = useCreateCardFromTemplateListsQuery({
    skip: !cardTemplate || loadingCard,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      boardId: (cardTemplate && cardTemplate.idBoard) || '',
    },
  });

  const {
    data: memberData,
    loading: memberLoading,
  } = useCardTemplateMemberQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (errorLoadingCard) {
      sendErrorEvent(errorLoadingCard, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.CardTemplates,
        },
      });
    }
    if (errorLoadingLists) {
      sendErrorEvent(errorLoadingLists, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.CardTemplates,
        },
      });
    }
  }, [errorLoadingCard, errorLoadingLists]);

  const [name, setName, nameIsSynced] = useSyncedState(
    cardTemplate && cardTemplate.name ? cardTemplate.name : '',
    '',
  );
  const [selectedListId, setSelectedListId] = useSyncedState(
    cardTemplate && cardTemplate.idList ? cardTemplate.idList : undefined,
    undefined,
  );
  const [keepChecklists, setKeepChecklists] = useState(true);
  const [keepAttachments, setKeepAttachments] = useState(true);
  const [keepStickers, setKeepStickers] = useState(true);
  const [keepLabels, setKeepLabels] = useState(true);
  const [keepMembers, setKeepMembers] = useState(true);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [createCardError, setCreateCardError] = useState(false);

  const lists =
    listData && listData.board && listData.board.lists
      ? listData.board.lists
      : [];
  const listOptions = lists.map((list) => ({
    label: list.name,
    value: list.id,
  }));

  const selectedListOption =
    (listOptions &&
      listOptions.find(({ value }) => {
        return value === selectedListId;
      })) ||
    listOptions[0];

  const [labelState] = useSharedState(showLabelsState);

  const onSubmit = useCallback(async () => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    const singleLineName = trimmedName.replace(/\r/g, ' ').replace(/\n/g, ' ');

    setIsCreatingCard(true);
    const keepFromSource: KeepFromSourceTypes[] = [];

    if (keepChecklists) {
      keepFromSource.push('checklists');
    }

    if (keepAttachments) {
      keepFromSource.push('attachments');
    }

    if (keepStickers) {
      keepFromSource.push('stickers');
    }

    if (keepMembers) {
      keepFromSource.push('members');
    }

    if (keepLabels) {
      keepFromSource.push('labels');
    }

    try {
      await createCard(singleLineName, idCard, keepFromSource, selectedListId);
    } catch (e) {
      sendErrorEvent(e, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.CardTemplates,
        },
      });

      setCreateCardError(true);
    }

    setIsCreatingCard(false);
  }, [
    keepChecklists,
    keepAttachments,
    keepStickers,
    keepMembers,
    keepLabels,
    createCard,
    name,
    idCard,
    selectedListId,
  ]);

  const onChangeTitle = useCallback((e) => setName(e.target.value), [setName]);
  const onKeyDownTitle = useCallback(
    (e) => {
      if (getKey(e) === Key.Enter) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit],
  );
  const onChangeList = useCallback(
    ({ value }: { value: string }) => setSelectedListId(value),
    [setSelectedListId],
  );
  const onClickEdit = useCallback(() => {
    trackUe({
      category: Noun.CARD_TEMPLATES,
      verb: Verb.OPENS,
      directObj: Noun.CARD_TEMPLATE,
      indirectObj: Noun.CREATE_CARD_FROM_TEMPLATE_MENU,
      method: 'by clicking the edit this template button',
    });
    editTemplate?.(idCard);
  }, [editTemplate, idCard]);

  if (memberLoading || loadingCard || (showLists && loadingLists)) {
    return <Spinner centered />;
  }

  if (
    errorLoadingCard ||
    !cardTemplate ||
    createCardError ||
    (showLists && errorLoadingLists)
  ) {
    return (
      <div id="createCardFromTemplateError">
        {format('something-went-wrong')}
      </div>
    );
  }

  const hasChecklists = cardTemplate.idChecklists.length > 0;
  const hasAttachments = cardTemplate.attachments.length > 0;
  const hasStickers = cardTemplate.stickers.length > 0;
  const hasLabels = cardTemplate.idLabels.length > 0;
  const hasMembers = cardTemplate.idMembers.length > 0;
  const showKeepSection =
    hasChecklists || hasAttachments || hasStickers || hasLabels || hasMembers;

  const {
    cover,
    badges,
    labels,
    members,
    stickers,
  } = normalizeDataForCanonicalCard(cardTemplate, cardTemplate.members);

  let cardCover = cover;

  // Don't render full covers for this view, this matches the quick edit view (for now).
  if (cardCover?.size === 'full') {
    cardCover.size = 'normal';
  }

  if (!keepChecklists) {
    badges.checklistItems = 0;
  }

  if (!keepAttachments) {
    badges.attachments = 0;
    badges.attachmentsByType.trello.board = 0;
    badges.attachmentsByType.trello.card = 0;

    if (cardTemplate.cover && cardTemplate.cover.idAttachment) {
      cardCover = null;
    }
  }

  const colorBlind = memberData?.member?.prefs?.colorBlind;

  return (
    <div>
      <div className={styles.templateCard}>
        <CardContents
          name={cardTemplate.name}
          cover={cardCover}
          badges={badges}
          labels={keepLabels ? labels : []}
          expandLabels={labelState.showText}
          members={keepMembers ? members : []}
          stickers={keepStickers ? stickers : []}
          colorBlind={colorBlind}
          replacements={{
            CardTitle: (
              <div className={styles.templateCardNameContainer}>
                <AutofocusTextarea
                  disabled={isCreatingCard}
                  data-test-id={CardTemplateTestIds.CardTitleTextarea}
                  name="title"
                  placeholder={cardTemplate.name || format('title')}
                  value={name}
                  loaded={nameIsSynced}
                  onChange={onChangeTitle}
                  onKeyDown={onKeyDownTitle}
                />
              </div>
            ),
          }}
        />
      </div>

      {showKeepSection && (
        <>
          <label>{format('keep')}</label>
          {hasChecklists && (
            <KeepFromSourceCheckbox
              disabled={isCreatingCard}
              id="idKeepChecklists"
              checked={keepChecklists}
              setChecked={setKeepChecklists}
              labelKey="checklists"
              count={cardTemplate.idChecklists.length}
            />
          )}
          {hasLabels && (
            <KeepFromSourceCheckbox
              disabled={isCreatingCard}
              id="idKeepLabels"
              checked={keepLabels}
              setChecked={setKeepLabels}
              labelKey="labels"
              count={cardTemplate.idLabels.length}
            />
          )}
          {hasMembers && (
            <KeepFromSourceCheckbox
              disabled={isCreatingCard}
              id="idKeepMembers"
              checked={keepMembers}
              setChecked={setKeepMembers}
              labelKey="members"
              count={cardTemplate.idMembers.length}
            />
          )}
          {hasAttachments && (
            <KeepFromSourceCheckbox
              disabled={isCreatingCard}
              id="idKeepAttachments"
              checked={keepAttachments}
              setChecked={setKeepAttachments}
              labelKey="attachments"
              count={cardTemplate.attachments.length}
            />
          )}
          {hasStickers && (
            <KeepFromSourceCheckbox
              disabled={isCreatingCard}
              id="idKeepStickers"
              checked={keepStickers}
              setChecked={setKeepStickers}
              labelKey="stickers"
              count={cardTemplate.stickers.length}
            />
          )}
        </>
      )}

      {showLists && (
        <label>
          {format('list')}
          <Select
            options={listOptions}
            value={selectedListOption}
            isDisabled={!listOptions.length}
            onChange={onChangeList}
          />
        </label>
      )}

      <Button
        className={styles.createCardButton}
        isLoading={isCreatingCard}
        isDisabled={isCreatingCard || name.trim().length === 0}
        appearance="primary"
        shouldFitContainer
        onClick={onSubmit}
        testId={CardTemplateTestIds.CreateCardFromTemplateButton}
      >
        {format('create-card')}
      </Button>
      {!hideEditButton && (
        <RouterLink
          onClick={onClickEdit}
          className={styles.editTemplateLink}
          href={`/c/${cardTemplate.shortLink}`}
        >
          <Button
            className={styles.editTemplateButton}
            isDisabled={isCreatingCard}
            appearance="default"
            shouldFitContainer
          >
            {format('edit-this-template')}
          </Button>
        </RouterLink>
      )}
    </div>
  );
};
