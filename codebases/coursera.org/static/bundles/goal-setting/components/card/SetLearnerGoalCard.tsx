import React from 'react';

import _t from 'i18n!nls/goal-setting';
import { Grid, Button, Typography } from '@coursera/cds-core';

type Props = {
  onSetGoal: () => void;
};

const SetLearnerGoalCard: React.FC<Props> = ({ onSetGoal }) => (
  <Grid container direction="row" justify="space-between" alignItems="flex-start">
    <Grid item xs={8}>
      <Typography variant="h2semibold">{_t('My Weekly Goal')}</Typography>
      <Typography variant="body1">
        {_t('Learners who set a goal are 75% more likely to complete the course. We’ll help you track your progress.')}
      </Typography>
    </Grid>
    <Grid item>
      <Button size="small" variant="secondary" onClick={onSetGoal}>
        {_t('Set goal')}
      </Button>
    </Grid>
  </Grid>
);

export default SetLearnerGoalCard;
