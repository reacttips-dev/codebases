import React from 'react';

import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  useWorkspaceNavigation,
  useWorkspaceNavigationHidden,
} from 'app/src/components/WorkspaceNavigation';

import styles from './snackbar.less';

interface StyledSnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  actionButtonText?: JSX.Element | string;
  onActionButtonClick?: () => void;
  onCloseButtonClick?: () => void;
  isBoardsMenuPinned?: boolean;
}

export const StyledSnackbar: React.FunctionComponent<StyledSnackbarProps> = ({
  actionButtonText,
  onActionButtonClick,
  onCloseButtonClick,
  isBoardsMenuPinned,
  children,
  className,
  ...props
}) => {
  const [
    {
      expanded: _workspaceNavigationExpanded,
      enabled: _workspaceNavigationEnabled,
    },
  ] = useWorkspaceNavigation();
  const [
    { hidden: _workspaceNavigationHidden },
  ] = useWorkspaceNavigationHidden();
  const workspaceNavigationExpanded =
    _workspaceNavigationEnabled &&
    !_workspaceNavigationHidden &&
    _workspaceNavigationExpanded;

  return (
    <div
      {...props}
      className={classNames(
        styles.snackbar,
        {
          [styles.pinnedBoardsMenu]: isBoardsMenuPinned,
          [styles.workspaceNavigationExpanded]: workspaceNavigationExpanded,
        },
        className,
      )}
    >
      <div className={styles.message}>{children}</div>
      {onActionButtonClick && actionButtonText && (
        <button className={styles.actionButton} onClick={onActionButtonClick}>
          {actionButtonText}
        </button>
      )}
      {onCloseButtonClick && (
        <button className={styles.closeButton} onClick={onCloseButtonClick}>
          <span
            className={classNames(styles.closeIcon, 'icon-sm', 'icon-close')}
          />
        </button>
      )}
    </div>
  );
};

interface TimedSnackbarProps extends StyledSnackbarProps {
  onCloseTimeout?: () => void;
}

export class TimedSnackbar extends React.Component<TimedSnackbarProps> {
  closeTimeout: number | null = null;

  componentDidMount() {
    this.setCloseTimeout(8000);
  }

  componentWillUnmount() {
    this.cancelCloseTimeout();
  }

  onMouseEnter = () => {
    this.cancelCloseTimeout();
  };

  onMouseLeave = () => {
    this.setCloseTimeout(5000);
  };

  setCloseTimeout(duration: number) {
    const { onCloseTimeout } = this.props;

    if (onCloseTimeout) {
      this.closeTimeout = window.setTimeout(onCloseTimeout, duration);
    }
  }

  cancelCloseTimeout() {
    if (this.closeTimeout !== null) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  render() {
    const { onCloseTimeout, ...props } = this.props;

    return (
      <StyledSnackbar
        {...props}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}

interface AnimatedSnackbarProps extends TimedSnackbarProps {
  idSnackbar?: string;
  shouldShow?: boolean;
  isAnimated?: boolean;
}

export const AnimatedSnackbar: React.FunctionComponent<AnimatedSnackbarProps> = ({
  shouldShow = true,
  isAnimated = false,
  idSnackbar = '',
  className,
  ...props
}) => (
  // Only one snackbar can be shown at a time, but changing `idSnackbar`
  // will animate a new snackbar in while simultaneously animating the
  // old snackbar out.
  <TransitionGroup className={styles.snackbarStackingContext}>
    {shouldShow && (
      <CSSTransition
        key={idSnackbar}
        classNames={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          exit: styles.fadeExit,
          exitActive: styles.fadeExitActive,
        }}
        timeout={300}
      >
        <TimedSnackbar
          {...props}
          className={classNames(
            {
              // Workaround for IE11 bug, apply `enter` styling on initial render
              // https://github.com/reactjs/react-transition-group/issues/22
              // Don't apply it if the caller isn't animating this component.
              [styles.fadeEnter]: isAnimated,
            },
            className,
          )}
        />
      </CSSTransition>
    )}
  </TransitionGroup>
);

export const Snackbar = AnimatedSnackbar;
