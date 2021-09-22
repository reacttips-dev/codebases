import classNames from 'classnames';

import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { SvgClose } from '@coursera/coursera-ui/svg';
import _t from 'i18n!nls/phoenix';
import 'css!./__styles__/Modal';
import Retracked from 'js/app/retracked';

import a11yKeyPress from 'js/lib/a11yKeyPress';
import { isRightToLeft } from 'js/lib/language';

// not ideal
const FOCUSABLE_SELECTOR = 'a,button,textarea,input,select,div[contenteditable="true"],[tabindex="0"]';
const NOT_FOCUSABLE = '[tabindex=-1],[disabled],:hidden,div.c-modal-focus-trap';
/**
 * NOTE: Wrap this in TopLevelModal to display it correctly on mobile.
 */

type Props = {
  modalName: string;
  allowClose?: boolean;
  allowStaticBackdrop?: boolean; // when allowed, clicking on the dark backdrop behind the modal will not close the modal
  handleClose?: (event?: React.MouseEvent<HTMLElement>) => void;
  svgCloseIconSize?: number;
  className?: string;
  trackingName?: string;
  type?: 'box' | 'layer' | 'popup' | 'side';
  'data-js'?: string; // TODO: Avoid string literal props.
  'data-e2e'?: string; // TODO: Avoid string literal props.
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  shouldFocusOnXButton?: boolean;
  labelledById?: string;
  /** Allows to set id of element that contains description for modal. Will be read once a Modal opens. */
  describedById?: string;
  ariaRole?: string;
  dataPendo?: string;
};

class Modal extends React.Component<Props> {
  lastFocusedElement: HTMLElement | null | undefined;

  container: HTMLElement | null | undefined;

  xButton: HTMLElement | null | undefined;

  _didApplyBodyStyle: boolean | undefined;

  static contextTypes = {
    _eventData: PropTypes.object,
  };

  static defaultProps = {
    type: 'box',
    allowClose: true,
    'data-js': 'Modal',
  };

  componentWillMount() {
    if (typeof document !== 'undefined') {
      this.lastFocusedElement = document.activeElement as HTMLElement;
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.checkForEsc, true);

    const { data, trackingName, type, shouldFocusOnXButton } = this.props;
    const { _eventData } = this.context;

    if (type !== 'popup') {
      const body = document.body;
      if (body) {
        const counter = Number(body.dataset.cPheonixModalCounter ?? '0') + 1;
        body.dataset.cPheonixModalCounter = String(counter);
        this._didApplyBodyStyle = true;
        body.classList.add('c-phoenix-modal-open');
      }
    }

    if (trackingName) {
      Retracked.trackComponent(_eventData, data, trackingName, 'show');
    }

    if (typeof document !== 'undefined') {
      if (this.xButton && shouldFocusOnXButton) {
        this.xButton.focus();
      } else {
        this.getFocusableElements().first().focus();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkForEsc, true);

    if (this._didApplyBodyStyle) {
      const body = document.body;
      if (body) {
        const counter = Math.max(0, Number(body.dataset.cPheonixModalCounter ?? '0') - 1);
        if (counter) {
          body.dataset.cPheonixModalCounter = String(counter);
        } else {
          body.classList.remove('c-phoenix-modal-open');
          delete body.dataset.cPheonixModalCounter;
        }
      }
    }

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  handleXClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const { data, handleClose, trackingName } = this.props;
    const { _eventData } = this.context;

    if (handleClose) {
      handleClose(e);
    }
    if (trackingName) {
      Retracked.trackComponent(_eventData, data, trackingName, 'close');
    }
  };

  handleOverlayClose = () => {
    const { allowStaticBackdrop } = this.props;
    if (!allowStaticBackdrop) {
      this.handleClose();
    }
  };

  handleClose = () => {
    const { allowClose, data, handleClose, trackingName } = this.props;
    const { _eventData } = this.context;

    if (allowClose && handleClose) {
      handleClose();

      if (trackingName) {
        Retracked.trackComponent(_eventData, data, trackingName, 'close');
      }
    }
  };

  getFocusableElements() {
    // This function called on user action and we know that modalContent ref is set.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return $(this.container!).find(FOCUSABLE_SELECTOR).not(NOT_FOCUSABLE);
  }

  captureContainer = (ref?: HTMLElement | null) => {
    this.container = ref;
  };

  captureXButton = (ref?: HTMLElement | null) => {
    this.xButton = ref;
  };

  checkForEsc = (e: KeyboardEvent) => {
    if (e.keyCode === 27 || e.key === 'Escape') {
      this.handleClose();
    }
  };

  _focusFirstElement = () => {
    this.getFocusableElements().first().trigger('focus');
  };

  _focusLastElement = () => {
    this.getFocusableElements().last().trigger('focus');
  };

  render() {
    const { _eventData } = this.context;
    const {
      allowClose,
      children,
      className,
      modalName,
      trackingName,
      type,
      labelledById,
      describedById,
      svgCloseIconSize,
      ariaRole,
    } = this.props;

    const namespace = (_eventData && _eventData.namespace) || {};
    const { app } = namespace;
    const { page } = namespace;
    const component = trackingName;

    // in SSR we dismiss the modal by removing the query param that shows it
    const hrefToRemoveQueryParams = '?';

    const xButton = (
      <div className={classNames('c-modal-x-out', isRightToLeft(_t.getLocale()) && 'close-button-rtl')}>
        <a
          ref={this.captureXButton}
          className="nostyle"
          onClick={this.handleXClose}
          onKeyPress={(event) => a11yKeyPress(event, this.handleXClose)}
          aria-label={_t('close')}
          href={hrefToRemoveQueryParams}
          role="button"
          data-track={true}
          data-track-app={app}
          data-track-page={page}
          data-track-action="close"
          data-track-component={component}
          data-e2e="close-modal-button"
        >
          {svgCloseIconSize ? <SvgClose size={svgCloseIconSize} /> : '✕'}
        </a>
      </div>
    );
    const classes = classNames('rc-Modal', type, className);
    const modalContentClasses = type === 'popup' ? 'c-modal-content card-rich-interaction' : 'c-modal-content';

    return (
      <div
        className={classes}
        // TODO: Avoid string literal props.
        data-js={this.props['data-js']}
        data-track={true}
        data-track-app={app}
        data-track-page={page}
        data-track-action="show"
        data-track-component={component}
        // TODO: Avoid string literal props.
        data-e2e={this.props['data-e2e']}
        role={ariaRole || 'dialog'}
        aria-modal={type !== 'popup'}
        aria-labelledby={labelledById || undefined}
        aria-describedby={describedById}
        aria-label={labelledById ? undefined : modalName}
        data-pendo={this.props.dataPendo}
        ref={this.captureContainer}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
        {type !== 'popup' && <div className="c-modal-overlay" onClick={this.handleOverlayClose} role="presentation" />}
        {/* focus trap element */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="c-modal-focus-trap" role="presentation" tabIndex={0} onFocus={this._focusLastElement} />
        {type === 'layer' && allowClose && xButton}

        <div className={modalContentClasses}>
          {children}
          {type !== 'layer' && allowClose && xButton}
        </div>
        {/* focus trap element */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="c-modal-focus-trap" role="presentation" tabIndex={0} onFocus={this._focusFirstElement} />
      </div>
    );
  }
}
export default Modal;
