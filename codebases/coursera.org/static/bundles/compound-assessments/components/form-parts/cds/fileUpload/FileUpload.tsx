// Temporary wrapper around FileUploadEditView until we finish migration to Uppy.
// TODO: move FileUploadEditView here, refactor it similar to UrlPart and restyle it.

import React from 'react';

import initBem from 'js/lib/bem';

import FileUploadEditView from 'bundles/assess-common/components/FileUploadEditView';

import FileUploadView from 'bundles/compound-assessments/components/form-parts/cds/fileUpload/FileUploadView';

import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';
import PlagiarismDetectionContainerV2, {
  ASSIGNMENT_TYPES,
} from 'bundles/compound-assessments/components/plagiarism-detection/cds/PlagiarismDetectionContainerV2';

import { typeNames } from 'bundles/compound-assessments/constants';

import type { FileUploadPrompt, FileUploadResponse } from 'bundles/compound-assessments/types/FormParts';
import type { FileUploadSubmissionPartType } from 'bundles/assess-common/types/NaptimeSubmission';

import 'css!./__styles__/FileUpload';

const bem = initBem('FileUpload');

type Props = {
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

class FileUpload extends React.Component<Props> {
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

    // @ts-expect-error TSMIGRATION
    onChangeResponse(newResponse);
  };

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
    } = this.props;

    const submissionPart = {
      ...response.definition.submissionPartResponse,
      typeName: 'fileUpload',
    };

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
        {plagiarismConfig && plagiarismConfig.plagiarismCheckEnable && (
          <PlagiarismDetectionContainerV2
            assignmentType={ASSIGNMENT_TYPES.STAFF}
            responseId={responseId}
            authorId={userId}
            courseId={courseId}
            itemId={itemId}
            hasContent={!!submissionPart?.definition?.fileUrl && submissionPart.definition.fileUrl !== ''}
          />
        )}
        {isInvalid && <ValidationError id={id} />}
      </div>
    );
  }
}

export default FileUpload;
