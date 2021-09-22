import React from 'react';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import initBem from 'js/lib/bem';

import { calcCheckSum, getS3FileKey, buildS3UploadParams } from 'bundles/fileuploader-uppy/utils/FileUploadUtils';
import UPLOAD_CONFIG from 'bundles/fileuploader-uppy/constants/FileUploadConfig';

import { DashboardModal } from '@uppy/react';
import { Button } from '@coursera/coursera-ui';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import Modal from 'bundles/phoenix/components/Modal';
import ModalButtonFooter from 'bundles/authoring/common/modals/ModalButtonFooter';

import _t from 'i18n!nls/fileuploader-uppy';
import 'css!@uppy/core/dist/style';
import 'css!@uppy/dashboard/dist/style';
import 'css!./__styles__/UppyFileUploader';

const bem = initBem('UppyFileUploader');

export type UppyFile = {
  id: string;
  data: File;
  type: string;
  name: string;
  meta: {
    uploadSessionId?: string;
    checkSum?: string;
  };
  xhrUpload?: {
    endpoint: string;
  };
  // note: uploadURL may not be reliable for determining the upload location because AWS sometimes
  //       returns a 200 response with an empty body instead of echoing back the PUT location
  uploadURL?: string;
  error?: string;
};

export type UppyProgress = {
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
};

export type UppyError = {
  status: number;
  body: string;
};

export type UppyResponse = {
  status: number;
  body: string;
  uploadURL?: string;
};

export type UppyUploadEventData = {
  id: string;
  fileIDs: Array<string>;
};

export type UppyCompleteEventResult = {
  failed: Array<UppyFile>;
  successful: Array<UppyFile>;
};

export type UppyS3UploadParams = {
  method: 'PUT';
  url: string;
  headers: {};
  fields: {};
};

type GetPreSignedUrlArgs = {
  variables: {
    id?: string;
    input: {
      action: 'generate';
      allowPublicRead: true;
      bucket: string;
      contentMd5: string;
      contentType: string;
      httpMethod: 'PUT';
      key: string;
    };
  };
};

export type PreSignedUrlsResponse = {
  data: {
    PreSignedUrlsV1: {
      action: {
        elements: Array<{
          url: string;
          additionalHeaders: Array<{
            name: string;
            value: string;
          }>;
        }>;
      };
    };
  };
};

type InputProps = {
  id: string;
  buttonContent?: React.ReactNode;
  buttonClasses?: Array<string>;
  buttonHtmlAttributes?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  disabled?: boolean;
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: Array<string>;

  // note: Uppy events (see https://uppy.io/docs/uppy/#Events)
  onFileAdded?: (file: UppyFile) => void;
  onFileRemoved?: (file: UppyFile) => void;
  onUpload?: (data: UppyUploadEventData) => void;
  onUploadProgress?: (file: UppyFile, progress: UppyProgress) => void;
  onUploadSuccess?: (file: UppyFile, response: UppyResponse) => void;
  onUploadError?: (file: UppyFile, error: UppyError, respone: UppyResponse) => void;
  onUploadRetry?: (fileId: string) => void;
  onComplete?: (result: UppyCompleteEventResult) => void;
  onError?: (error: Error) => void;
  onCancelAll?: () => void;
  onRestrictionFailed?: (file: UppyFile, error: UppyError) => void;

  // S3 params
  s3Bucket?: string;
  s3UploadDir?: string;
};

type AddedProps = {
  getPreSignedUrl: (args: GetPreSignedUrlArgs) => Promise<PreSignedUrlsResponse>;
};

type UppyProps = InputProps & AddedProps;

type State = {
  isUploadModalOpen: boolean;
  isErrorModalOpen: boolean;
};

/**
 * This is a hack to fix https://coursera.atlassian.net/browse/ACCESS-833
 *
 * If Uppy modal appears inside opened React Modal, both of modals try to handle the tab focus. It does not
 * cause troubles in all browsers except for Safari.
 *
 * React Modal has workaround that fix tabbing in modal for Safari and it breaks tabbing in Uppy:
 * https://github.com/reactjs/react-modal/blob/master/src/helpers/scopeTab.js#L39-L79
 *
 * I could not find a better solution than to override userAgent to break React Modal Safari detection when Uppy
 * modal is opened, and return original one when it's closed or when this component is unmounted.
 *
 * This is unsafe and fragile solution, it might break on react-modal update, but I could not come up with a
 * better solution for this. The only way I see is to avoid using Uppy modal inside react-modal. For example
 * we can use inline Uppy interface.
 */
