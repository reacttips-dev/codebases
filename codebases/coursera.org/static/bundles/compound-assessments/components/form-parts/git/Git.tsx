import React from 'react';
import _t from 'i18n!nls/compound-assessments';
import initBem from 'js/lib/bem';

import GitRepoLauncher from 'bundles/git/components/repo-launcher/GitRepoLauncher';
import { AssignmentRole } from 'bundles/compound-assessments/types/Roles';
import { assignmentRoleToLaunchRole } from 'bundles/git/utils/GitIntegrationsUtils';

import { getGitStatuses } from 'bundles/compound-assessments/components/form-parts/git/utils/GitUtils';

import {
  AssignmentPresentationLearner,
  AssignmentPresentationGrader,
} from 'bundles/compound-assessments/components/api/AssignmentPresentation';

import type {
  SubmissionPrompt,
  SubmissionResponseContainer,
} from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';

import { ApiButton } from '@coursera/coursera-ui';

const bem = initBem('GitFormPart');

type Props = {
  courseId?: string;
  itemId?: string;
  prompt: SubmissionPrompt;
  response: SubmissionResponseContainer;
  userId?: number;
  role?: AssignmentRole;
};

const LoadingButton = () => (
  <ApiButton
    apiStatus="API_IN_PROGRESS"
    apiStatusAttributesConfig={{
      label: {
        API_IN_PROGRESS: _t('Loading assignment...'),
      },
    }}
  />
);

const PreparingButton = () => (
  <ApiButton
    apiStatus="API_IN_PROGRESS"
    apiStatusAttributesConfig={{
      label: {
        API_IN_PROGRESS: _t('Preparing...'),
      },
    }}
  />
);

const FailedButton = () => (
  <ApiButton
    apiStatus="API_ERROR"
    apiStatusAttributesConfig={{
      label: {
        API_ERROR: _t('Initialization failed'),
      },
    }}
  />
);

const MissingRepositoryIdButton = () => (
  <ApiButton
    apiStatus="API_ERROR"
    apiStatusAttributesConfig={{
      label: {
        API_ERROR: _t('Initialization failed. Please contact support.'),
      },
    }}
  />
);

const Git: React.SFC<Props> = ({ courseId, itemId, prompt, response, userId, role }) => {
  const {
    submissionPartSchema: { submissionPartSchemaDetails },
  } = prompt;

  const { submissionPartResponse } = response.definition;

  // We know we're all Git after this (and TypeScript knows it too).
  if (
    submissionPartSchemaDetails.typeName !== 'gitSchema' ||
    submissionPartResponse.typeName !== 'gitResponse' ||
    !courseId ||
    !itemId ||
    !userId
  ) {
    return null;
  }

  const { repositoryId, commitHash } = submissionPartResponse.definition;
  const launchRole = assignmentRoleToLaunchRole(role);

  const AssignmentPresentationLearnerGrader =
    launchRole === 'grader' ? AssignmentPresentationGrader : AssignmentPresentationLearner;

  return (
    <AssignmentPresentationLearnerGrader courseId={courseId} itemId={itemId} userId={userId}>
      {(assignment) => {
        if (!assignment) {
          return <LoadingButton />;
        }

        const { isGitInitializationFailed, isGitInitializationInProgress } = getGitStatuses(assignment);

        if (isGitInitializationInProgress) {
          return <PreparingButton />;
        } else if (isGitInitializationFailed) {
          return <FailedButton />;
        } else if (!repositoryId) {
          return <MissingRepositoryIdButton />;
        }

        return (
          <div className={bem()}>
            <div className={bem('prompt')}>
              <GitRepoLauncher
                courseId={courseId}
                itemId={itemId}
                launchRole={launchRole}
                learnerUserId={userId}
                repositoryId={repositoryId}
                commitHash={commitHash}
              />
            </div>
          </div>
        );
      }}
    </AssignmentPresentationLearnerGrader>
  );
};

export default Git;
