// Temporary wrapper around FileUploadEditView until we finish migration to Uppy.
// TODO: move FileUploadEditView here, refactor it similar to UrlPart and restyle it.

import React from 'react';

import initBem from 'js/lib/bem';

import FileUploadEditView from 'bundles/assess-common/components/FileUploadEditView';

import FileUploadView from 'bundles/compound-assessments/components/form-parts/fileUpload/FileUploadView';

import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import ValidationError from 'bundles/compound-assessments/components/form-parts/ValidationError';
import PlagiarismDetectionContainerV2, {
  ASSIGNMENT_TYPES,
} from 'bundles/compound-assessments/components/plagiarism-detection/PlagiarismDetectionContainerV2';

import { typeNames } from 'bundles/compound-assessments/constants';
import PlagiarismDetectionContainerV3 from 'bundles/compound-assessments/components/plagiarism-detection/v3/PlagiarismDetectionContainerV3';
import type { PropsFromGraphql } from 'bundles/assess-common/lib/withUserOrganizationInEpic';
import withUserOrganizationInEpic from 'bundles/assess-common/lib/withUserOrganizationInEpic';

import type { FileUploadPrompt, FileUploadResponse } from 'bundles/compound-assessments/types/FormParts';
import type { FileUploadSubmissionPartType } from 'bundles/assess-common/types/NaptimeSubmission';

import 'css!./__styles__/FileUpload';

const bem = initBem('FileUpload');

type Props = PropsFromGraphql & {
  prompt: FileUploadPrompt;
  response: FileUploadResponse;
  responseId: string;
  // storedResponse is the response stored in the backend
  storedResponse?: FileUploadResponse;
  onChangeResponse: (response: FileUploadResponse) => void;
  isReadOnly: boolean;
  isDisabled: boolean;
  showValidation: boolean;
  itemId: string;
  userId: number;
  courseId: string;
};

export const checkInvalid = (response: FileUploadResponse): FormPartsValidationStatus | null =>
  !((((response || {}).definition || {}).submissionPartResponse || {}).definition || {}).fileUrl
    ? FormPartsValidationStatuses.warning
    : null;

type State = {
  hasUnsavedChanges: boolean;
};
class FileUpload extends React.Component<Props, State> {
  state = {
    hasUnsavedChanges: false,
  };

  handleUpdate = (response: FileUploadSubmissionPartType) => {
    const { onChangeResponse } = this.props;
    const newResponse = {
      typeName: typeNames.SUBMISSION_RESPONSE,
      definition: {
        submissionPartResponse: {
          ...response,
          typeName: 'fileUploadResponse',
        },
      },
    };
    this.setState({ hasUnsavedChanges: true });
    // @ts-expect-error TSMIGRATION
    onChangeResponse(newResponse);
  };

  componentDidUpdate(prevProps: Props) {
    // Reset hasUnsavedChanges when autosave is complete,
    // this will trigger an automatic similarity check if we are using v3.
    const { isDisabled } = this.props;
    const { hasUnsavedChanges } = this.state;
    if (prevProps.isDisabled && !isDisabled && hasUnsavedChanges) {
      this.setState({ hasUnsavedChanges: false });
    }
  }

  render() {
    const {
      isReadOnly,
      response,
      isDisabled,
      prompt: { id, plagiarismConfig },
      showValidation,
      responseId,
      userId,
      courseId,
      itemId,
      isEpicEnabledForUser,
    } = this.props;

    const submissionPart = {
      ...response.definition.submissionPartResponse,
      typeName: 'fileUpload',
    };

    const { hasUnsavedChanges } = this.state;

    const blockSubmit = () => {
      /* Empty function */
    }; // TODO

    const isInvalid = !!(showValidation && checkInvalid(response));

    return (
      <div className={bem(undefined, { isInvalid })}>
        {isReadOnly ? (
          <FileUploadView submissionPart={submissionPart.definition} />
        ) : (
          <FileUploadEditView
            id={id}
            // @ts-expect-error TSMIGRATION
            submissionPart={submissionPart}
            disabled={isDisabled}
            update={this.handleUpdate}
            blockSubmit={blockSubmit}
            uploadButtonHtmlAttributes={{
              'aria-describedby': isInvalid ? `validation-error-${id}` : undefined,
            }}
          />
        )}
        {plagiarismConfig?.plagiarismCheckEnable &&
          (isEpicEnabledForUser ? (
            <PlagiarismDetectionContainerV3
              courseId={courseId}
              itemId={itemId}
              authorId={userId}
              assignmentType={ASSIGNMENT_TYPES.STAFF}
              responseId={responseId}
              hasContent={!!submissionPart?.definition?.fileUrl && submissionPart.definition.fileUrl !== ''}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          ) : (
            <PlagiarismDetectionContainerV2
              assignmentType={ASSIGNMENT_TYPES.STAFF}
              responseId={responseId}
              authorId={userId}
              courseId={courseId}
              itemId={itemId}
              hasContent={!!submissionPart?.definition?.fileUrl && submissionPart.definition.fileUrl !== ''}
            />
          ))}
        {isInvalid && <ValidationError id={id} />}
      </div>
    );
  }
}

export default withUserOrganizationInEpic<Props>()('Flex', 'enableSGASimilarityCheckerV3')(FileUpload);
