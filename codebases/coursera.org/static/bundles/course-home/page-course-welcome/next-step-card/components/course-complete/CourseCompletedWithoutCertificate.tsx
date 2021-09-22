/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import { Typography, useTheme, Grid } from '@coursera/cds-core';
import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import type { GradeMetadataI } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import { roundGradeValue } from 'bundles/course-home/utils/numberFormat';
import { formatDateTimeDisplay, LONG_DATE_ONLY_DISPLAY } from 'js/utils/DateTimeUtils';

import SVGCertificateTrophy from './SVGCertificateTrophy';

type Props = {
  gradeMetadata?: GradeMetadataI;
  replaceCustomContent: ReplaceCustomContentType;
};

const CourseCompletedWithoutCertificate: React.FC<Props> = ({
  gradeMetadata = {} as GradeMetadataI,
  replaceCustomContent,
}) => {
  const theme = useTheme();
  const { grade, completedAt } = gradeMetadata;

  return (
    <Fragment>
      <Grid container alignItems="center" wrap="nowrap">
        <SVGCertificateTrophy />
        <Typography
          component="h2"
          variant="h2semibold"
          css={css`
            margin-left: ${theme?.spacing(12)};
          `}
        >
          {_t('Congratulations on completing your course!')}
        </Typography>
      </Grid>
      <Typography
        variant="body1"
        css={css`
          margin: ${theme?.spacing(12, 0)};
        `}
      >
        {completedAt && (
          <FormattedMessage
            message={replaceCustomContent(_t('You completed this #{course} on {date}'), { returnsString: true })}
            date={formatDateTimeDisplay(completedAt, LONG_DATE_ONLY_DISPLAY)}
          />
        )}
      </Typography>
      <Typography variant="body2" color="supportText">
        {grade && <FormattedMessage message={_t('Grade received: {grade}%')} grade={roundGradeValue(grade)} />}
      </Typography>
    </Fragment>
  );
};

export default CourseCompletedWithoutCertificate;
