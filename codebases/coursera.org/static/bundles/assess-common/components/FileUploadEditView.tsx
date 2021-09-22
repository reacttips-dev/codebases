import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import initBem from 'js/lib/bem';
import user from 'js/lib/user';
import Retracked from 'js/app/retracked';

import { FileUploadSubmissionPartType } from 'bundles/assess-common/types/NaptimeSubmission';
import { allowedFileTypesForInlineFeedback } from 'bundles/assess-common/constants/constants';
import UPLOAD_CONFIG from 'bundles/assess-common/constants/FileUploadConfig';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { TextInput, Textarea } from '@coursera/coursera-ui';
import UppyFileUploader, {
  UppyFile,
  UppyUploadEventData,
  UppyCompleteEventResult,
} from 'bundles/fileuploader-uppy/components/UppyFileUploader';

import _t from 'i18n!nls/peer';
import 'css!./__styles__/FileUploadEditView';

const bem = initBem('FileUploadEditView');

type Props = {
  id: string;
  submissionPart: FileUploadSubmissionPartType;
  update: (newSubmissionPart: FileUploadSubmissionPartType) => void;
  disabled: boolean;
  blockSubmit: (shouldBlockSubmit: boolean) => void;
  uploadButtonHtmlAttributes?: React.HTMLAttributes<HTMLButtonElement>;
};

export class UploadButton extends React.Component<Props> {
  static contextTypes = {
    _eventData: PropTypes.object,
  };

  onUpload = ({ id, fileIDs }: UppyUploadEventData) => {
    const { blockSubmit } = this.props;
    const { logEvent } = this;

    logEvent({ trackingName: 'file_upload_start', extraProps: { uploadSessionId: id, fileIds: fileIDs } });
    blockSubmit(true);
  };

  onComplete = (result: UppyCompleteEventResult) => {
    if (result.failed.length) {
      this.onError(result.failed[0]);
    }

    if (result.successful.length) {
      const file = result.successful[0];
      const urlMatch = file.xhrUpload && file.xhrUpload.endpoint ? file.xhrUpload.endpoint.match(/^(.*?)\?/) : null;

      if (urlMatch) {
        const { submissionPart, update, blockSubmit } = this.props;
        const { logEvent } = this;
        const url = urlMatch[1];

        const newSubmissionPart = cloneDeep(submissionPart);
        newSubmissionPart.definition.fileUrl = url || '';

        logEvent({
          trackingName: 'file_upload_success',
          extraProps: { uploadSessionId: file.meta.uploadSessionId, file, url },
        });
        blockSubmit(false);
        update(newSubmissionPart);
      } else {
        this.onError(result.successful[0], 'XhrUpload url not found');
      }
    }
  };

  onError = (file: UppyFile, error?: string) => {
    const { logEvent } = this;

    logEvent({
      trackingName: 'file_upload_error',
      extraProps: { uploadSessionId: file.meta.uploadSessionId, file, error: error || file.error },
    });
  };

  logEvent = ({ trackingName, extraProps }: { trackingName: string; extraProps?: {} }) => {
    const { id: inputId } = this.props;
    const { _eventData } = this.context;
    const userId = user.get().id;

    Retracked.trackComponent(
      _eventData,
      {
        userId,
        inputId,
        client: 'Uppy-S3',
        ...extraProps,
      },
      trackingName,
      'click'
    );
  };

