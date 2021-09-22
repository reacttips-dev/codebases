/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import CenteredLoadingSpinner from 'bundles/assess-common/components/CenteredLoadingSpinner';
import _t from 'i18n!nls/compound-assessments';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import SimilarityChecks from 'bundles/compound-assessments/components/plagiarism-detection/SimilarityChecks';
import PlagiarismDetectionPart from 'bundles/compound-assessments/components/plagiarism-detection/PlagiarismDetectionPart';

import type { Theme } from '@coursera/cds-core';
import { Button, Typography, withTheme } from '@coursera/cds-core';

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
  theme: Theme;
};

type State = {
  // The state here is to prevent plagiarism detection read request from being made
  // since you cannot do a read without submit for checking.
  isNewContent: boolean;
};

const style = {
  root: (theme: Theme) =>
    css({
      padding: theme.spacing(24),
      marginTop: theme.spacing(24),
      backgroundColor: theme.palette.gray['100'],
    }),
  title: css({
    textTransform: 'uppercase',
  }),
  buttonContainer: (theme: Theme) =>
    css({
      marginTop: theme.spacing(12),
    }),
};

export class PlagiarismDetectionContainerV2 extends React.Component<Props, State> {
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
    const { courseId, itemId, authorId, assignmentType, responseId, hasContent, hasUnsavedChanges, theme } = this.props;
    const { isNewContent } = this.state;

    const questionResponseId = tupleToStringKey([assignmentType, responseId]);

    const isDisabled = !hasContent || hasUnsavedChanges;

    return (
      <div css={style.root(theme)}>
        <Typography variant="h4bold" css={style.title}>
          {_t('Plagiarism Detection')}
        </Typography>
        <Typography variant="body1">
          {_t('All submissions for this assessment will be checked for plagiarism.')}
        </Typography>
        {hasUnsavedChanges && (
          <Typography variant="body1">
            {_t('Save a draft of your assignment to check your similarity score before submission.')}
          </Typography>
        )}
        {isDisabled ? (
          <OverlayTrigger
            placement="bottom"
            delay={100}
            overlay={
              <Tooltip id="PlagiarismDetectionButtonToolTip">
                <Typography variant="body1" component="span">
                  {hasUnsavedChanges ? _t('Assignment has unsaved changes') : _t('No assignment detected')}
                </Typography>
              </Tooltip>
            }
          >
            <div css={style.buttonContainer(theme)}>
              <Button variant="secondary" size="small" disabled={true}>
                {_t('Check for Plagiarism')}
              </Button>
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
                  <Button variant="secondary" size="small" onClick={submitForCheck}>
                    {_t('Check for Plagiarism')}
                  </Button>
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

export default withTheme(PlagiarismDetectionContainerV2);
