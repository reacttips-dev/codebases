/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import _t from 'i18n!nls/course-home';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import type { RecommendedCourse } from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseRecommended';
import { Typography, useTheme, Grid, Link } from '@coursera/cds-core';
import { StarRating, TextTruncate } from '@coursera/coursera-ui';

type Props = {
  recommendedCourse: RecommendedCourse;
  replaceCustomContent: ReplaceCustomContentType;
  isCourseS12n?: {};
  s12nCourseName?: string;
};

const CourseRecommendedWithRatings: React.FC<Props> = ({ recommendedCourse, isCourseS12n, s12nCourseName }) => {
  const theme = useTheme();
  const starRatingProps = {
    enableColorOpacity: true,
    a11yIdentifier: 'CourseRecommendation',
    starSpacing: 5,
  };

  const courseRecPath =
    recommendedCourse.courseCompleteRecommendation?.[
      'org.coursera.ondemand.courseRecommendation.GeneralCourseRecommendation'
    ];

  const recommendedCourseData = courseRecPath?.courses.slice(0, 3);
  const cardTitle = isCourseS12n
    ? _t(
        `You’ve completed the #{s12nCourseName} specialization! Based on the skills you learned, you may find these courses helpful`,
        { s12nCourseName }
      )
    : _t('Based on the skills you learned, you may find these courses helpful');

  return (
    <div
      css={css`
        padding: ${theme.spacing(16)};
      `}
    >
      <Typography
        variant="h2semibold"
        css={css`
          margin-bottom: ${theme.spacing(16)};
        `}
      >
        {_t('#{cardTitle}', { cardTitle })}
      </Typography>
      <Grid container spacing={24}>
        {recommendedCourseData?.map((item) => (
          <Fragment key={item.courseId}>
            <Grid item>
              {item.courseLogoUrl ? (
                <img
                  src={item.courseLogoUrl}
                  height={72}
                  width={72}
                  alt={_t(`#{courseName}`, {
                    courseName: item.courseName,
                  })}
                />
              ) : (
                <div
                  css={css`
                    width: 72px;
                    height: 72px;
                    background: ${theme.palette.gray[400]};
                  `}
                />
              )}
            </Grid>
            <Grid item xs={8} sm>
              <Link
                href={`/learn/${item.courseSlug}/home/welcome`}
                variant="quiet"
                typographyVariant="h3semibold"
                iconPosition="after"
                target="_blank"
              >
                <TextTruncate text={item.courseName} />
              </Link>

              <Typography
                variant="body2"
                color="supportText"
                css={css`
                  margin-top: ${theme.spacing(4)};
                `}
              >
                <TextTruncate text={item.partnerName} />
              </Typography>
              <div
                css={css`
                  svg {
                    height: 17px !important;
                    width: 17px !important;
                  }
                `}
              >
                <StarRating {...{ ...starRatingProps, rating: item.courseRating }} />
              </div>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </div>
  );
};

export default CourseRecommendedWithRatings;
