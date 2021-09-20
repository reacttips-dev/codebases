import React, { useState, useCallback } from 'react';
import { navigate } from 'app/scripts/controller/navigate';
import {
  KeepFromSourceTypes,
  CreateCardFromTemplatePopover,
} from './CreateCardFromTemplatePopover';
import { CardTemplatesPopover } from './CardTemplatesPopover';
import { forTemplate, forNamespace } from '@trello/i18n';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Tooltip } from '@trello/nachos/tooltip';
import { Popover, usePopover, PopoverScreen } from '@trello/nachos/popover';
import { PopoverConfirm } from 'app/src/components/PopoverConfirm';
import { useDeleteCardTemplateMutation } from './DeleteCardTemplateMutation.generated';
import styles from './CardTemplatesButton.less';
import { CardTemplateTestIds } from '@trello/test-ids/src/testIds';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';

const format = forNamespace('view title');
const listFormat = forTemplate('list');
const confirmFormat = forNamespace(['confirm', 'delete template card']);

interface CardTemplatesButtonProps {
  idList: string;
  idBoard: string;
  createCard: (
    name: string,
    idCardSource: string,
    keepFromSource: KeepFromSourceTypes[],
  ) => Promise<() => void>;
}

enum Screen {
  CardTemplates,
  CreateCardFromTemplate,
  ConfirmDelete,
}

export const CardTemplatesButton: React.FunctionComponent<CardTemplatesButtonProps> = ({
  idList,
  idBoard,
  createCard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [deletingTemplateId, setDeletingTemplateId] = useState('');
  const [deleteTemplateCard] = useDeleteCardTemplateMutation();

  const onShow = useCallback(() => {
    trackUe({
      category: Noun.CARD_TEMPLATES,
      verb: Verb.OPENS,
      directObj: Noun.CARD_TEMPLATES_MENU,
      context: {
        entry: Noun.LIST,
      },
    });
  }, []);
  const onHide = useCallback(() => {
    setIsEditing(false);
  }, []);

  const {
    toggle,
    hide,
    triggerRef,
    popoverProps,
    push,
    pop,
  } = usePopover<HTMLAnchorElement>({
    initialScreen: Screen.CardTemplates,
    onShow,
    onHide,
  });

  const onDeleteConfirm = useCallback(async () => {
    try {
      if (!deletingTemplateId) {
        return;
      }

      await deleteTemplateCard({
        variables: {
          idCard: deletingTemplateId,
        },
      });

      trackUe({
        category: Noun.CARD_TEMPLATES,
        verb: Verb.DELETES,
        directObj: Noun.CARD_TEMPLATE,
        indirectObj: Noun.CARD_TEMPLATES_MENU,
      });

      pop();
    } catch (e) {
      sendErrorEvent(e, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.CardTemplates,
        },
      });
    }
  }, [deleteTemplateCard, deletingTemplateId, pop]);

  const onCreateCardFromTemplate = useCallback(
    async (
      name: string,
      idCardSource: string,
      keepFromSource: KeepFromSourceTypes[],
    ) => {
      try {
        const fnScrollToNewCard = await createCard(
          name,
          idCardSource,
          keepFromSource,
        );
        trackUe({
          category: Noun.CARD_TEMPLATES,
          verb: Verb.COMPLETES,
          directObj: Noun.CREATE_CARD_FROM_TEMPLATE_MENU,
          context: {
            entry: Noun.LIST,
          },
        });
        hide();
        fnScrollToNewCard();
      } catch (e) {
        sendErrorEvent(e, {
          tags: {
            ownershipArea: 'trello-panorama',
            feature: Feature.CardTemplates,
          },
        });

        // `createCard` handles clean up in ListView.
      }
    },
    [createCard, hide],
  );

  const onSelect = useCallback(
    (idCardTemplate) => {
      setSelectedTemplateId(idCardTemplate);
      push(Screen.CreateCardFromTemplate);
    },
    [push],
  );

  const onTemplateCreated = useCallback(
    (card: { shortLink: string }) => {
      hide();
      navigate(`/c/${card.shortLink}`, {
        trigger: true,
      });
    },
    [hide],
  );

  const confirmDelete = useCallback(
    (templateId) => {
      setDeletingTemplateId(templateId);
      push(Screen.ConfirmDelete);
    },
    [push],
  );

  return (
    <>
      <Tooltip
        content={listFormat('create-from-template')}
        delay={100}
        hideTooltipOnMouseDown
      >
        <a
          className={styles.cardTemplateButton}
          data-test-id={CardTemplateTestIds.CardTemplateListButton}
          ref={triggerRef}
          onClick={toggle}
          role="button"
          href="#"
          aria-label={listFormat('create-from-template')}
        >
          <span className="icon-sm icon-template-card dark-background-hover" />
        </a>
      </Tooltip>
      <Popover {...popoverProps} dangerous_className={styles.popover}>
        <PopoverScreen
          id={Screen.CardTemplates}
          title={format('card templates')}
        >
          <CardTemplatesPopover
            idList={idList}
            idBoard={idBoard}
            onSelect={onSelect}
            onTemplateCreated={onTemplateCreated}
            confirmDelete={confirmDelete}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editTemplate={hide}
          />
        </PopoverScreen>
        <PopoverScreen
          id={Screen.CreateCardFromTemplate}
          title={format('create card')}
        >
          <CreateCardFromTemplatePopover
            idCard={selectedTemplateId}
            createCard={onCreateCardFromTemplate}
            editTemplate={hide}
          />
        </PopoverScreen>
        <PopoverScreen id={Screen.ConfirmDelete} title={confirmFormat('title')}>
          <PopoverConfirm
            confirmKey="delete template card"
            confirmCallback={onDeleteConfirm}
            isDanger
          />
        </PopoverScreen>
      </Popover>
    </>
  );
};
