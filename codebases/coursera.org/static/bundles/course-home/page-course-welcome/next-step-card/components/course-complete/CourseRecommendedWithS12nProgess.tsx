/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import { TextTruncate } from '@coursera/coursera-ui';

import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import type { RecommendedCourse } from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseRecommended';
import _t from 'i18n!nls/course-home';
import { Typography, useTheme, Grid, Link } from '@coursera/cds-core';

import { SuccessFilledIcon } from '@coursera/cds-icons';

type Props = {
  recommendedCourse: RecommendedCourse;
  replaceCustomContent: ReplaceCustomContentType;
};

const CourseRecommendedWithS12nProgess: React.FC<Props> = ({ recommendedCourse, replaceCustomContent }) => {
  const theme = useTheme();

  const courseRecPath =
    recommendedCourse.courseCompleteRecommendation?.[
      'org.coursera.ondemand.courseRecommendation.S12nNextCourseRecommendation'
    ];

  return (
    <div
      css={css`
        padding: ${theme.spacing(24)};
      `}
    >
      <Typography
        variant="h2semibold"
        css={css`
          margin-bottom: ${theme.spacing(16)};
        `}
      >
        {replaceCustomContent(
          _t('Next #{course} in #{parentName}', { parentName: courseRecPath?.relatedS12nMetadata?.name }),
          { returnsString: true }
        )}
      </Typography>
      <Grid container spacing={24}>
        <Grid item>
          {courseRecPath?.courseLogoUrl ? (
            <img
              src={courseRecPath?.courseLogoUrl}
              height={92}
              width={92}
              alt={_t(`#{courseName}`, {
                courseName: courseRecPath?.courseName,
              })}
            />
          ) : (
            <div
              css={css`
                width: 92px;
                height: 92px;
                background: ${theme.palette.gray[400]};
              `}
            />
          )}
        </Grid>
        <Grid item xs={7} sm>
          <Typography
            variant="h3bold"
            css={css`
              margin: ${theme.spacing(4, 0)};
            `}
          >
            {replaceCustomContent(
              _t('#{Course} #{coursePositionInS12n} of #{totalNumberOfCoursesInS12n}', {
                coursePositionInS12n: courseRecPath?.coursePositionInS12n,
                totalNumberOfCoursesInS12n: courseRecPath?.relatedS12nMetadata?.totalNumberOfCoursesInS12n,
              }),
              { returnsString: true }
            )}
          </Typography>
          <Link
            href={`/learn/${courseRecPath?.courseSlug}/home/welcome`}
            variant="quiet"
            typographyVariant="h3semibold"
            iconPosition="after"
            target="_blank"
          >
            <TextTruncate text={courseRecPath?.courseName} />
          </Link>
          <Typography
            variant="body2"
            color="supportText"
            css={css`
              margin-top: ${theme.spacing(4)};
            `}
          >
            {courseRecPath?.partnerName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm>
          <Typography
            variant="h3bold"
            css={css`
              margin: ${theme.spacing(8, 0)};
            `}
          >
            {_t('Your progress in the specialization')}
          </Typography>
          <Grid container spacing={8}>
            {courseRecPath?.relatedS12nMetadata?.s12nCourses?.map((item, index) => {
              let overlayIcon;
              const courseIndex = index + 1;
              if (item.courseProgressState === 'Completed') {
                overlayIcon = <SuccessFilledIcon color="success" size="large" />;
              } else if (item.courseProgressState === 'Started') {
                overlayIcon = (
                  <div
                    css={css`
                      width: 24px;
                      height: 24px;
                      border: 2px solid ${theme.palette.green[700]};
                      box-sizing: border-box;
                      border-radius: 16px;
                      text-align: center;
                    `}
                  >
                    <Typography
                      variant="h4bold"
                      color="success"
                      css={css`
                        line-height: 18px;
                      `}
                    >
                      {courseIndex}
                    </Typography>
                  </div>
                );
              } else {
                overlayIcon = (
                  <div
                    css={css`
                      width: 24px;
                      height: 24px;
                      border: 2px solid ${theme.palette.gray[300]};
                      box-sizing: border-box;
                      border-radius: 16px;
                      text-align: center;
                    `}
                  >
                    <Typography
                      variant="h4bold"
                      color="supportText"
                      css={css`
                        line-height: 18px;
                      `}
                    >
                      {courseIndex}
                    </Typography>
                  </div>
                );
              }

              return (
                <Grid item key={item.courseId}>
                  <OverlayTrigger
                    placement="top"
                    delay={500}
                    overlay={
                      <Tooltip role="tooltip" id={item.courseId}>
                        <div
                          aria-label={_t('#{courseName}', { courseName: item.courseName })}
                          css={css`
                            padding: ${theme.spacing(8)};
                          `}
                        >
                          {_t('#{courseName}', { courseName: item.courseName })}
                        </div>
                      </Tooltip>
                    }
                    trigger={['hover']}
                  >
                    <Link
                      css={css`
                        color: unset !important;
                        text-decoration: unset !important;
                      `}
                      href={`/learn/${item.courseSlug}/home/welcome`}
                      target="_blank"
                    >
                      {overlayIcon}
                    </Link>
                  </OverlayTrigger>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CourseRecommendedWithS12nProgess;
