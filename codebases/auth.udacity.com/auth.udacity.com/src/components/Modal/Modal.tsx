import React, { useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import FocusTrap from "focus-trap-react";
import RoundButton from "../RoundButton/RoundButton";
import Icon from "../Icon/Icon";
import { useOnClickOutside, useOnEscKeyDown } from "../../utils";
import { useEffect } from "react";

const PREFIX = "vds-modal";
const MODAL_NOT_SCROLLABLE_CLASSNAME = "vds-modal-not-scrollable";
const SCROLL_LOCK_CLASSNAME = "vds-scroll-lock";

/** Modal Props */

export interface ModalProps {
  /** Content displayed inside the Modal */
  children: React.ReactNode;

  /** Descriptive [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) text to label content of Modal for accessibility */
  label: string;

  /** Callback when Modal is closed */
  onClose(evt?: React.MouseEvent): void;

  /** Close button `aria-label` text for accessibility */
  closeLabel?: string;

  /** Toggles whether Modal is visible and rendered in DOM */
  open?: boolean;

  /** Determines whether modal contents should scroll if they overflow */
  scrollable?: boolean;
}

/**
 * Modals present content in a layer above the page to inform users about a task, convey important information, or require a decision.
 * They can be dismissed using the `esc` key or by clicking outside.
 * Use Modals sparingly to avoid interrupting workflows too frequently.
 */

const Modal: React.FC<ModalProps> = ({
  children,
  label,
  onClose,
  closeLabel = "Close Modal",
  open = false,
  scrollable = true
}: ModalProps) => {
  // Close when clicked outside
  const modalRef = useRef<HTMLInputElement>(null);
  useOnClickOutside(modalRef, onClose);

  // Close when `esc` is pressed
  useOnEscKeyDown(onClose);

  // Lock and unlock scrolling when open / closed
  useEffect(() => {
    const currentPageClassList = document?.querySelector("html")?.classList;
    if (currentPageClassList) {
      open
        ? currentPageClassList.add(SCROLL_LOCK_CLASSNAME)
        : currentPageClassList.remove(SCROLL_LOCK_CLASSNAME);
    }
    return (): void => currentPageClassList?.remove(SCROLL_LOCK_CLASSNAME);
  }, [open]);

  const className = classNames(PREFIX, {
    [MODAL_NOT_SCROLLABLE_CLASSNAME]: !scrollable
  });

  const closeIcon = (
    <Icon color="silver" hidden>
      <svg viewBox="0 0 32 32">
        <path
          d="M14.586 16L7.293 8.707a1 1 0 0 1 1.414-1.414L16 14.586l7.293-7.293a1 1 0 0 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 1 1-1.414-1.414L14.586 16z"
          fillRule="nonzero"
        />
      </svg>
    </Icon>
  );

  const closeButton = (
    <div className={`${PREFIX}__close-button`}>
      <RoundButton
        label={closeLabel}
        icon={closeIcon}
        onClick={onClose}
        small
        variant="minimal"
      />
    </div>
  );

  const contentClass = `${PREFIX}__content`;

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
  return (
    <>
      {createPortal(
        open && (
          <FocusTrap
            focusTrapOptions={{
              initialFocus: `.${contentClass}`
            }}
          >
            <aside
              aria-label={label}
              aria-modal="true"
              className={`${PREFIX}__blanket`}
              role="dialog"
            >
              <div className={className} ref={modalRef}>
                {closeButton}
                <div className={contentClass} tabIndex={0}>
                  {children}
                </div>
              </div>
            </aside>
          </FocusTrap>
        ),
        document.body
      )}
    </>
  );
};

export default Modal;
