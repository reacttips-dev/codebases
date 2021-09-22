/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { Typography } from '@coursera/cds-core';
import Modal from 'bundles/ui/components/cds/Modal';
import ModalButtonFooter from 'bundles/authoring/common/modals/cds/ModalButtonFooter';

import type { Theme } from '@coursera/cds-core';

type Props = {
  title: React.ReactNode;
  content: React.ReactNode;
  primaryButtonContents: string;
  cancelButtonContents?: string;
  hideCancelButton?: boolean;
  onCancelButtonClick: () => void;
  onPrimaryButtonClick: () => void;
};

const styles = {
  title: (theme: Theme) =>
    css({
      margin: theme.spacing(12, 0, 32),
    }),
  content: (theme: Theme) =>
    css({
      p: {
        marginBottom: theme.spacing(12),
      },
    }),
};

const AssessmentModalLayout = ({
  title,
  content,
  onCancelButtonClick,
  onPrimaryButtonClick,
  primaryButtonContents,
  cancelButtonContents,
  hideCancelButton,
}: Props) => {
  return (
    <Modal onRequestClose={onCancelButtonClick} size="large">
      {title && (
        <Typography variant="h1semibold" css={styles.title}>
          {title}
        </Typography>
      )}
      {content && (
        <Typography variant="body1" css={styles.content}>
          {content}
        </Typography>
      )}
      <ModalButtonFooter
        onPrimaryButtonClick={onPrimaryButtonClick}
        onCancelButtonClick={hideCancelButton ? undefined : onCancelButtonClick}
        primaryButtonContents={primaryButtonContents}
        cancelButtonContents={cancelButtonContents}
      />
    </Modal>
  );
};

export default AssessmentModalLayout;
