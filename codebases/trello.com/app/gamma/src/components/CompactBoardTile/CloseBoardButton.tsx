import { removeRecentBoardByID } from 'app/gamma/src/modules/state/ui/boards-menu';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Dispatch } from 'app/gamma/src/types';
import styles from './CloseBoardButton.less';
import { BoardButton } from './BoardButton';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_list_item');

interface OwnProps {
  readonly idBoard: string;
}

interface DispatchProps {
  onClick(): void;
}

interface AllProps extends OwnProps, DispatchProps {}

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  const { idBoard } = ownProps;

  return {
    onClick() {
      /**
       * MS Edge has an issue with racing conditions in React, or
       * with the way async/await works, or both.
       * With optimistic updates happening here, it seems
       * that React is too fast to unbind callbacks, and Edge lets
       * the click go through a then unbound <a> on RouterLink.
       *
       * A setTimeout here fixes the problem.
       *
       * TODO: Remove this when EdgeHTML is not supported anymore
       */
      setTimeout(() => {
        dispatch(removeRecentBoardByID(idBoard));
      });
    },
  };
};

const CloseBoardButtonUnconnected = ({ onClick }: AllProps) => {
  const onClickHandler: React.MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      // The boards menu container registers document-level click handlers, so we
      // need to mute the native event too to make sure this doesn't bubble there.
      e.nativeEvent.stopImmediatePropagation();
      onClick();
    },
    [onClick],
  );
  const onKeyDownHandler: React.KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }
    },
    [onClick],
  );

  return (
    <BoardButton
      className={styles.closeButton}
      icon={<CloseIcon size="small" />}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      tabIndex={0} // for a11y
      title={format('click-to-remove-this-board-from-your-recent-boards')}
    />
  );
};

export const CloseBoardButton = connect(
  null,
  mapDispatchToProps,
)(CloseBoardButtonUnconnected);
