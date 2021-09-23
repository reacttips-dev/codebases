import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Button } from 'client/shared/Button/NewButton';
import { Modal } from 'shared/Modal';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  justify-content: center;

  p {
    margin-bottom: 32px;
  }

  h3 {
    font-weight: 800;
    font-size: 2.4rem;
    line-height: 2.8rem;
  }
`;

const NoTaxiDistributionErrorModal = ({
  onClickClose,
}: {
  onClickClose: () => void;
}) => {
  return (
    <Modal
      isShowing
      isShowingCloseButton
      onClickClose={onClickClose}
      className={css`
        width: 480px;
        margin: auto;
        overflow: hidden;
      `}
      renderContent={() => (
        <Content>
          <h3>This feature is unavailable</h3>
          <p>To unlock this feature, contact support.</p>
          <Button
            color="purple"
            className={css`
              width: 240px;
            `}
            href="https://help.anchor.fm/hc/requests/new?ticket_form_id=360000826772"
            kind="link"
            target="_blank"
          >
            Contact Support
          </Button>
        </Content>
      )}
    />
  );
};

export { NoTaxiDistributionErrorModal };
