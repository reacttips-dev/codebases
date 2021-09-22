import React from 'react';
import ReactModal from 'react-modal';

import initBem from 'js/lib/bem';
import connectToRouter from 'js/lib/connectToRouter';
import { isUserRightToLeft } from 'js/lib/language';

import { TunnelVision } from '@coursera/coursera-ui';
import { SvgArrowLeft, SvgArrowRight } from '@coursera/coursera-ui/svg';
import LeaveConfirmModal from 'bundles/compound-assessments/components/modals/LeaveConfirmModal';

import 'css!./__styles__/TunnelVisionWrapper';

const bem = initBem('TunnelVisionWrapper');

type Props = {
  onClose: () => void;
  shouldConfirmClose?: boolean;
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;
  topBanner?: React.ReactNode;
  children: React.ReactNode;
  backbuttonAriaLabel?: string;
  ariaLabel?: string;
};

type State = {
  isOpen: boolean;
  showLeaveConfirmModal: boolean;
  storedClose?: (() => void) | null;
};

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;
const PAGE_UP_KEY = 33;
const PAGE_DOWN_KEY = 34;
const HOME_KEY = 36;
const END_KEY = 35;

export class TunnelVisionWrapper extends React.Component<Props, State> {
  state: State = {
    isOpen: false,
    showLeaveConfirmModal: false,
    storedClose: null,
  };

  componentDidMount() {
    // Need to call ReactModal.setAppElement on CSR when DOM is ready before opening ReactModal
    ReactModal.setAppElement('#rendered-content');
    this.setState({
      isOpen: true,
    });
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    const { contentRef, scrollPage } = this;
    if (contentRef) {
      const currentPosition = contentRef.scrollTop;
      switch (e.keyCode) {
        case ARROW_UP_KEY: {
          if (currentPosition <= 0) {
            return;
          }
          scrollPage(currentPosition - 50);
          break;
        }
        case PAGE_UP_KEY: {
          if (currentPosition <= 0) {
            return;
          }
          scrollPage(currentPosition - contentRef.clientHeight);
          break;
        }
        case HOME_KEY: {
          scrollPage(0);
          break;
        }
        case ARROW_DOWN_KEY: {
          if (currentPosition >= contentRef.scrollHeight) {
            return;
          }
          scrollPage(currentPosition + 50);
          break;
        }
        case PAGE_DOWN_KEY: {
          if (currentPosition >= contentRef.scrollHeight) {
            return;
          }
          scrollPage(currentPosition + contentRef.clientHeight);
          break;
        }
        case END_KEY: {
          scrollPage(contentRef.scrollHeight);
          break;
        }
        default:
          break;
      }
    }
  };

  handleLeaveConfirm = () => {
    const { storedClose } = this.state;

    this.setState({ showLeaveConfirmModal: false, storedClose: null });
    if (storedClose) {
      storedClose();
    }
  };

  handleLeaveCancel = () => {
    this.setState({ showLeaveConfirmModal: false, storedClose: null });
  };

  scrollPage = (newPosition: $TSFixMe) => {
    const { contentRef } = this;
    if (contentRef) {
      contentRef.scrollTo(0, newPosition);
    }
  };

  contentRef: HTMLElement | null = null;

  shouldAllowClose = (close?: () => void): boolean => {
    const { shouldConfirmClose } = this.props;

    if (shouldConfirmClose) {
      this.setState({ showLeaveConfirmModal: true, storedClose: close });
      return false;
    }
    return true;
  };

  render() {
    const { onClose, headerLeft, headerRight, topBanner, children, ariaLabel, backbuttonAriaLabel } = this.props;
    const { isOpen, showLeaveConfirmModal } = this.state;
    return (
      <ReactModal
        portalClassName={bem()}
        className={bem('portallContent')}
        overlayClassName={bem('portalOverlay')}
        isOpen={isOpen}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
      >
        <TunnelVision
          {...{
            disableKeyPress: true,
            onClose,
            // note: refer to CUI source code for comments on how this feature functions
            shouldAllowClose: this.shouldAllowClose,
            ariaLabel,
            backbuttonAriaLabel,
            closeElement: isUserRightToLeft() ? <SvgArrowRight size={28} /> : <SvgArrowLeft size={28} />,
            headerElement: <TunnelVisionHeader {...{ headerLeft, headerRight }} />,
          }}
        >
          <div
            className={bem('content')}
            ref={(ref) => {
              this.contentRef = ref;
            }}
          >
            {topBanner && (
              <div role="alert" aria-live="assertive" className={bem('top-banner')}>
                {topBanner}
              </div>
            )}
            <div className={bem('content-body')}>{children}</div>
          </div>
          {showLeaveConfirmModal && (
            <LeaveConfirmModal
              onPrimaryButtonClick={this.handleLeaveConfirm}
              onCancelButtonClick={this.handleLeaveCancel}
            />
          )}
        </TunnelVision>
      </ReactModal>
    );
  }
}

export const TunnelVisionHeader = ({
  headerLeft,
  headerRight,
}: {
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;
}) => (
  <div className={bem('header')}>
    <div className={bem('header-left')}>{headerLeft}</div>
    <div className={bem('header-right')}>{headerRight}</div>
  </div>
);

export const withRouterOnClose = connectToRouter<Props, Omit<Props, 'onClose'> & { onCloseRouteName: string }>(
  (router, { onCloseRouteName }) => ({
    onClose: () => {
      router.push({
        name: onCloseRouteName,
        params: router.params,
        query: router.location.query,
      });
    },
  })
);

export default withRouterOnClose(TunnelVisionWrapper);
