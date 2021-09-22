/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { Link } from '@coursera/cds-core';
import { CloseIcon } from '@coursera/cds-icons';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import _t from 'i18n!nls/ui';
import { H2 } from '@coursera/coursera-ui';
import Retracked from 'js/app/retracked';
import 'css!./__styles__/Modal';

const styles = {
  closeX: css({
    position: 'absolute',
    top: '24px',
    right: '24px',
    svg: {
      // Icon is not properly positioned in Link component
      marginTop: '1px',
    },
  }),
};

type ModalCloseXProps = {
  onRequestClose: (e: React.MouseEvent<HTMLElement>) => void;
  forwardedRef: (ref: HTMLElement | null) => void;
  ariaDescribedBy: string;
  ariaLabel: string;
};

export const ModalCloseX: React.FC<ModalCloseXProps> = ({
  onRequestClose,
  forwardedRef,
  ariaDescribedBy,
  ariaLabel,
}) => {
  // in SSR we dismiss the modal by removing the query param that shows it
  const hrefToRemoveQueryParams = '?';

  return (
    <Link
      href={hrefToRemoveQueryParams}
      variant="quiet"
      typographyVariant="h4bold"
      icon={<CloseIcon size="small" />}
      iconPosition="after"
      css={styles.closeX}
      onClick={onRequestClose}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      role="button"
      ref={forwardedRef}
    >
      {_t('Close')}
    </Link>
  );
};

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
