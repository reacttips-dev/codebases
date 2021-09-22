/** @jsx jsx */
import React from 'react';
import gql from 'graphql-tag';
import Naptime from 'bundles/naptimejs';
import _ from 'lodash';
import waitForGraphQL from 'js/lib/waitForGraphQL';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography, useTheme, Grid } from '@coursera/cds-core';
import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import type { Theme } from '@coursera/cds-core';
import _t from 'i18n!nls/course-home';
import type {
  CoursesV1SlugQuery,
  CoursesV1SlugQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/CoursesV1';

import MyFeedbackV1 from 'bundles/naptimejs/resources/myFeedback.v1';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import CourseRating from 'bundles/content-feedback/components/CourseRating';
import { compose } from 'recompose';

type PropsFromCaller = {
  courseId: string;
  courseSlug: string;
};

type PropsFromGraphql = {
  course: CoursesV1;
};

type PropsFromNaptime = {
  myRatingFeedback: Array<$TSFixMe>;
};

type Props = PropsFromCaller & PropsFromGraphql & PropsFromNaptime;

const styles = {
  root: (theme: Theme) =>
    css({
      textAlign: 'center',
      position: 'relative',
      background: theme.palette.white,
      border: `1px solid ${theme.palette.gray[300]}`,
    }),
  contents: (theme: Theme) =>
    css({
      minHeight: '50px',
      margin: theme.spacing(8, 0, 8, 0),
      padding: theme.spacing(24, 24, 24, 24),
    }),
  blueRateBody: css({
    display: 'flex',
    alignItems: 'center',
  }),
};

const CompletedCourseRating: React.VFC<Props> = (props) => {
  const theme = useTheme();
  const { course, myRatingFeedback } = props;

  const existingRatingFeedback = {
    ratingFeedback:
      _.isEmpty(myRatingFeedback) || myRatingFeedback === undefined
        ? new RatingFeedback(0, false, '', '', '')
        : new RatingFeedback(
            myRatingFeedback[0].rating.value,
            myRatingFeedback[0].rating.active,
            myRatingFeedback[0].comments.generic,
            myRatingFeedback[0].timestamp,
            myRatingFeedback[0].id
          ),
  };

  return (
    <div css={styles.root(theme)}>
      <Grid container direction="row" justify="space-between" css={styles.contents(theme)} item>
        <Grid item>
          <Typography component="h2" variant="h2semibold">
            {_t('Rate this course')}
          </Typography>
        </Grid>
        <Grid item css={styles.blueRateBody}>
          <Typography
            component="span"
            variant="h4bold"
            css={css`
              color: ${theme.palette.blue[600]};
              margin: ${theme?.spacing(0, 16, 0, 0)};
            `}
          >
            {_t('Rate this course')}
          </Typography>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message */}
          <CourseRating course={course} ratingFeedback={existingRatingFeedback.ratingFeedback} />
        </Grid>
      </Grid>
    </div>
  );
};

export default compose<Props, PropsFromCaller>(
  waitForGraphQL<{ courseSlug: string }, CoursesV1SlugQuery, CoursesV1SlugQueryVariables, {}>(
    gql`
      query CompletedCourseRatingQuery($slug: String!) {
        CoursesV1 @naptime {
          slug(slug: $slug, showHidden: true) {
            elements {
              id
              name
              slug
              courseType
            }
          }
        }
      }
    `,
    {
      options: ({ courseSlug }) => ({
        variables: {
          slug: courseSlug,
        },
      }),
      props: ({ data }) => ({
        course: data?.CoursesV1?.slug?.elements?.[0],
      }),
    }
  ),
  Naptime.createContainer(({ courseId }: PropsFromCaller) => {
    return {
      myRatingFeedback: MyFeedbackV1.finder('byCourseAndFeedback', {
        params: {
          courseIds: courseId,
          feedbackSystem: 'STAR',
        },
      }),
    };
  })
)(CompletedCourseRating);
