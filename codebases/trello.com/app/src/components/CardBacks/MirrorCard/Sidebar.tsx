/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { useArchiveCardMutation } from 'app/src/components/CardBacks/Actions/ArchiveCardMutation.generated';
import { useUnarchiveCardMutation } from 'app/src/components/CardBacks/Actions/UnarchiveCardMutation.generated';
import { useDeleteCardMutation } from 'app/src/components/CardBacks/Actions/DeleteCardMutation.generated';
import { useSidebarQuery } from './SidebarQuery.generated';
import { Spinner } from '@trello/nachos/spinner';
import { ArchiveIcon } from '@trello/nachos/icons/archive';
import { LeaveBoardIcon } from '@trello/nachos/icons/leave-board';
import { RefreshIcon } from '@trello/nachos/icons/refresh';
import { RemoveIcon } from '@trello/nachos/icons/remove';
import { Popover, usePopover } from '@trello/nachos/popover';
import { useChangeCardRoleMutation } from 'app/src/components/QuickCardEditor/ChangeCardRoleMutation.generated';

import styles from './Sidebar.less';

const format = forTemplate('card_detail');
const formatDeletePopover = forNamespace(['confirm', 'delete card']);

interface SidebarProps {
  idCard: string;
  closeCardBack: () => void;
}

export const Sidebar = ({ idCard, closeCardBack }: SidebarProps) => {
  const { data, loading } = useSidebarQuery({
    variables: { idCard },
  });

  if (loading || !data?.card) {
    return <Spinner centered />;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>{format('actions')}</div>
      <ConvertToRegularCardButton
        closeCardBack={closeCardBack}
        idCard={idCard}
      />
      {data.card.closed && (
        <>
          <UnarchiveButton idCard={idCard} />
          <DeleteButton idCard={idCard} closeCardBack={closeCardBack} />
        </>
      )}
      {!data.card.closed && <ArchiveButton idCard={idCard} />}
    </div>
  );
};

const ConvertToRegularCardButton = ({
  idCard,
  closeCardBack,
}: SidebarProps) => {
  const [hasBeenConverted, setHasBeenConverted] = useState(false);

  const [convertToRegularCard] = useChangeCardRoleMutation({
    variables: { idCard, cardRole: null },
    onCompleted() {
      closeCardBack();
    },
  });

  const onClick = useCallback(() => {
    convertToRegularCard();
    setHasBeenConverted(true);
  }, [convertToRegularCard, setHasBeenConverted]);

  return (
    <Button
      onClick={onClick}
      shouldFitContainer
      iconBefore={hasBeenConverted ? undefined : <LeaveBoardIcon />}
      className={classNames(styles.button, hasBeenConverted && styles.loading)}
      isDisabled={hasBeenConverted}
    >
      {hasBeenConverted ? <Spinner small centered /> : format('convert')}
    </Button>
  );
};

const ArchiveButton = ({ idCard }: { idCard: string }) => {
  const [archiveCard] = useArchiveCardMutation({
    variables: { idCard },
    optimisticResponse: {
      __typename: 'Mutation',
      archiveCard: {
        id: idCard,
        closed: true,
        __typename: 'Card',
      },
    },
  });

  const onClick = useCallback(() => archiveCard(), [archiveCard]);

  return (
    <Button
      onClick={onClick}
      shouldFitContainer
      iconBefore={<ArchiveIcon />}
      className={styles.button}
    >
      {format('archive')}
    </Button>
  );
};

const UnarchiveButton = ({ idCard }: Pick<SidebarProps, 'idCard'>) => {
  const [unarchiveCard] = useUnarchiveCardMutation({
    variables: { idCard },
    optimisticResponse: {
      __typename: 'Mutation',
      unarchiveCard: {
        id: idCard,
        closed: false,
        __typename: 'Card',
      },
    },
  });

  const onClick = useCallback(() => unarchiveCard(), [unarchiveCard]);

  return (
    <Button
      onClick={onClick}
      shouldFitContainer
      iconBefore={<RefreshIcon />}
      className={styles.button}
    >
      {format('send-to-board')}
    </Button>
  );
};

const DeleteButton = ({
  idCard,
  closeCardBack,
}: Pick<SidebarProps, 'idCard' | 'closeCardBack'>) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  const [deleteCard] = useDeleteCardMutation({
    variables: { idCard },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteCard: {
        success: true,
        __typename: 'Card_DeleteResponse',
      },
    },
  });

  const onClick = useCallback(() => {
    deleteCard();
    closeCardBack();
  }, [deleteCard, closeCardBack]);

  return (
    <>
      <Button
        onClick={toggle}
        shouldFitContainer
        iconBefore={<RemoveIcon />}
        className={styles.button}
        appearance="danger"
        ref={triggerRef}
      >
        {format('delete')}
      </Button>
      <Popover {...popoverProps} title={formatDeletePopover('title')}>
        <p>{formatDeletePopover('text')}</p>

        <Button
          className={styles.popoverButton}
          onClick={onClick}
          shouldFitContainer
          appearance="danger"
        >
          {formatDeletePopover('confirm')}
        </Button>
      </Popover>
    </>
  );
};
