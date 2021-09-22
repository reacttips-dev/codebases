/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import type { FileUploadSubmissionPartResponse } from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';

import { Caption, color } from '@coursera/coursera-ui';
import ExternalLinksWrapper from 'bundles/assess-common/components/ExternalLinksWrapper';
import EmbeddedContent from 'bundles/compound-assessments/components/shared/embeddedContent/EmbeddedContent';

import _t from 'i18n!nls/compound-assessments';

const styles = {
  // TODO (jcheung) replace with CDS color for #666666, closest CUI color is disabledThemeDark
  noFileMessage: css({ color: color.disabledThemeDark }),
};

type Props = {
  submissionPart: FileUploadSubmissionPartResponse;
};

export const FileUploadView: React.FC<Props> = (props: Props) => {
  const { submissionPart } = props;
  const text = submissionPart.title || submissionPart.fileUrl.split('/').pop() || '';

  return (
    <ExternalLinksWrapper>
      <div>{submissionPart.title}</div>
      {submissionPart.fileUrl ? (
        <EmbeddedContent url={submissionPart.fileUrl} title={text} />
      ) : (
        <div css={styles.noFileMessage}>{_t('No uploaded file')}</div>
      )}
      <Caption>{submissionPart.caption}</Caption>
    </ExternalLinksWrapper>
  );
};

export default FileUploadView;
