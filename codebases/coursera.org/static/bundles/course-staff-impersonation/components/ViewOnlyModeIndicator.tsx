/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { Typography, Grid } from '@coursera/cds-core';
import { LockOneIcon } from '@coursera/cds-icons';
import type { Theme } from '@coursera/cds-core';

import _t from 'i18n!nls/course-staff-impersonation';

const styles = {
  indicator: (theme: Theme) => css`
    width: 100px;
    padding: ${theme.spacing(4)};
    margin-left: ${theme.spacing(12)};
    display: inline-flex;
    background: ${theme.palette.gray[100]};
    border-radius: ${theme.spacing(4)};
    position: relative;
  `,
};

export const ViewOnlyModeIndicator: React.FunctionComponent<{}> = () => {
  return (
    <Grid container={true} direction="row" alignItems="center" alignContent="center" css={styles.indicator}>
      <LockOneIcon css={(theme: Theme) => ({ marginRight: theme.spacing(8) })} />
      <Typography variant="h4bold">{_t('View Only')}</Typography>
    </Grid>
  );
};

export default ViewOnlyModeIndicator;