const rewriteUserAgent = (from: string, to: string) => {
  if (navigator.userAgent.match(from)) {
    try {
      const newUserAgent = navigator.userAgent.replace(from, to);
      Object.defineProperty(navigator, 'userAgent', { get: () => newUserAgent, configurable: true });
    } catch (e) {
      /* empty */
    }
  }
};

const safariFocusWorkaround = {
  apply: () => rewriteUserAgent('Safari', 'Saf-ari'),
  clear: () => rewriteUserAgent('Saf-ari', 'Safari'),
};

export class UppyFileUploader extends React.Component<UppyProps, State> {
  uppy: Uppy.Uppy;

  constructor(props: UppyProps) {
    super(props);

    this.state = {
      isUploadModalOpen: false,
      isErrorModalOpen: false,
    };

    const {
      id,
      maxNumberOfFiles,
      maxFileSize,
      allowedFileTypes,
      onFileAdded,
      onFileRemoved,
      onUpload,
      onUploadProgress,
      onUploadSuccess,
      onUploadError,
      onUploadRetry,
      onComplete,
      onError,
      onCancelAll,
      onRestrictionFailed,
    } = props;

    this.uppy = Uppy({
      // unique id to avoid collisions if more than one uploader on page
      // (see https://uppy.io/docs/uppy/#id-39-uppy-39)
      id: id + '-Uppy',
      // do not automatically start upload if maxNumberOfFiles > 1
      autoProceed: !(!!maxNumberOfFiles && maxNumberOfFiles > 1),
      allowMultipleUploads: true,
      restrictions: {
        maxFileSize: maxFileSize || UPLOAD_CONFIG.maxFileSize,
        maxNumberOfFiles: maxNumberOfFiles || UPLOAD_CONFIG.maxNumberOfFiles,
        allowedFileTypes: allowedFileTypes || UPLOAD_CONFIG.allowedFileTypes,
      },
      // note: global meta data can be attached to uploads (see https://uppy.io/docs/uppy/#meta)
      meta: {},
    });

    this.uppy.use(AwsS3, {
      id: id + '-AwsS3',
      getUploadParameters: this.getUploadParams,
    });

    // note: Uppy events (see https://uppy.io/docs/uppy/#Events)
    if (onFileAdded) {
      this.uppy.on('file-added', onFileAdded);
    }
    if (onFileRemoved) {
      this.uppy.on('file-removed', onFileRemoved);
    }
    if (onUpload) {
      this.uppy.on('upload', onUpload);
    }
    if (onUploadProgress) {
      this.uppy.on('upload-progress', onUploadProgress);
    }
    if (onUploadSuccess) {
      this.uppy.on('upload-success', onUploadSuccess);
    }
    if (onUploadError) {
      this.uppy.on('upload-error', onUploadError);
    }
    if (onUploadRetry) {
      this.uppy.on('upload-retry', onUploadRetry);
    }
    if (onComplete) {
      this.uppy.on('complete', onComplete);
    }
    if (onError) {
      this.uppy.on('error', onError);
    }
    if (onCancelAll) {
      this.uppy.on('cancel-all', onCancelAll);
    }
    if (onRestrictionFailed) {
      this.uppy.on('restriction-failed', onRestrictionFailed);
    }
    this.uppy.on('upload', this.setUploadSessionIdMeta);
    this.uppy.on('complete', this.clearUploadSessionIdMeta);
    // note: checkForError will reset state and show an error modal, so only reset
    //       state on complete after other event handlers have a chance to view the state
    this.uppy.on('complete', this.checkForError);

    this.uppy.on('complete', safariFocusWorkaround.clear);
  }

  componentWillUnmount() {
    this.uppy.close();
    safariFocusWorkaround.clear();
  }

