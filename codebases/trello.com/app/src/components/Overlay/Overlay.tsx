import React, { FunctionComponent, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { LayerManagerPortal, Layers } from 'app/src/components/LayerManager';
import styles from './Overlay.less';
import {
  ELEVATION_ATTR,
  useClickOutsideHandler,
  useCallbackRef,
  getHighestVisibleElevation,
} from '@trello/layer-manager';

export enum OverlayBackground {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum OverlayAlignment {
  TOP = 'top',
}

interface OverlayProps {
  background: OverlayBackground;
  alignment?: OverlayAlignment;
  className?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onClose: () => void;
}

const noop = () => {};

export const Overlay: FunctionComponent<OverlayProps> = ({
  background = OverlayBackground.LIGHT,
  alignment,
  className = '',
  closeOnEscape,
  closeOnOutsideClick = true,
  onClose = noop,
  children,
}) => {
  const [contentsElement, contentsRef] = useCallbackRef<HTMLDivElement>();

  const handleEscape = useCallback(() => {
    if (closeOnEscape) {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  useShortcut(handleEscape, {
    scope: Scope.Overlay,
    key: Key.Escape,
  });

  // Set up an 'elevation aware' outside click handler
  // to detect clicks outside the content of the overlay
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }
      onClose();
    },
    [onClose],
  );

  useClickOutsideHandler({
    element: contentsElement,
    handleClickOutside,
    skip: !closeOnOutsideClick,
  });

  // Taking advantage of lazy state initialization here, as we want to
  // calculate this value on first render and persist it for the entire life-
  // cycle
  const [elevation] = useState(() => getHighestVisibleElevation() + 1);

  return (
    <LayerManagerPortal layer={Layers.Overlay}>
      <div
        className={classNames(
          { [styles.alignTop]: alignment === OverlayAlignment.TOP },
          styles.overlay,
          styles[background],
          className,
        )}
      >
        <div
          ref={contentsRef}
          className={styles.contents}
          {...{ [ELEVATION_ATTR]: elevation }}
        >
          {children}
        </div>
      </div>
    </LayerManagerPortal>
  );
};
