import { UrlSubmissionPartResponse } from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';

import React from 'react';

import EmbeddedContent from 'bundles/compound-assessments/components/shared/embeddedContent/EmbeddedContent';

import ExternalLinksWrapper from 'bundles/assess-common/components/ExternalLinksWrapper';

type Props = {
  submissionPart: UrlSubmissionPartResponse;
};

export const UrlView: React.SFC<Props> = (props: Props) => {
  const { submissionPart } = props;
  return (
    <ExternalLinksWrapper>
      <EmbeddedContent url={submissionPart.url} title={submissionPart.title || submissionPart.url} />
      <div>{submissionPart.caption}</div>
    </ExternalLinksWrapper>
  );
};

export default UrlView;
