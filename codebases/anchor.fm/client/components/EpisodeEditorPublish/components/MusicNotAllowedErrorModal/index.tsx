import React from 'react';
import styled from '@emotion/styled';

import { Modal } from 'shared/Modal';
import { Button } from 'shared/Button/NewButton';
import { LinkText } from 'shared/Link';
import { SM_SCREEN_MAX } from 'modules/Styleguide';
import { AccessibleErrorContainer } from 'components/AccessibleErrorContainer';

const MUSIC_NOT_ALLOWED_ERROR_TITLE = 'Unable to publish';
const MUSIC_NOT_ALLOWED_ERROR_BUTTON_LABEL = 'Got it';

type MusicNotAllowedErrorModalProps = {
  onDismiss: () => void;
};

export function MusicNotAllowedErrorModal({
  onDismiss,
}: MusicNotAllowedErrorModalProps): React.ReactElement {
  return (
    <Modal
      isShowing
      renderContent={() => (
        <AccessibleErrorContainer>
          <ContentWrapper>
            <Title>{MUSIC_NOT_ALLOWED_ERROR_TITLE}</Title>
            <Message>
              {`We’re having trouble publishing your episode. For more information reach out to us at `}
              <LinkText isInline target="_blank" to="https://help.anchor.fm">
                help.anchor.fm
              </LinkText>
            </Message>
            <StyledButton color="purple" height={46} onClick={onDismiss}>
              {MUSIC_NOT_ALLOWED_ERROR_BUTTON_LABEL}
            </StyledButton>
          </ContentWrapper>
        </AccessibleErrorContainer>
      )}
    />
  );
}

const ContentWrapper = styled.div`
  display: grid;
  justify-items: center;
`;

const Title = styled.h3`
  margin: 0;
`;

const Message = styled.span`
  padding: 24px 48px;
  text-align: center;
  font-size: 1.6rem;
  color: #7f8287;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 16px 0;
  }
`;

const StyledButton = styled(Button)`
  width: 45%;
  align-self: center;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    width: 65%;
  }
`;
