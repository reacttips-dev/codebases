/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import _t from 'i18n!nls/learning-assistant';
import { FormattedMessage } from 'react-intl';
import type { Theme } from '@coursera/cds-core';

import { Typography, Grid, useTheme } from '@coursera/cds-core';
import CelebrationTrophy from 'bundles/learning-assistant/components/CelebrationsTrophy';

const styles = {
  root: (theme: Theme) =>
    css({
      padding: theme.spacing(32, 4, 12, 4),
      alignItems: 'center',
    }),
  midSectionContainer: (theme: Theme) =>
    css({
      padding: theme.spacing(12, 0, 12, 0),
    }),
  footerContainer: css({
    textAlign: 'center',
  }),
};

type Props = {
  weekNumber: number;
};

const LastItemInWeekCompletedMessage: React.FC<Props> = ({ weekNumber }) => {
  const theme = useTheme();
  return (
    <div>
      <Grid direction="column" justify="flex-start" alignContent="center" container css={styles.root(theme)}>
        <Grid item>
          <CelebrationTrophy />
        </Grid>
        <Grid item>
          <Typography variant="h1semibold" css={styles.midSectionContainer(theme)}>
            {_t('Way to go!')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" css={styles.footerContainer}>
            <FormattedMessage
              message={_t('You completed the required items for Week {weekNumber}. Keep up the great work!')}
              weekNumber={weekNumber}
            />
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default LastItemInWeekCompletedMessage;
