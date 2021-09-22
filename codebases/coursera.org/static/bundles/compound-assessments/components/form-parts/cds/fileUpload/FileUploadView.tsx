/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import type { FileUploadSubmissionPartResponse } from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';

import ExternalLinksWrapper from 'bundles/assess-common/components/ExternalLinksWrapper';
import EmbeddedContent from 'bundles/compound-assessments/components/shared/embeddedContent/cds/EmbeddedContent';

import _t from 'i18n!nls/compound-assessments';
import type { Theme } from '@coursera/cds-core';
import { Typography, useTheme } from '@coursera/cds-core';

const styles = {
  noFileMessage: (theme: Theme) => css({ color: theme.palette.gray['700'] }),
};

type Props = {
  submissionPart: FileUploadSubmissionPartResponse;
};

export const FileUploadView: React.FC<Props> = (props: Props) => {
  const { submissionPart } = props;
  const text = submissionPart.title || submissionPart.fileUrl.split('/').pop() || '';
  const theme = useTheme();
  return (
    <ExternalLinksWrapper>
      <Typography variant="body1">{submissionPart.title}</Typography>
      {submissionPart.fileUrl ? (
        <EmbeddedContent url={submissionPart.fileUrl} title={text} />
      ) : (
        <Typography variant="body1" css={styles.noFileMessage(theme)}>
          {_t('No uploaded file')}
        </Typography>
      )}
      <Typography variant="body2">{submissionPart.caption}</Typography>
    </ExternalLinksWrapper>
  );
};

export default FileUploadView;
