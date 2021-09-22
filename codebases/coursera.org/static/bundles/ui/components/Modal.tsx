import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import _t from 'i18n!nls/ui';
import { SvgClose } from '@coursera/coursera-ui/svg';
import { H2 } from '@coursera/coursera-ui';
import Retracked from 'js/app/retracked';
import 'css!./__styles__/Modal';

export class ModalCloseX extends React.Component<
  {
    onRequestClose: (e: React.MouseEvent<HTMLElement>) => void;
    forwardedRef: (ref: HTMLElement | null) => void;
    ariaDescribedBy: string;
    ariaLabel: string;
  },
  {}
> {
  render() {
    // in SSR we dismiss the modal by removing the query param that shows it
    const hrefToRemoveQueryParams = '?';
    const { onRequestClose, forwardedRef, ariaDescribedBy, ariaLabel } = this.props;

    return (
      <a
        className="nostyle close-x"
        onClick={onRequestClose}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        role="button"
        href={hrefToRemoveQueryParams}
        ref={forwardedRef}
      >
        <SvgClose />
      </a>
    );
  }
}

type Props = {
  // ReactModal-specific props
  isOpen: boolean;
  onRequestClose: () => void;
  onAfterOpen?: () => void;

  // Coursera modal props
  children: React.ReactNode;
  title?: React.ReactNode;
  allowClose?: boolean;
  size: 'default' | 'small' | 'large' | 'x-large';
  shouldCloseOnOverlayClick?: boolean;
  className?: string;
  trackingName?: string;
  data?: any;
  modalName?: string;
  role?: string;
  ariaLabeledById?: string;
  ariaDescribedById?: string;
  appElementSelector?: string; // optional element selector that react-modal mounts to
};

class Modal extends React.Component<Props, {}> {
  modalCloseX: HTMLElement | null | undefined;

  static contextTypes = {
    _eventData: PropTypes.object,
  };

  static defaultProps = {
    size: 'default',
    allowClose: true,
    isOpen: true,
    appElementSelector: '#rendered-content', // this is the default mount node for all coursera apps
  };

  constructor(props: Props) {
    super(props);
    // set mount node for react-modal
    ReactModal.setAppElement(props.appElementSelector as string);
  }

  componentDidMount() {
    const { data, trackingName } = this.props;
    const { _eventData } = this.context;

    Retracked.trackComponent(_eventData, data, trackingName, 'show');
  }

  onAfterOpen = () => {
    const { allowClose, onAfterOpen } = this.props;
    if (allowClose) {
      if (this.modalCloseX) {
        this.modalCloseX.focus();
      }
    }

    if (onAfterOpen) {
      onAfterOpen();
    }
  };

  onRequestClose = () => {
    const { allowClose, onRequestClose, data, trackingName } = this.props;
    const { _eventData } = this.context;

    if (allowClose) {
      Retracked.trackComponent(_eventData, data, trackingName, 'close');
      onRequestClose();
    }
  };

  onRequestCloseX = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.onRequestClose();
  };

  render() {
    const {
      shouldCloseOnOverlayClick,
      size,
      className,
      title,
      allowClose,
      children,
      isOpen,
      modalName,
      role,
      ariaLabeledById,
      ariaDescribedById,
    } = this.props;
    // We are using the class rc-UIModal to avoid conflict with bundles/phoenix/components/Modal
    const classes = classNames('rc-UIModal', size, className);

    return (
      <ReactModal
        className={classes}
        overlayClassName="rc-ModalOverlay"
        isOpen={isOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={this.onRequestClose}
        {...(modalName && {
          contentLabel: modalName,
        })}
        {...(role && { role })}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        aria={{
          ...(ariaLabeledById || modalName ? { labelledby: ariaLabeledById ?? 'headingTitle' } : {}),
          ...(ariaDescribedById ? { describedby: ariaDescribedById } : {}),
        }}
      >
        {title && (
          <H2 id="headingTitle" rootClassName="title flex-1">
            {title}
          </H2>
        )}
        {allowClose && (
          <ModalCloseX
            onRequestClose={this.onRequestCloseX}
            forwardedRef={(ref) => {
              this.modalCloseX = ref;
            }}
            ariaDescribedBy="headingTitle"
            ariaLabel={_t('Close')}
          />
        )}
        {children}
      </ReactModal>
    );
  }
}

export default Modal;
