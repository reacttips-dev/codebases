import React, { useRef, useEffect, useCallback, useState } from 'react';
import cx from 'classnames';
import { CloseIcon, GlyphProps } from '@trello/nachos/icons/close';
import { Button } from '@trello/nachos/button';
import {
  Overlay,
  OverlayBackground,
  OverlayAlignment,
} from 'app/src/components/Overlay';
import { forNamespace } from '@trello/i18n';
import styles from './Dialog.less';

const format = forNamespace();

/**
 * Callback function fired when Dialog is shown
 * @callback onShowCallback
 */

/**
 * Callback function fired when Dialog is shown
 * @callback onHideCallback
 */

/**
 * @typedef UseDialogHookConfigOptions
 * @type {object}
 * @property {onShowCallback} onShow
 * @property {onHideCallback} onHide
 */
interface UseDialogHookConfigOptions {
  onShow?: () => void;
  onHide?: () => void;
}

/**
 * useDialog React hook. Used to manage show/hide state for a Dialog component
 *
 * @usage
 * ```js
 * const { show, dialogProps } = useDialog({
 *   onShow: () => console.log('dialog was shown'),
 *   onHide: () => console.log('dialog was hidden'),
 * });
 *
 * return (
 *  <div>
 *    <button onClick={show}>
 *      Click me to show the dialog!
 *    </button>
 *    <Dialog title="Example dialog" {...dialogProps}>
 *      I am a dialog
 *    </Dialog>
 *  </div>
 * );
 * ```
 *
 * @function useDialog
 * @param {UseDialogHookConfigOptions} [opts]
 */
export const useDialog = (opts?: UseDialogHookConfigOptions) => {
  const { onShow, onHide } = (opts ?? {}) as UseDialogHookConfigOptions;

  const [isOpen, setIsOpen] = useState(false);
  const show = useCallback(() => {
    setIsOpen(true);
    onShow?.();
  }, [setIsOpen, onShow]);

  const hide = useCallback(() => {
    setIsOpen(false);
    onHide?.();
  }, [setIsOpen, onHide]);

  const toggle = useCallback(() => {
    if (isOpen) {
      hide();
    } else {
      show();
    }
  }, [isOpen, show, hide]);

  return {
    show,
    hide,
    toggle,
    isOpen,
    dialogProps: {
      show,
      hide,
      toggle,
      isOpen,
    },
  };
};

interface DialogCloseButtonProps {
  className?: string;
  onClick: () => void;
  size?: GlyphProps['size'];
}

export const DialogCloseButton: React.FC<DialogCloseButtonProps> = ({
  className,
  onClick,
  size = 'large',
}) => (
  <Button
    aria-label={format('close dialog')}
    iconBefore={
      <CloseIcon
        color="dark"
        size={size}
        dangerous_className={styles.closeButtonIcon}
      />
    }
    className={cx({
      [styles.closeButton]: true,
      [String(className)]: !!className,
    })}
    onClick={onClick}
  />
);

export interface DialogProps {
  /**
   * Optional classname applied to root Dialog container element
   */
  className?: string;

  /**
   * Width of the Dialog. Defaults to "medium"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Color of the overlay blanket. See OverlayBackground props in
   * Overlay component
   */
  background?: OverlayBackground;

  /**
   * Contents of the Dialog
   */
  children: React.ReactNode;

  /**
   * Whether the Dialog is open. Provided by `useDialog` hook via `dialogProps`
   */
  isOpen?: boolean;

  /**
   * Callback function to show the Dialog. Proviced by useDialog hook via `dialogProps`
   */
  show: () => void;

  /**
   * Callback function to hide the Dialog. Proviced by useDialog hook via `dialogProps`
   */
  hide: () => void;

  /**
   * Callback function to toggle the Dialog. Proviced by useDialog hook via `dialogProps`
   */
  toggle: () => void;

  /**
   * Should this Dialog close when the Escape key is pressed?
   */
  closeOnEscape?: boolean;

  /**
   * Should this Dialog close when the outside of the Dialog is clicked?
   */
  closeOnOutsideClick?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  className,
  size = 'medium',
  isOpen,
  background = OverlayBackground.LIGHT,
  show,
  hide,
  children,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}) => {
  /*
   * Autofocus the dialog container element when the Dialog is opened.
   * NOTE: Use `preventScroll:true` in focus call so the Dialog remains
   * properly positioned. Otherwise, the call to focus will scroll
   * the Dialog to the top of the screen if it's contents are taller
   * than the window
   */
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      containerRef.current?.focus({
        preventScroll: true,
      });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay
      background={background}
      alignment={OverlayAlignment.TOP}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
      onClose={hide}
    >
      <div
        className={cx({
          [styles.ndialog]: true,
          [String(className)]: !!className,
          [styles.small]: size === 'small',
          [styles.medium]: size === 'medium',
          [styles.large]: size === 'large',
        })}
        tabIndex={-1}
        ref={containerRef}
      >
        <div className={styles.body}>{children}</div>
      </div>
    </Overlay>
  );
};