  removeUploadedFile = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, props: Props) => {
    const { submissionPart, update } = props;
    if (event.type === 'click' || ('key' in event && event.key === 'Enter')) {
      const newSubmissionPart = cloneDeep(submissionPart);
      newSubmissionPart.definition.fileUrl = '';
      update(newSubmissionPart);
    }
  };

  render() {
    const { submissionPart, disabled, id, uploadButtonHtmlAttributes } = this.props;
    const { onUpload, onComplete } = this;

    if (submissionPart.typeName !== 'fileUpload') {
      return null;
    }

    const { fileUrl } = submissionPart.definition;

    return (
      <div className={bem('upload-controls')}>
        {fileUrl && (
          <div>
            <a
              className="open-upload cif-file-o"
              rel="noopener noreferrer"
              target="_blank"
              href={fileUrl}
              aria-label={_t('Open uploaded file')}
            >
              {fileUrl.split('/').pop()}
            </a>
            {!disabled && (
              <span
                className="remove-upload c-peer-review-submit-upload-remove"
                role="button"
                onClick={(event) => this.removeUploadedFile(event, this.props)}
                onKeyUp={(event) => this.removeUploadedFile(event, this.props)}
                tabIndex={0}
                aria-label={_t('Remove uploaded file')}
              >
                &times;
              </span>
            )}
          </div>
        )}
        <div className={bem('uploader', { hidden: !!fileUrl })}>
          <UppyFileUploader
            {...{
              id,
              buttonContent: _t('Upload File'),
              buttonClasses: ['link-button', 'primary', 'c-upload-button'],
              disabled,
              maxFileSize: UPLOAD_CONFIG.maxFileSize,
              onUpload,
              onComplete,
              s3Bucket: UPLOAD_CONFIG.s3Bucket,
              s3UploadDir: UPLOAD_CONFIG.s3UploadDir,
              buttonHtmlAttributes: uploadButtonHtmlAttributes,
            }}
          />
        </div>
      </div>
    );
  }
}

class FileUploadEditView extends React.Component<
  {
    submissionPart: FileUploadSubmissionPartType;
    update: (newSubmissionPart: FileUploadSubmissionPartType) => void;
    blockSubmit: (shouldBlockSubmit: boolean) => void;
    disabled: boolean;
    isPartReceivingInlineFeedback?: boolean;
    id: string;
  } & Pick<Props, 'uploadButtonHtmlAttributes'>
> {
  onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { submissionPart, update } = this.props;
    const newSubmissionPart = cloneDeep(submissionPart);
    newSubmissionPart.definition.title = event.currentTarget.value;
    update(newSubmissionPart);
  };

  onChangeCaption = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { submissionPart, update } = this.props;
    const newSubmissionPart = cloneDeep(submissionPart);
    newSubmissionPart.definition.caption = event.currentTarget.value;
    update(newSubmissionPart);
  };

  renderIncompatibleFileTypeWarning() {
    // If high-touch degree features are enabled, warn learners if they upload incompatible file types. FLEX-18905
    const { submissionPart, isPartReceivingInlineFeedback } = this.props;

    const { fileUrl } = submissionPart.definition;
    const isPlagiarismDetectionEnabled = !!submissionPart.definition.plagiarismMetadata;

    if (!fileUrl || (!isPlagiarismDetectionEnabled && !isPartReceivingInlineFeedback)) {
      return null;
    }

    const fileExtension = fileUrl.split('.').pop()?.toLowerCase() || '';

    if (!allowedFileTypesForInlineFeedback.includes(fileExtension)) {
      return (
        <div className="bt3-alert bt3-alert-warning">
          <FormattedMessage
            message={_t(
              'Please submit one of the following file formats ({allowedFileTypeList}) to receive in-line feedback and/or pass plagiarism checks.'
            )}
            allowedFileTypeList={allowedFileTypesForInlineFeedback.map((str) => '.' + str).join(', ')}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { submissionPart, update, disabled, blockSubmit, id, uploadButtonHtmlAttributes } = this.props;

    const { fileUrl } = submissionPart.definition;

    return (
      <div className="rc-FileUploadEditView">
        {this.renderIncompatibleFileTypeWarning()}
        <div
          className={[
            'c-peer-review-submit-upload-field',
            'c-peer-review-submit-text-field',
            'c-peer-review-submit-text-field-group-top',
          ].join(' ')}
        >
          <UploadButton
            id={id}
            submissionPart={submissionPart}
            update={update}
            disabled={disabled}
            blockSubmit={blockSubmit}
            uploadButtonHtmlAttributes={uploadButtonHtmlAttributes}
          />
        </div>
        {fileUrl && (
          <div>
            <div className="c-peer-review-submit-text-field-container">
              <TextInput
                value={submissionPart.definition.title}
                label={_t('Title')}
                onChange={this.onChangeTitle}
                aria-label={_t('Enter an optional title for the uploaded file')}
                componentId={`text-input-title-${id}`}
              />
            </div>
            <div className="c-peer-review-submit-text-field-container">
              <Textarea
                label={_t('Caption')}
                value={submissionPart.definition.caption}
                onChange={this.onChangeCaption}
                componentId={`text-input-caption-${id}`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FileUploadEditView;
