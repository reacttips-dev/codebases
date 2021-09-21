/** @jsx jsx */

import { css, Global, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Button } from '../Button/NewButton';
import { Modal } from '../Modal';

/**
 * Provide onClickContinue only if you would like the main purple button to do
 * something else than the X close button. Otherwise, both will call onClose.
 */
export function ConfirmationModal({
  title,
  confirmationCopy,
  onClickClose,
  onClickContinue,
  children,
  imageContent,
  isShowing = true,
}: {
  title: string;
  confirmationCopy?: string;
  onClickClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  isShowing?: boolean;
  onClickContinue?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  imageContent?: ReactNode;
}) {
  return (
    <Modal
      isShowing={isShowing}
      isShowingCloseButton={true}
      onClickClose={onClickClose}
      renderContent={() => (
        <ModalContent>
          {imageContent && <ModalImage>{imageContent}</ModalImage>}
          <ModalTitle>{title}</ModalTitle>
          {children}
          {confirmationCopy && (
            <Button
              kind="button"
              onClick={onClickContinue || onClickClose}
              color="purple"
              css={css`
                width: 294px;
              `}
            >
              {confirmationCopy}
            </Button>
          )}
          <Global
            styles={css`
              .modal-content p {
                font-size: 1.6rem;
                color: #5f6369;
                margin-bottom: 40px;
              }
            `}
          />
        </ModalContent>
      )}
    />
  );
}

const ModalTitle = styled.h3`
  margin: 0 auto;
  padding-bottom: 30px;
  font-size: 2.2rem;
  width: 80%;
`;

const ModalContent = styled.div`
  text-align: center;
  padding: 8px;
`;

const ModalImage = styled.div`
  margin-bottom: 30px;
`;
