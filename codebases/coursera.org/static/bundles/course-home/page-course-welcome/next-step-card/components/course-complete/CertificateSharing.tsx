/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';

import { Button, useTheme, Grid } from '@coursera/cds-core';
import type { ButtonProps } from '@coursera/cds-core';
import { DownloadIcon, ShareIcon } from '@coursera/cds-icons';

import withSingleTracked from 'bundles/common/components/withSingleTracked';

import ShareButtonWithModal from 'bundles/sharing-common/components/modal/ShareButtonWithModal';

import getSocialCaptions from 'bundles/accomplishments/utils/getSocialCaptions';

import _t from 'i18n!nls/course-home';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })<
  ButtonProps & {
    href: string;
    'data-e2e': string;
    target: string;
  }
>(Button);

type Props = {
  specializationDownloadText: string;
  productName: string;
  partnerName: string;
  shareLink?: string;
  certificatePdfLink: string;
  utmProductParam?: string;
  specializationPdfLink?: string;
  specializationCertAvailable: boolean;
};
const CertificateSharing = ({
  productName,
  partnerName,
  certificatePdfLink,
  utmProductParam,
  shareLink,
  specializationPdfLink = '',
  specializationCertAvailable,
  specializationDownloadText,
}: Props) => {
  const theme = useTheme();

  return (
    <Fragment>
      <Grid>
        <ShareButtonWithModal
          rootClassName="rc-CertificateSharing__share-button"
          shareLink={shareLink}
          utmContentParam="cert_image"
          utmMediumParam="certificate"
          utmCampaignParam="sharing_cta"
          utmProductParam={utmProductParam}
          captions={getSocialCaptions({ productName, partnerName })}
          useCustomUrl
        >
          <Button
            variant="primary"
            icon={<ShareIcon />}
            iconPosition="before"
            css={css`
              margin: ${theme.spacing(0, 16, 24, 0)};
            `}
          >
            {_t('Share Certificate')}
          </Button>
        </ShareButtonWithModal>
        {specializationCertAvailable ? (
          <TrackedButton
            trackingName="specialization_certificate_sharing_download_button"
            icon={<DownloadIcon />}
            iconPosition="before"
            variant="secondary"
            component="a"
            href={specializationPdfLink}
            data-e2e="specialization_certificate-pdf-link"
            target="_blank"
            css={css`
              max-width: max-content;
              margin-bottom: ${theme.spacing(24)};
            `}
          >
            {_t('Download specialization certificate')}
          </TrackedButton>
        ) : (
          <TrackedButton
            trackingName="certificate_sharing_download_button"
            icon={<DownloadIcon />}
            iconPosition="before"
            variant="secondary"
            component="a"
            href={certificatePdfLink}
            data-e2e="certificate-pdf-link"
            target="_blank"
            css={css`
              margin-bottom: ${theme.spacing(24)};
            `}
          >
            {_t('Download certificate')}
          </TrackedButton>
        )}
      </Grid>
      {specializationCertAvailable && (
        <TrackedButton
          trackingName="certificate_sharing_download_button"
          variant="ghost"
          component="a"
          href={certificatePdfLink}
          data-e2e="certificate-pdf-link"
          target="_blank"
          css={css`
            padding: ${theme.spacing(0)};
            margin: ${theme.spacing(0, 8, 0)};
          `}
        >
          {specializationDownloadText}
        </TrackedButton>
      )}
    </Fragment>
  );
};

export default CertificateSharing;
