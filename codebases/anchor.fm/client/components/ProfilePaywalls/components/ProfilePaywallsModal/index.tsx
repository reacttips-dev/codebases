import styled from '@emotion/styled';
import { css } from 'emotion';
import React, { useEffect, useRef, useState } from 'react';
import { useBrowserSize } from '../../../../contexts/BrowserSize';
import Icon from '../../../../shared/Icon';
import { DEFAULT_CLOSE_ICON_COLOR, Modal } from '../../../../shared/Modal';
import { CloseButton } from '../../../../shared/Modal/styles';
import { PaymentProvider } from '../../../PaymentProvider';
import { MOBILE_BREAKPOINT } from '../../../PaywallsShared/constants';
import { AnchorLogoWithWordmark } from '../../../svgs/AnchorLogoWithWordmark';
import { SpotifyLogoMark } from '../../../svgs/SpotifyLogoMark';
import { ProfilePaywalls, ProfilePaywallsProps } from '../../index';
import { ProfilePaywallsCurrentScreen } from '../../types';

interface ProfilePaywallsModalProps {
  onClose: () => void;
}

/**
 * The close button / header functonality here is the only thing that really
 * stands out; the modal is Spotify-branded on mobile web, so we have to move
 * the close button down from the header where it normally is in modals to the
 * content portion. As such, some of that logic here is custom though borrows
 * styles from the shared modal component.
 */
export const ProfilePaywallsModal = (
  props: ProfilePaywallsModalProps & ProfilePaywallsProps
) => {
  const { onClose } = props;
  const { width } = useBrowserSize();
  const [
    currentScreen,
    setCurrentScreen,
  ] = useState<ProfilePaywallsCurrentScreen | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = width <= MOBILE_BREAKPOINT;

  // We don't want the user to exit out of the process when they reach the email
  // consent screen, because the next screen will have the subscription info.
  const isShowCloseButton =
    currentScreen !== ProfilePaywallsCurrentScreen.EMAIL_CONSENT;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentScreen, contentRef.current]);

  const mobileHeader = (
    <MobileHeader>
      <SpotifyLogoMark width={28} fillColor="white" />
      <AnchorLogoWithWordmark
        width={100}
        fillColor="white"
        includeSpotify={true}
      />
    </MobileHeader>
  );

  return (
    <PaymentProvider>
      <Modal
        isShowingCloseButton={false}
        isShowing={true}
        isFullScreenOnMobile={true}
        dialogClassName={css`
          overflow: hidden;
        `}
        renderContent={() => {
          return (
            <ModalContentWrapper data-cy="paywallsModal">
              {isMobile && mobileHeader}
              <ModalContent ref={contentRef}>
                {isShowCloseButton && (
                  <CloseButtonWrapper>
                    <CloseButton
                      type="button"
                      aria-label="Close modal"
                      onClick={onClose}
                    >
                      <Icon type="x" fillColor={DEFAULT_CLOSE_ICON_COLOR} />
                    </CloseButton>
                  </CloseButtonWrapper>
                )}
                <ProfilePaywalls
                  {...props}
                  onChangeCurrentScreen={setCurrentScreen}
                />
              </ModalContent>
            </ModalContentWrapper>
          );
        }}
      />
    </PaymentProvider>
  );
};

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: black;
  padding: 7px 20px;
  box-sizing: border-box;
  font-size: 0;
`;

const CloseButtonWrapper = styled.div`
  width: 18px;
  margin-bottom: 10px;
  margin-left: -20px;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    margin-left: 0;
  }
`;

/**
 * We do this styling because we want to scroll the container to the top when
 * you change page views, and this is difficult to do with the way refs are
 * structured within the react-bootstrap dialog.
 */
const ModalContentWrapper = styled.div`
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    // Fixed behaves better than absolute on Mobile iOS in terms of resizing
    // properly when the Chrome toolbar appears
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
  }
`;

const ModalContent = styled.div`
  padding: 0 20px 20px;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 20px;
  }
`;
