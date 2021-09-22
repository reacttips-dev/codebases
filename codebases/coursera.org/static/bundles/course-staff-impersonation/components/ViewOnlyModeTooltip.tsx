/** @jsx jsx */
import React, { useState } from 'react';
import { jsx, css } from '@emotion/react';

import localStorage from 'js/lib/coursera.store';

import { Grid, Typography, Checkbox, Button } from '@coursera/cds-core';
import type { Theme } from '@coursera/cds-core';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/course-staff-impersonation';

type Props = {
  learnerName: string;
  isActAsLearnerEditModeEnabled: boolean;
  onClose: () => void;
  aalSessionId: number;
};

const styles = {
  arrow: (theme: Theme) => css`
    position: absolute;
    top: 50px;
    left: -340px;
    z-index: 10001;
    padding: ${theme.spacing(48)};
    background-color: ${theme.palette.white};
    width: 585px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 281px;
      bottom: 100%;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: ${theme.palette.white};
    }
  `,
  overlay: (theme: Theme) => css`
    background-color: ${theme.palette.black[500]};
    opacity: 0.5;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    z-index: 10000;
  `,
};

const ViewOnlyModeTooltip: React.FC<Props> = ({
  learnerName,
  onClose,
  isActAsLearnerEditModeEnabled,
  aalSessionId,
}) => {
  const [shouldHideTooltip, setShouldHideTooltip] = useState<boolean>(false);

  const handleClose = () => {
    localStorage.set('aal_hide_view_only_tooltip', shouldHideTooltip);
    localStorage.set('aal_hide_view_only_tooltip_session', aalSessionId);
    onClose();
  };

  return (
    <div>
      <Grid direction="column" role="tooltip" css={styles.arrow}>
        <Typography variant="h1semibold" css={(theme: Theme) => ({ marginBottom: theme.spacing(24) })}>
          {_t(`You’re now in view-only mode`)}
        </Typography>

        <Typography variant="body1" css={(theme: Theme) => ({ marginBottom: theme.spacing(24) })}>
          <FormattedMessage message={_t(`While you’re acting as {learnerName}:`)} learnerName={learnerName} />

          <ul
            css={(theme: Theme) => ({
              marginTop: theme.spacing(16),
              marginBottom: isActAsLearnerEditModeEnabled ? theme.spacing(16) : theme.spacing(0),
            })}
          >
            <li>{_t(`Your actions won't affect the learner you're viewing`)}</li>
            <li>{_t(`You won’t be able to start an assignment or quiz`)}</li>
          </ul>

          {isActAsLearnerEditModeEnabled && (
            <span>{_t(`Want to take action as a learner? Select "Take action" from the dropdown. Learn More`)}</span>
          )}
        </Typography>

        <Checkbox
          onChange={() => setShouldHideTooltip(!shouldHideTooltip)}
          key="hideTooltip"
          label={_t(`Don't show again`)}
          checked={shouldHideTooltip}
          css={(theme: Theme) => ({ marginBottom: theme.spacing(32) })}
        />

        <Grid>
          <Button variant="primary" onClick={handleClose}>
            {_t(`Okay`)}
          </Button>
        </Grid>
      </Grid>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div css={styles.overlay} onClick={handleClose} role="presentation" />
    </div>
  );
};

export default ViewOnlyModeTooltip;
