import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import _t from 'i18n!nls/course-item-resource-panel';
import Retracked from 'js/app/retracked';

import a11yKeyPress from 'js/lib/a11yKeyPress';
import { SvgClose } from '@coursera/coursera-ui/svg';
import ReactModal from 'react-modal';

// not ideal
const FOCUSABLE_SELECTOR = 'a,button,textarea,input,select,div[contenteditable="true"],[tabindex="0"]';
const NOT_FOCUSABLE = '[tabindex=-1],[disabled],:hidden';
const LAYER_CLOSE_SELECTOR = '.c-modal-x-out a';
/**
 * NOTE: Wrap this in TopLevelModal to display it correctly on mobile.
 */

type Props = {
  modalName: string;
  handleClose?: (event?: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  trackingName?: string;
  type?: 'box' | 'layer' | 'popup' | 'side';
  'data-js'?: string;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  shouldFocusOnXButton?: boolean;
};

class Modal extends React.Component<Props> {
  lastFocusedElement: HTMLElement | null | undefined;

  modalContent: HTMLElement | null | undefined;

  xButton: HTMLElement | null | undefined;

  static contextTypes = {
    _eventData: PropTypes.object,
  };

  static defaultProps = {
    type: 'box',
    'data-js': 'Modal',
  };

  componentWillMount() {
    ReactModal.setAppElement('body');
    if (typeof document !== 'undefined') {
      this.lastFocusedElement = document.activeElement as HTMLElement;
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.cycleTabs, true);

    const { data, trackingName, type, shouldFocusOnXButton } = this.props;
    const { _eventData } = this.context;

    if (type !== 'popup') {
      $('body').addClass('c-ondemand-modal-open');
    }
    if (trackingName) {
      Retracked.trackComponent(_eventData, data, trackingName, 'show');
    }

    if (typeof document !== 'undefined') {
      const $focusableElements = this.getFocusableElements();
      if (this.xButton && shouldFocusOnXButton) {
        this.xButton.focus();
      } else {
        $focusableElements.first().focus();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.cycleTabs, true);

    const { type } = this.props;

    if (type !== 'popup') {
      $('body').removeClass('c-ondemand-modal-open');
    }

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  handleXClose = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    const { data, handleClose, trackingName } = this.props;
    const { _eventData } = this.context;

    if (handleClose) {
      handleClose(e);
    }
    if (trackingName) {
      Retracked.trackComponent(_eventData, data, trackingName, 'close');
    }
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  };

  handleClose = () => {
    const { data, handleClose, trackingName } = this.props;
    const { _eventData } = this.context;

    if (handleClose) {
      handleClose();

      if (trackingName) {
        Retracked.trackComponent(_eventData, data, trackingName, 'close');
      }
    }
  };

  getFocusableElements() {
    // This function called on user action and we know that modalContent ref is set.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return $(this.modalContent!).find(FOCUSABLE_SELECTOR).add(LAYER_CLOSE_SELECTOR).not(NOT_FOCUSABLE);
  }

  captureContent = (ref?: HTMLElement) => {
    this.modalContent = ref;
  };

  redirectTabFocus = (e: KeyboardEvent, $tabbableElement: JQuery) => {
    e.preventDefault();
    $tabbableElement.focus();
  };

  cycleTabs = (e: KeyboardEvent) => {
    // grab it every time in case the modal is updated and there's new contents in there
    const $tabbable = this.getFocusableElements();

    const $lastTabbableElement = $tabbable.last();
    const $firstTabbableElement = $tabbable.first();

    // check for TAB key press with keyCode
    if (e.keyCode === 9 && e.target) {
      const $currentElement = $(e.target);
      if (e.shiftKey) {
        // SHIFT + TAB
        if ($currentElement.is($firstTabbableElement)) {
          this.redirectTabFocus(e, $lastTabbableElement);
        }
      } else if ($currentElement.is($lastTabbableElement)) {
        // TAB
        this.redirectTabFocus(e, $firstTabbableElement);
      }
    }
  };

  render() {
    const { _eventData } = this.context;

    const namespace = (_eventData && _eventData.namespace) || {};
    const { app } = namespace;
    const { page } = namespace;

    // in SSR we dismiss the modal by removing the query param that shows it
    const hrefToRemoveQueryParams = '?';

    const xButton = (
      <div
        style={{
          position: 'absolute',
          right: '16px',
          zIndex: 1,
          top: '24px',
        }}
        className="resourcePanelForumModal__closeButton"
      >
        <a
          className="nostyle modal-button-close"
          onClick={this.handleXClose}
          onKeyPress={(event) => a11yKeyPress(event, this.handleXClose)}
          aria-label={_t('close')}
          href={hrefToRemoveQueryParams}
          role="button"
          data-track={true}
          data-track-app={app}
          data-track-page={page}
          data-track-action="close"
          data-track-component="forumsPanelModal"
          data-e2e="close-modal-button"
        >
          <SvgClose size={24} />
        </a>
      </div>
    );

    return (
      <ReactModal
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 4000,
          },
          content: {
            maxWidth: '760px',
            minWidth: '300px',
            height: '90%',
            backgroundColor: 'white',
            top: '5%',
            margin: '0 auto',
            width: '100%',
            display: 'block',
            position: 'relative',
          },
        }}
        shouldCloseOnEsc={true}
        className="resourcePanelForumModal"
        isOpen={true}
        onRequestClose={this.handleClose}
      >
        <div>
          {xButton}
          {this.props.children}
        </div>
      </ReactModal>
    );
  }
}
export default Modal;