  getUploadParams = (file: UppyFile) => {
    const { s3Bucket, s3UploadDir, getPreSignedUrl } = this.props;

    return calcCheckSum({ file: file.data })
      .then((checkSum) =>
        getPreSignedUrl({
          variables: {
            id: '',
            input: {
              action: 'generate',
              allowPublicRead: true,
              bucket: s3Bucket || UPLOAD_CONFIG.s3Bucket,
              contentMd5: checkSum,
              contentType: file.type,
              httpMethod: 'PUT',
              key: getS3FileKey({ file, uploadDir: s3UploadDir || UPLOAD_CONFIG.s3UploadDir }),
            },
          },
        })
      )
      .then(buildS3UploadParams);
  };

  checkForError = (result: UppyCompleteEventResult) => {
    this.uppy.reset();
    if (result.failed.length) {
      this.hideUploadModal();
      this.showErrorModal();
    }
  };

  setUploadSessionIdMeta = ({ id }: UppyUploadEventData) => {
    this.uppy.setMeta({ uploadSessionId: id });
  };

  clearUploadSessionIdMeta = () => {
    this.uppy.setMeta({ uploadSessionId: null });
  };

  showUploadModal = () => {
    this.setState({ isUploadModalOpen: true });
    safariFocusWorkaround.apply();
  };

  hideUploadModal = () => {
    this.setState({ isUploadModalOpen: false });
    safariFocusWorkaround.clear();
  };

  showErrorModal = () => this.setState({ isErrorModalOpen: true });

  hideErrorModal = () => this.setState({ isErrorModalOpen: false });

  render() {
    const { buttonClasses, buttonContent, disabled, buttonHtmlAttributes } = this.props;
    const { isUploadModalOpen, isErrorModalOpen } = this.state;

    return (
      <div className={bem(undefined, undefined, buttonClasses)}>
        <Button
          label={buttonContent || _t('Upload File')}
          type="primary"
          size="sm"
          onClick={this.showUploadModal}
          disabled={disabled}
          htmlAttributes={buttonHtmlAttributes}
        />
        <DashboardModal
          uppy={this.uppy}
          open={isUploadModalOpen}
          onRequestClose={this.hideUploadModal}
          closeModalOnClickOutside={true}
          closeAfterFinish={true}
          proudlyDisplayPoweredByUppy={false}
        />
        {isErrorModalOpen && (
          <FileUploadErrorModal
            {...{
              handleClose: this.hideErrorModal,
            }}
          />
        )}
      </div>
    );
  }
}

const modalBem = initBem('FileUploadErrorModal');
export const FileUploadErrorModal = ({ handleClose }: { handleClose: () => void }) => (
  <div className={modalBem()}>
    <Modal modalName={_t('File upload error')} handleClose={handleClose}>
      <h3 className={modalBem('title', undefined, 'headline-3-text')}>{_t('Your file upload failed.')}</h3>

      <div className={modalBem('message', undefined, 'secondary-text-color')}>
        <p>{_t('Please check your internet connection and reload the page.')}</p>
        <p>
          <FormattedMessage
            {...{
              message: _t(
                'You may be using a network that blocks your ability to upload files to Coursera. If that is the case, please try connecting to a different network and uploading again. If this continues to be an issue, you can contact {courseraLink} support for further assistance.'
              ),
              courseraLink: (
                <a
                  href="https://learner.coursera.help/hc/articles/208279886-Solve-problems-with-Coursera"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coursera 24x7
                </a>
              ),
            }}
          />
        </p>
      </div>

      <div className={modalBem('controls')}>
        <ModalButtonFooter
          {...{
            onPrimaryButtonClick: handleClose,
            primaryButtonContents: _t('Close'),
          }}
        />
      </div>
    </Modal>
  </div>
);

/* eslint-disable graphql/template-strings */
const preSignedUrlsV1Mutation = gql`
  mutation GetPreSignedUrl($id: String, $input: DataMap) {
    PreSignedUrlsV1 @naptime {
      action(id: $id, input: $input) {
        elements {
          url
          additionalHeaders
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

const withPreSignedUrlsMutation = graphql(preSignedUrlsV1Mutation, { name: 'getPreSignedUrl' });

const connected = compose<UppyProps, InputProps>(withPreSignedUrlsMutation);

export default connected(UppyFileUploader);
