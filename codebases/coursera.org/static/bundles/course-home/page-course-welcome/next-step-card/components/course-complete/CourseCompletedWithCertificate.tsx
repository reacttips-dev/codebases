/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';
import _t from 'i18n!nls/course-home';

import { Typography, useTheme, Grid } from '@coursera/cds-core';

import { formatPartnerNames } from 'bundles/accomplishments/utils/formatting';
import { getCertificateSharingLink } from 'bundles/accomplishments/utils/routingUtils';

import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';

import type {
  GradeMetadataI,
  CertificateMetadataI,
} from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { roundGradeValue } from 'bundles/course-home/utils/numberFormat';
import { formatDateTimeDisplay, LONG_DATE_ONLY_DISPLAY } from 'js/utils/DateTimeUtils';
import CertificateSharing from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CertificateSharing';
import SVGCertificateTrophy from './SVGCertificateTrophy';

type Props = {
  gradeMetadata?: GradeMetadataI;
  certificateMetadata?: CertificateMetadataI;
  s12n?: {
    courseIds: Array<string>;
  };
  partnerNames: Array<string>;
  replaceCustomContent: ReplaceCustomContentType;
  courseName: string;
};

const CourseCompletedWithCertificate: React.FC<Props> = ({
  gradeMetadata = {} as GradeMetadataI,
  certificateMetadata = {} as CertificateMetadataI,
  s12n,
  replaceCustomContent,
  partnerNames = [],
  courseName,
}) => {
  const theme = useTheme();
  const { grade, completedAt } = gradeMetadata;
  const {
    courseCertificatePreviewImageUrl,
    courseCertificateVerifyCode,
    specializationCertificateVerifyCode,
    specializationCertificatePreviewImageUrl,
  } = certificateMetadata;
  const specializationCertAvailable = !!s12n && !!specializationCertificatePreviewImageUrl;

  return (
    <Fragment>
      <Grid container justify="space-between">
        <Grid
          sm={6}
          lg={4}
          css={css`
            padding-top: ${theme.spacing(specializationCertAvailable ? 8 : 0)};
          `}
          item
        >
          <img
            src={courseCertificatePreviewImageUrl}
            alt={_t(
              'View certificate for, #{courseName}, an online non-credit #{course} authorized by #{universityNames} and offered through Coursera',
              {
                courseName,
                universityNames: formatPartnerNames(partnerNames),
              }
            )}
            width="264"
            height="200"
          />
        </Grid>
        <Grid
          item
          sm={6}
          lg={8}
          css={css`
            padding: ${theme.spacing(specializationCertAvailable ? 0 : 16, 16, 0, 16)};
          `}
        >
          <Grid container alignItems="center" wrap="nowrap">
            <SVGCertificateTrophy />
            <Typography
              component="h2"
              variant="h2semibold"
              css={css`
                margin: ${theme.spacing(0, 0, 8, 12)};
              `}
            >
              {_t('Congratulations on getting your certificate!')}
            </Typography>
          </Grid>

          <Typography
            variant="body1"
            css={css`
              margin: ${theme.spacing(8, 0)};
            `}
          >
            {completedAt && (
              <FormattedMessage
                message={replaceCustomContent(_t('You completed this #{course} on {date}'), { returnsString: true })}
                date={formatDateTimeDisplay(completedAt, LONG_DATE_ONLY_DISPLAY)}
              />
            )}
          </Typography>
          <Typography
            variant="body2"
            color="supportText"
            css={css`
              margin-bottom: ${theme.spacing(16)};
            `}
          >
            {grade && <FormattedMessage message={_t('Grade received: {grade}%')} grade={roundGradeValue(grade)} />}
          </Typography>

          <CertificateSharing
            productName={courseName}
            partnerName={formatPartnerNames(partnerNames)}
            certificatePdfLink={getCertificateSharingLink(false, courseCertificateVerifyCode)}
            specializationPdfLink={
              specializationCertificateVerifyCode &&
              getCertificateSharingLink(true, specializationCertificateVerifyCode)
            }
            specializationDownloadText={replaceCustomContent(_t('Download #{course} certificate instead'), {
              returnsString: true,
            })}
            specializationCertAvailable={specializationCertAvailable}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default CourseCompletedWithCertificate;
