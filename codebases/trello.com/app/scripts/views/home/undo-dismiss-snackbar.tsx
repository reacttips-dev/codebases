import React, { useEffect, useState } from 'react';
import ModelCacheListener from 'app/scripts/views/internal/model-cache-listener';
import { Snackbar } from './presentational/snackbar';
import { forTemplate } from '@trello/i18n';
import { SidebarState } from 'app/scripts/view-models/sidebar-state';

const formatHome = forTemplate('home');

interface UndoDismissSnackbarProps {
  idDismiss: string;
  shouldShow: boolean;
  boardName: string;
  cardUrl: string;
  close: () => void;
  undo: (isDismiss: string) => void;
  modelListener: (
    observableObj: object,
    event: 'change',
    callback: () => void,
  ) => void;
}

// eslint-disable-next-line @trello/no-module-logic
export const UndoDismissSnackbar = ModelCacheListener(
  ({
    idDismiss,
    shouldShow,
    boardName,
    cardUrl,
    close,
    undo,
    modelListener,
  }: UndoDismissSnackbarProps) => {
    const [isBoardsMenuPinned, setIsBoardsMenuPinned] = useState(
      SidebarState.getPinSidebar(),
    );

    useEffect(() => {
      modelListener(SidebarState, 'change', () =>
        setIsBoardsMenuPinned(SidebarState.getPinSidebar()),
      );
    });

    const onUndoButtonClick = () => {
      if (idDismiss && shouldShow) {
        undo(idDismiss);
        return close();
      }
    };

    return (
      <Snackbar
        isAnimated
        idSnackbar={idDismiss}
        shouldShow={shouldShow}
        actionButtonText={formatHome('undo')}
        // eslint-disable-next-line react/jsx-no-bind
        onActionButtonClick={onUndoButtonClick}
        onCloseButtonClick={close}
        onCloseTimeout={close}
        isBoardsMenuPinned={isBoardsMenuPinned}
      >
        {boardName && cardUrl && (
          <span
            /* eslint-disable-next-line react/no-danger */
            dangerouslySetInnerHTML={{
              __html: formatHome('dismissed-to-board', {
                boardName,
                boardUrl: cardUrl,
              }),
            }}
          />
        )}
      </Snackbar>
    );
  },
);
