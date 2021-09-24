import React from 'react';
import BootstrapModal from 'react-bootstrap/lib/Modal';
import Icon from '../Icon';
import {
  ContentContainerCss,
  DialogCss,
  CloseButton,
  CloseButtonWrapper,
  OverlayContainer,
  FullScreenModalDialog,
} from './styles';

type Props = {
  isShowing: boolean;
  isShowingCloseButton?: boolean;
  onClickOutside?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  renderContent: () => React.ReactNode;
  className?: string;
  contentClassName?: string;
  dialogClassName?: string;
  renderOverlayContent?: () => React.ReactNode;
  closeIconColor?: string;
  useBaseContentClass?: boolean;
  showOverlayContent?: boolean;
  isFullScreenOnMobile?: boolean;
};

export const DEFAULT_CLOSE_ICON_COLOR = '#C9CBCD';

const Modal = ({
  isShowing,
  isShowingCloseButton = false,
  onClickOutside = () => {},
  onClickClose = () => {},
  renderContent,
  className = '',
  contentClassName = '',
  dialogClassName = '',
  renderOverlayContent,
  closeIconColor = DEFAULT_CLOSE_ICON_COLOR,
  useBaseContentClass = true,
  showOverlayContent = false,
  isFullScreenOnMobile = false,
}: Props) => (
  <BootstrapModal
    show={isShowing}
    onHide={onClickOutside}
    dialogClassName={`${DialogCss} ${
      isFullScreenOnMobile ? FullScreenModalDialog : ''
    } ${dialogClassName}`}
    className={className}
  >
    {isShowingCloseButton && (
      <CloseButtonWrapper
        className="closeButtonWrapper"
        aria-hidden={showOverlayContent}
      >
        <CloseButton
          className="closeButton"
          onClick={onClickClose}
          type="button"
          aria-label="Close modal"
        >
          <Icon type="x" fillColor={closeIconColor} />
        </CloseButton>
      </CloseButtonWrapper>
    )}
    <div
      className={`
        ${
          useBaseContentClass
            ? `${ContentContainerCss} ${contentClassName}`
            : contentClassName
        }
        renderContent`}
      aria-hidden={showOverlayContent}
    >
      {renderContent()}
    </div>
    {showOverlayContent && renderOverlayContent && (
      <OverlayContainer>{renderOverlayContent()}</OverlayContainer>
    )}
  </BootstrapModal>
);

export { Modal };
