import React, { forwardRef, ReactNode, useEffect } from 'react';
import ReactModal from 'react-modal';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/melodyModal.scss';

const MODAL_HEADING_ID = 'modalHeading';

/*
  This is a light wrapper around react-modal, so  we can enforce consistency in modal css and usage. Most of these will be provided by default,
  outside of event handlers.

  The `ref` provided via `forwardRef` react helper/the `ref` prop will be passed to the button, as that's the only internal marty markup here, the other refs can use CBs

*/

interface Props {
  appElement?: HTMLElement | {};
  // Set this to properly hide your application from assistive screenreaders and other assistive technologies while the modal is open.
  aria?: {
    labelledby?: string;
    // Defines a string value that labels the current element.
    describedby?: string;
    // Identifies the element (or elements) that describes the object.
    modal?: boolean | 'false' | 'true';
    // Indicates whether an element is modal when displayed.
  };
  // Additional aria attributes.

  ariaHideApp?: boolean;
  // Boolean indicating if the appElement should be hidden. Defaults to true.
  bodyOpenClassName?: string | null;
  // String className to be applied to the document.body (must be a constant string). When set to null it doesn't add any class to document.body.
  buttonData?: any;
  // Additional data attributes to be applied to to the close button in the form of "data-*"
  buttonTestId?: string;
  // String to be applied to the button `data-test-id` attribute
  children: ReactNode;
  className?: string | { base: string; afterOpen: string; beforeClose: string};
  // String or object className to be applied to the modal content.
  closeTimeoutMS?: number;
  // Number indicating the milliseconds to wait before closing the modal. Defaults to zero (no timeout).
  contentLabel?: string;
  // String indicating how the content container should be announced to screenreaders.
  contentRef?: (instance: HTMLDivElement) => void;
  // Function accepting the ref for the content
  data?: any;
  // Additional data attributes to be applied to to the modal content in the form of "data-*"
  heading?: string | ReactNode;
  // String or element to be inserted into the modal heading
  headingClassName?: string | { base: string; afterOpen: string; beforeClose: string};
  // String or object className to be applied to the heading.
  headingTestId?: string;
  // String to be applied to the heading `data-test-id` attribute
  htmlOpenClassName?: string | null;
  // String className to be applied to the document.html (must be a constant string). Defaults to null.
  isOpen: boolean;
  // Boolean describing if the modal should be shown or not. Defaults to false.
  onAfterClose?(): void;
  // Function that will be run after the modal has closed.
  onAfterOpen?(): void;
  // Function that will be run after the modal has opened.
  onRequestClose?(event: React.SyntheticEvent): void;
  // Function that will be run when the modal is requested to be closed, prior to actually closing.
  overlayClassName?: string | { base: string; afterOpen: string; beforeClose: string};
  // String or object className to be applied to the overlay.
  overlayRef?: (instance: HTMLDivElement) => void;
  // Function accepting the ref for the overlay
  parentSelector?(): HTMLElement;
  // Function that will be called to get the parent element that the modal will be attached to.
  portalClassName?: string;
  // String className to be applied to the portal. Defaults to "ReactModalPortal".
  shouldFocusAfterRender?: boolean;
  // Boolean indicating if the modal should be focused after render
  shouldCloseOnOverlayClick?: boolean;
  // Boolean indicating if the overlay should close the modal. Defaults to true.
  shouldCloseOnEsc?: boolean;
  // Boolean indicating if pressing the esc key should close the modal
  shouldReturnFocusAfterClose?: boolean;
  // Boolean indicating if the modal should restore focus to the element that had focus prior to its display.
  style?: {
    content?: {
      [key: string]: any;
    };
    overlay?: {
      [key: string]: any;
    };
  };
  // Object indicating styles to be used for the modal, divided into overlay and content styles.
  role?: string | null;
  // String indicating the role of the modal, allowing the 'dialog' role to be applied if desired. Defaults to "dialog".
  wrapperTestId?: string;
  // String to be applied to the wrapper `data-test-id` attribute
}

const TestModal = ({ children }: { children: ReactNode}) => <div>{children}</div>;
// Testing is whack with modals/portals, so just stub out the container in test environments
const ModalComponent = process.env.NODE_ENV === 'test' ? TestModal : ReactModal;

const buildDataAttributes = (dataObject: Record<string, string> = {}) => Object.entries(dataObject).reduce((acc: Record<string, string>, [key, value]) => {
  acc[`data-${key}`] = value;
  return acc;
}, {});

// eslint-disable-next-line prefer-arrow-callback
const MelodyModal = forwardRef<HTMLButtonElement, Props>(function MelodyModal({ // Name this function so forwardRef points to that name in DevTools
  bodyOpenClassName,
  buttonData = {},
  buttonTestId,
  children,
  className,
  data,
  heading,
  headingClassName,
  headingTestId,
  isOpen,
  onRequestClose,
  overlayClassName,
  wrapperTestId,
  aria = {},
  ...rest
}, closeButtonRef) {

  const { testId } = useMartyContext();

  const dataAttributes = {
    ...data,
    'test-id': testId(wrapperTestId)
  };
  const ariaProps = {
    modal: true,
    labelledby: heading ? MODAL_HEADING_ID : undefined,
    ...aria
  };

  const buttonDataAttributes = buildDataAttributes(buttonData);

  useEffect(() => {
    if (isOpen) {
      // Manually add position fixed to the body to prevent iOS devices from scrolling,
      // but capture and maintain the scroll position as well
      const position = window.scrollY;
      document.body.style.top = `-${position}px`;
      document.body.style.position = 'fixed';
      document.body.style.minWidth = '100%';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.minWidth = '';
        window.scrollTo(0, position);
      };
    }
  }, [isOpen]);

  return (
    <ModalComponent
      onRequestClose={onRequestClose}
      overlayClassName={cn(css.overlay, overlayClassName)}
      bodyOpenClassName={cn(css.bodyOpen, bodyOpenClassName)}
      className={cn(css.content, className)}
      data={dataAttributes}
      isOpen={isOpen}
      aria={ariaProps}
      {...rest}
    >
      {heading ?
        <header className={cn(css.header, headingClassName)}>
          <h2 id={MODAL_HEADING_ID} data-test-id={testId(headingTestId)}>{heading}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className={css.close}
            onClick={onRequestClose}
            aria-label="Close"
            data-test-id={testId(buttonTestId)}
            {...buttonDataAttributes}
          />
        </header>
        :
        <button
          type="button"
          className={css.closeNoHeading}
          onClick={onRequestClose}
          aria-label="Close"
          data-test-id={testId(buttonTestId)}
          {...buttonDataAttributes}
        />
      }
      {children}
    </ModalComponent>
  );
});

export default MelodyModal;
