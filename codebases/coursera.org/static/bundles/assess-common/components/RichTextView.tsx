import { RichTextSubmissionPart } from 'bundles/assess-common/types/NaptimeSubmission';

import React from 'react';

import Content from 'bundles/phoenix/components/Content';

import ExternalLinksWrapper from './ExternalLinksWrapper';

const RichTextView = ({ submissionPart }: { submissionPart: RichTextSubmissionPart }) => (
  <ExternalLinksWrapper>
    <Content content={submissionPart.richText} assumeStringIsHtml />
  </ExternalLinksWrapper>
);

export default RichTextView;
