import React from 'react';
import CenteredLoadingSpinner from 'bundles/assess-common/components/CenteredLoadingSpinner';
import _t from 'i18n!nls/ondemand';
import initBem from 'js/lib/bem';
import { Button } from '@coursera/coursera-ui';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import SimilarityChecks from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';
import PlagiarismDetectionPart from 'bundles/compound-assessments/components/plagiarism-detection/PlagiarismDetectionPart';

import 'css!./__styles__/PlagiarismDetectionContainerV2';

const bem = initBem('PlagiarismDetectionContainerV2');

export const ASSIGNMENT_TYPES = {
  STAFF: 'STAFF',
  PEER: 'PEER',
} as const;

type AssignmentType = typeof ASSIGNMENT_TYPES[keyof typeof ASSIGNMENT_TYPES];

export type Props = {
  courseId: string;
  itemId: string;
  authorId: number;
  assignmentType: AssignmentType;
  responseId: string;
  hasContent?: boolean;
  hasUnsavedChanges?: boolean;
};

type State = {
  // The state here is to prevent plagiarism detection read request from being made
  // since you cannot do a read without submit for checking.
  isNewContent: boolean;
};

class PlagiarismDetectionContainerV2 extends React.Component<Props, State> {
  state: State = {
    isNewContent: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    const { hasContent } = this.props;
    if (nextProps.hasContent && !hasContent) {
      this.setState({
        isNewContent: true,
      });
    } else if (!nextProps.hasContent && hasContent) {
      this.setState({
        isNewContent: false,
      });
    }
  }

  render() {
    const { courseId, itemId, authorId, assignmentType, responseId, hasContent, hasUnsavedChanges } = this.props;
    const { isNewContent } = this.state;

    const questionResponseId = tupleToStringKey([assignmentType, responseId]);

    const isDisabled = !hasContent || hasUnsavedChanges;

    return (
      <div className={bem()}>
        <div className={bem('title', '', ['label-text', 'color-secondary-text'])}>{_t('Plagiarism Detection')}</div>
        <div className={bem('description', '', ['color-secondary-text'])}>
          <p>{_t('All submissions for this assessment will be checked for plagiarism.')}</p>
          {hasUnsavedChanges && (
            <p>{_t('Save a draft of your assignment to check your similarity score before submission.')}</p>
          )}
        </div>
        {isDisabled ? (
          <OverlayTrigger
            placement="bottom"
            delay={100}
            overlay={
              <Tooltip id="PlagiarismDetectionButtonToolTip">
                {hasUnsavedChanges ? _t('Assignment has unsaved changes') : _t('No assignment detected')}
              </Tooltip>
            }
          >
            <div className={bem('check-button-container')}>
              <Button type="secondary" label={_t('Check for Plagiarism')} size="sm" disabled={true} />
            </div>
          </OverlayTrigger>
        ) : (
          <SimilarityChecks
            courseId={courseId}
            authorId={authorId}
            itemId={itemId}
            questionResponseId={questionResponseId}
            skip={isNewContent}
          >
            {({ similarityChecksData, refetchReport, submitForCheck, loading }) => {
              if (loading) {
                return <CenteredLoadingSpinner />;
              }

              const { result, status } = similarityChecksData || {};

              if (!result && !status) {
                // 204 no content
                // returned when check for plagiarism has not been requested
                // or when isNewContent is true(query would be skipped)
                return (
                  <Button type="secondary" label={_t('Check for Plagiarism')} size="sm" onClick={submitForCheck} />
                );
              }

              if (!status) {
                // status should always be returned if it is a 200
                return <CenteredLoadingSpinner />;
              }

              return <PlagiarismDetectionPart result={result} status={status} refetch={refetchReport} />;
            }}
          </SimilarityChecks>
        )}
      </div>
    );
  }
}

export default PlagiarismDetectionContainerV2;
