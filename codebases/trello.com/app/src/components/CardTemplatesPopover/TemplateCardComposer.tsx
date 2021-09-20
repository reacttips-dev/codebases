import React, { useState, ReactElement, useCallback } from 'react';
import { useCreateCardTemplateMutation } from './CreateCardTemplateMutation.generated';
import { CardTemplatesQuery } from './CardTemplatesQuery.generated';
import { Button } from '@trello/nachos/button';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Analytics } from '@trello/atlassian-analytics';
import { AddIcon } from '@trello/nachos/icons/add';
import { CloseIcon } from '@trello/nachos/icons/close';
import { useShortcut, Scope, Key, getKey } from '@trello/keybindings';
import { forTemplate } from '@trello/i18n';
import cx from 'classnames';

import query from './CardTemplatesQuery.graphql';

import styles from './TemplateCardComposer.less';
import { CardTemplateTestIds } from '@trello/test-ids';
import { Feature } from 'app/scripts/debug/constants';
import { sendErrorEvent } from '@trello/error-reporting';

const format = forTemplate('card-templates');
const composerFormat = forTemplate('card_composer_inline');

interface TemplateCardComposerProps {
  idList: string;
  idBoard: string;
  closedComponent?: (onClick: () => void) => ReactElement;
  onCreate?: (card: { id: string; shortLink: string }) => void;
}

export const TemplateCardComposer: React.FunctionComponent<TemplateCardComposerProps> = ({
  idList,
  idBoard,
  closedComponent,
  onCreate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const [
    createNewTemplate,
    { loading: creating },
  ] = useCreateCardTemplateMutation();

  useShortcut(
    () => {
      setIsOpen(false);
    },
    {
      scope: Scope.Popover,
      key: Key.Escape,
      enabled: isOpen,
    },
  );

  const create = useCallback(
    (traceId: string) => {
      return createNewTemplate({
        variables: {
          traceId,
          listId: idList,
          name: name.trim(),
          closed: false,
        },
        update(cache, { data }) {
          const newCard = data && data.createCardTemplate;
          if (!newCard) {
            return;
          }

          const current: CardTemplatesQuery | null = cache.readQuery({
            query: query,
            variables: { boardId: idBoard },
          });
          if (!current) {
            return;
          }

          const board = current.board;
          const cards = board && board.cards;

          if (!cards) {
            return;
          }

          cache.writeQuery({
            query: query,
            variables: {
              boardId: idBoard,
            },
            data: {
              board: {
                ...board,
                cards: cards.concat(newCard),
              },
            },
          });
        },
      });
    },
    [createNewTemplate, idBoard, idList, name],
  );

  const clear = useCallback(() => {
    setName('');
    setIsOpen(false);
  }, []);

  const onSubmit = useCallback(async () => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'create-card/template',
      source: 'createCardTemplateInlineDialog',
    });

    try {
      const { data } = await create(traceId);

      trackUe({
        category: Noun.CARD_TEMPLATES,
        verb: Verb.CREATES,
        directObj: Noun.CARD_TEMPLATE,
        indirectObj: Noun.CARD_TEMPLATES_MENU,
        method: 'by clicking the create new template button',
      });

      clear();

      if (onCreate && data && data.createCardTemplate) {
        const card = data.createCardTemplate;
        onCreate(card);
      }

      Analytics.taskSucceeded({
        taskName: 'create-card/template',
        traceId,
        source: 'createCardTemplateInlineDialog',
      });
    } catch (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-panorama',
          feature: Feature.CardTemplates,
        },
      });

      throw Analytics.taskFailed({
        taskName: 'create-card/template',
        traceId,
        source: 'createCardTemplateInlineDialog',
        error,
      });
    }
  }, [clear, create, name, onCreate]);

  const onClickCreate = useCallback((e) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);

  const onBlurTitle = useCallback(() => {
    if (name.length === 0) {
      clear();
    }
  }, [clear, name.length]);

  const onKeyDownTitle = useCallback(
    (e) => {
      if (getKey(e) === Key.Enter) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit],
  );

  const onChangeTitle = useCallback((e) => setName(e.target.value), []);

  if (!isOpen) {
    if (!closedComponent) {
      return (
        <a
          role="button"
          className={styles.openTemplateCardComposer}
          href="#"
          onClick={onClickCreate}
        >
          <AddIcon dangerous_className={styles.iconAdd} size="small" />
          <span>{format('create-a-new-template')}</span>
        </a>
      );
    }

    return closedComponent(() => setIsOpen(true));
  }

  return (
    <>
      <div className={styles.listCard}>
        <div className={cx(styles.listCardDetails, 'u-clearfix')}>
          <textarea
            value={name}
            className={styles.templateCardComposerTextarea}
            dir="auto"
            placeholder={format('template-title')}
            autoFocus={true}
            onBlur={onBlurTitle}
            onKeyDown={onKeyDownTitle}
            onChange={onChangeTitle}
            data-test-id={CardTemplateTestIds.CreateTemplateCardComposer}
          />
        </div>
      </div>
      <div className={styles.listCardButtons}>
        <Button
          onClick={onSubmit}
          className={styles.addButton}
          appearance="primary"
          isDisabled={creating}
          isLoading={creating}
          testId={CardTemplateTestIds.NewTemplateCardSubmitButton}
        >
          {composerFormat('add')}
        </Button>

        <a role="button" className={styles.closeButton} onClick={clear}>
          <CloseIcon
            dangerous_className={styles.closeIcon}
            color="quiet"
            size="large"
          />
        </a>
      </div>
    </>
  );
};
