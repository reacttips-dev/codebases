import React, { useCallback } from 'react';
import { StarIcon } from '@trello/nachos/icons/star';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';

import { toggleBoardStar } from 'app/gamma/src/modules/state/models/board-stars';
import { State } from 'app/gamma/src/modules/types';

import { isBoardStarred } from 'app/gamma/src/selectors/boards';

import styles from './StarredBoardButton.less';
import { BoardButton } from './BoardButton';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_list_item');

interface OwnProps {
  readonly idBoard: string;
}

interface StateProps {
  readonly isStarred: boolean;
}

interface DispatchProps {
  onClick(): void;
}

interface AllProps extends OwnProps, StateProps, DispatchProps {}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  const { idBoard } = ownProps;

  return {
    isStarred: isBoardStarred(state, idBoard),
  };
};

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
        dispatch(toggleBoardStar({ idBoard }));
      });
    },
  };
};

const StarredBoardButtonUnconnected = ({ onClick, isStarred }: AllProps) => {
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
      className={isStarred ? styles.yellowStar : ''}
      icon={<StarIcon size="small" />}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      tabIndex={0} // for a11y
      title={format(
        'click-to-star-this-board-it-will-show-up-at-top-of-your-boards-list',
      )}
    />
  );
};

export const StarredBoardButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StarredBoardButtonUnconnected);
