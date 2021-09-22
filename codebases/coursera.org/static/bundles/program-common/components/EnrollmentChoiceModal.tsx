/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/react';
import { useTheme, Theme, Typography } from '@coursera/cds-core';
import Modal from 'bundles/phoenix/components/Modal';
import 'css!./__styles__/EnrollmentChoiceModal';

type PropsForBody = {
  headerTitle: string;
  children?: React.ReactNode;
  button?: JSX.Element;
};

type PropsFromCaller = {
  onClose: () => void;
} & PropsForBody;

type Props = PropsFromCaller;

const styles = {
  header: (theme: Theme) => ({
    backgroundColor: theme.palette.blue[900],
    padding: theme.spacing(48, 48, 32, 48),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(48, 16, 24, 16),
    },
  }),
  body: {
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
  },
  footer: (theme: Theme) => ({
    margin: theme.spacing(32, 48, 48, 48),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(8, 16, 16, 16),
    },
  }),
};

export const EnrollmentChoiceModalBody = ({ headerTitle, children, button }: PropsForBody) => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <div css={styles.header(theme)} id="EnrollmentChoiceModal-Title">
        <Typography variant="d2" color="invertBody">
          {headerTitle}
        </Typography>
      </div>
      <div css={styles.body}>{children}</div>
      <div css={styles.footer(theme)}>{button}</div>
    </React.Fragment>
  );
};

const EnrollmentChoiceModal = ({ onClose, headerTitle, children, button }: Props) => (
  <Modal
    className="EnrollmentChoiceModal"
    modalName={headerTitle}
    labelledById="EnrollmentChoiceModal-Title"
    handleClose={onClose}
  >
    <EnrollmentChoiceModalBody headerTitle={headerTitle} button={button}>
      {children}
    </EnrollmentChoiceModalBody>
  </Modal>
);

export default EnrollmentChoiceModal;
