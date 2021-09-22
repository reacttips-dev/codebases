import React from 'react';
import _ from 'underscore';
import connectToRouter from 'js/lib/connectToRouter';
import redirect from 'js/lib/coursera.redirect';

import { Typography, Grid, Button } from '@coursera/cds-core';

import _t from 'i18n!nls/learning-assistant';
import CelebrationTrophy from 'bundles/learning-assistant/components/CelebrationsTrophy';
import 'css!bundles/learning-assistant/components/__styles__/LearningAssistantCourseCompletedMessage';

type Props = {
  courseSlug: string;
  userHasEarnedCertificate: boolean;
};

const LearningAssistantCourseCompletedMessage: React.FC<Props> = (props) => {
  const { courseSlug, userHasEarnedCertificate } = props;
  const handleViewCertificate = () => {
    return redirect.setLocation(`/learn/${courseSlug}/home/welcome`);
  };

  const message = userHasEarnedCertificate
    ? _t(
        "You passed! That was the last assignment in the course and you've now completed the entire course and earned the certificate!"
      )
    : _t("You've completed this course");

  return (
    <div className="rc-LearningAssistantCourseCompletedMessage">
      <Grid direction="column" justify="flex-start" alignContent="center" container>
        <Grid item>
          <CelebrationTrophy />
        </Grid>
        <Grid item>
          <Typography variant="h1" className="course-complete-header">
            {_t('Congratulations!')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{message}</Typography>
        </Grid>
        <Grid item className="button-wrap">
          <Button variant="primary" size="medium" onClick={handleViewCertificate}>
            {_t('View certificate')}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  }))
)(LearningAssistantCourseCompletedMessage);
