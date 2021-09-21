import React from 'react';
import BootstrapModal from 'react-bootstrap/lib/Modal';
import { css } from 'emotion';
import { Button } from '../../../../shared/Button/NewButton';

type Button = {
  copy: string;
  onClick: () => void;
  isDisabled?: boolean;
  ariaLabel?: string;
};

export function Modal({
  children,
  primaryButton,
  secondaryButton,
  handleClose,
  backdropClassName,
}: {
  children: React.ReactNode;
  primaryButton: Button;
  secondaryButton?: Button;
  handleClose: () => void;
  backdropClassName?: string;
}) {
  return (
    <BootstrapModal
      show={true}
      onHide={handleClose}
      backdropClassName={backdropClassName}
      dialogClassName={css`
        .modal-content {
          padding: 32px 40px;
          min-height: 212px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        p {
          font-size: 1.6rem;
          color: #5f6368;
          margin: 0;
        }
      `}
    >
      <div>{children}</div>
      <div
        className={css`
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        `}
      >
        {secondaryButton && (
          <Button
            type="button"
            color="white"
            onClick={secondaryButton.onClick}
            className={css`
              margin-right: 16px;
              min-width: 66px;
            `}
            isDisabled={secondaryButton.isDisabled}
            ariaLabel={secondaryButton.ariaLabel}
          >
            {secondaryButton.copy}
          </Button>
        )}
        <Button
          type="button"
          color="purple"
          onClick={primaryButton.onClick}
          className={css`
            min-width: 66px;
          `}
          isDisabled={primaryButton.isDisabled}
          ariaLabel={primaryButton.ariaLabel}
        >
          {primaryButton.copy}
        </Button>
      </div>
    </BootstrapModal>
  );
}
