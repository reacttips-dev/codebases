/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';

import user from 'js/lib/user';

import localStorage from 'js/lib/coursera.store';

import Modal from 'bundles/phoenix/components/Modal';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import PartnerHelpLink from 'bundles/authoring/common/components/PartnerHelpLink';

import { Typography, Grid, Button, Checkbox } from '@coursera/cds-core';
import type { Theme } from '@coursera/cds-core';

import _t from 'i18n!nls/course-staff-impersonation';

const PARTNER_HELP_LINK_ID_ACT_AS_LEARNER = '';

type Props = {
  onConfirm: () => void;
  onClose: () => void;
};

const styles = {
  footerButton: (theme: Theme) =>
    css({
      marginRight: theme.spacing(16),
    }),
  message: (theme: Theme) =>
    css({
      marginTop: theme.spacing(12),
      marginBottom: theme.spacing(64),
    }),
};

export const ActAsLearnerConfirmationModal: React.FunctionComponent<Props> = ({ onClose, onConfirm }) => {
  const [checked, setChecked] = useState(false);

  const { display_name: currentUserName } = user.get();

  const handleStartSession = () => {
    if (checked) {
      localStorage.set('aal_hide_confirmation', checked);
    }
    onConfirm();
  };

  return (
    <Modal modalName="Act as Learner Confirmation Modal" handleClose={onClose} data-e2e="act-as-confirmation-modal">
      <Typography variant="h1semibold" css={(theme: Theme) => ({ marginBottom: theme.spacing(24) })}>
        <FormattedMessage message={_t(`Take action as {currentUserName}`)} currentUserName={currentUserName} />
      </Typography>

      <Typography variant="body1" css={(theme: Theme) => ({ marginBottom: theme.spacing(24) })}>
        <FormattedMessage
          message={_t(`When you take action as {currentUserName}, you will:`)}
          currentUserName={currentUserName}
        />

        <ul
          css={(theme: Theme) => ({
            marginTop: theme.spacing(16),
            marginBottom: theme.spacing(16),
          })}
        >
          <li>{_t(`Be able to start an assignment or quiz`)}</li>
          <li>{_t(`Affect the learner you're viewing`)}</li>
        </ul>

        <div css={(theme: Theme) => ({ marginBottom: theme.spacing(16) })}>
          {_t(`When the learner logs in, they'll see their activity updated with the actions you've taken.`)}
        </div>

        <FormattedMessage
          message={_t(`Want to view only as a learner? Select View only from the dropdown. {learnMoreLink}`)}
          learnMoreLink={<PartnerHelpLink articleId={PARTNER_HELP_LINK_ID_ACT_AS_LEARNER} />}
        />
      </Typography>

      <Grid container={true} direction="row" spacing={0}>
        <Grid item xs={6} sm={6}>
          <Checkbox
            aria-label={_t(`Don't show again`)}
            checked={checked}
            label={_t(`Don't show again`)}
            value="agree"
            onChange={() => setChecked(!checked)}
          />
        </Grid>

        <Grid container item xs={6} sm={6} justifyContent="flex-end">
          <Button variant="secondary" size="medium" onClick={onClose} css={styles.footerButton}>
            {_t('Cancel')}
          </Button>
          <Button variant="primary" size="medium" onClick={handleStartSession}>
            {_t('Start')}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ActAsLearnerConfirmationModal;
