import { Component } from 'react';
import { values } from 'lodash';
import type { Uppy, Locale } from '@uppy/core-1.13';

import createUppyInstance, { DEFAULT_KEY, DEFAULT_TEMPLATE_ID } from 'bundles/asset-admin/utils/UppyUtils';
import UploadStatus, { UploadStatusType } from 'bundles/asset-admin/constants/UploadStatus';
import { TransloaditFile, TransloaditFileMap, Assembly } from 'bundles/authoring/common/types/Upload';
import AssetAdminTracking from 'bundles/asset-admin/utils/AssetAdminTracking';
import { mapAssetTypeToMimes } from 'bundles/asset-admin/utils/AssetUploaderUtils';
import { UppyProps, UppyRef, UppyFile, FileUploadProgress, UploadCompletion } from 'bundles/asset-admin/types/uppy';
import { getUppyLocalePackWithOverrides } from 'bundles/asset-admin/utils/uppyLocales';
import _t from 'i18n!nls/asset-admin';

// eslint-disable-next-line no-restricted-syntax, import/extensions
import 'css!@uppy/core-1.13/dist/style.css';

const MAX_CONCURRENT_UPLOADS = 100;

export type RenderProps = {
  uppy: Uppy;
  status: UploadStatusType;
};
type OptionalError = Error | undefined | null;

type Props = {
  courseId?: string;
  assetCreationUrl?: string;
  templateId?: string;
  uploadToAssetService?: boolean;
  uploadPaused?: boolean;
  // If allowedFileTypes and assetType are both specified, allowedFileTypes will take precedence.
  allowedFileTypes?: Array<string>;
  assetType?: string;
  pdfTemplate?: string;
  allowMultiple?: boolean;
  uppyProps?: UppyProps;
  uppyRef?: UppyRef;
  render: (props: RenderProps) => JSX.Element;
  enableZoom?: boolean;

  // TODO: Think about these callback names a bit and maybe tweak them.
  onFileAdded?: (file: TransloaditFile) => void;
  onFilesReadyForUpload?: (files: TransloaditFileMap, uppy: Uppy) => void;
  onUploadStart?: (files: TransloaditFileMap) => void;
  onUploadProgress?: (file: UppyFile, progress: FileUploadProgress) => void;
  onUploadError: (assembly: Assembly, error: OptionalError) => void;
  onUploadSuccess?: (assembly: Assembly) => void;
  onUploadsComplete?: (uploadCompletion: UploadCompletion) => void;
  onAssetCreationError: (error: Error, assembly: Assembly) => void; // TODO(wbowers): Write a type for `error`
  onAssetCreationComplete: (assetIds: Array<string>, assembly: Assembly) => void | Promise<void>;
  onFileUploadComplete?: (assembly: Assembly) => void;
  showPostAssemblyLoader?: boolean;
  onAssemblyComplete?: (assembly: Assembly) => void;
  locale?: Locale;
};

type State = RenderProps;

declare global {
  interface Window {
    uppyInstance?: Uppy;
  }
}

export default class UppyAssetUploader extends Component<Props, State> {
  static defaultProps = {
    onFileAdded: (file: TransloaditFile) => file,
    onFilesReadyForUpload: (files: TransloaditFileMap) => files,
    onUploadStart: (files: TransloaditFileMap) => files,
    onUploadProgress: (file: TransloaditFile) => file,
    onUploadError: (error: Error) => error,
    onUploadSuccess: (assembly: Assembly) => assembly,
    onUploadsComplete: (uploadCompletion: UploadCompletion) => uploadCompletion,
    onAssetCreationError: (error: Error) => error,
    onAssetCreationComplete: (assetIds: string[]) => assetIds,
    onFileUploadComplete: (assembly: Assembly) => assembly,
  };

  constructor(props: Props) {
    super(props);

    const {
      uppyRef,
      uppyProps,
      allowMultiple,
      allowedFileTypes,
      assetType,
      courseId,
      assetCreationUrl,
      templateId,
      pdfTemplate,
      uploadToAssetService,
      onAssetCreationComplete,
      onAssetCreationError,
      showPostAssemblyLoader,
      onAssemblyComplete,
    } = props;
    const uppy = createUppyInstance({
      params: {
        ...uppyProps,
        restrictions: {
          maxNumberOfFiles: allowMultiple ? MAX_CONCURRENT_UPLOADS : 1,
          allowedFileTypes: allowedFileTypes || (assetType && mapAssetTypeToMimes(assetType)) || false,
        },
        onBeforeUpload: this.handleFilesReadyForUpload,
        onBeforeFileAdded: this.handleFileAdded,
      },
      events: {
        'upload-progress': this.handleUploadProgress,
        'transloadit:assembly-error': this.handleAssemblyError,
        'transloadit:complete': this.handleFileUploadComplete,
        'assetCreation:complete': onAssetCreationComplete,
        'assetCreation:error': onAssetCreationError,
        complete: this.handleUploadsComplete,
      },
      key: DEFAULT_KEY,
      templateId: templateId ?? DEFAULT_TEMPLATE_ID,
      uppyId: `uppyInstance-${Date.now()}-${Math.random()}`,
      assetContext: { courseId },
      assetCreationUrl,
      pdfTemplate,
      uploadToAssetService,
      showPostAssemblyLoader,
      onAssemblyComplete,
    });

    if (uppyRef) {
      uppyRef.current = uppy;
    }

    this.state = {
      uppy,
      status: UploadStatus.IDLE,
    };

    // used to interact with the uppy instance during e2e tests
    window.uppyInstance = uppy;
  }

  componentWillReceiveProps(prevProps: Props) {
    const { uppy } = this.state;
    const { uploadPaused } = this.props;

    if (prevProps.uploadPaused !== uploadPaused) {
      if (uploadPaused) {
        uppy.pauseAll();
      } else {
        uppy.resumeAll();
      }
    }
  }

  componentWillUnmount() {
    const { uppyProps } = this.props;
    const { uppy } = this.state;
    const { events = {} } = uppyProps || {};

    Object.entries({
      ...events,
      'transloadit:assembly-error': this.handleAssemblyError,
      'transloadit:complete': this.handleFileUploadComplete,
      complete: this.handleUploadsComplete,
    }).forEach(([event, action]) => uppy.off(event, action));
  }

  handleAssemblyError = (assembly: Assembly, error: OptionalError): void => {
    const { onUploadError } = this.props;

    Promise.resolve(onUploadError(assembly, error)).then(() => this.setState({ status: UploadStatus.IDLE }));
  };

  handleFileAdded = (file: TransloaditFile): void => {
    const { onFileAdded } = this.props;
    if (onFileAdded) {
      onFileAdded(file);
    }
  };

  handleFilesReadyForUpload = (fileMap: TransloaditFileMap): void => {
    const { onUploadStart, onFilesReadyForUpload } = this.props;
    const { uppy } = this.state;

    if (onFilesReadyForUpload) {
      onFilesReadyForUpload(fileMap, uppy);
    }

    this.setState({ status: UploadStatus.IN_PROGRESS }, () => {
      if (onUploadStart) {
        onUploadStart(fileMap);
      }
    });
  };

  handleUploadProgress = (file: UppyFile, progress: FileUploadProgress): void => {
    const { onUploadProgress } = this.props;
    if (onUploadProgress) {
      onUploadProgress(file, progress);
    }
  };

  handleFailedUpload = (assembly: Assembly, error?: OptionalError) => {
    const { onUploadError } = this.props;

    const { uppy } = this.state;
    uppy.info(
      'There was an error in the upload process, please close this modal and try again or contact support',
      'error',
      0
    );

    const files: Array<TransloaditFile> = values(assembly.results)[0];
    const file: TransloaditFile = files[0];
    const assetType = file.meta.type;
    AssetAdminTracking.track('upload', 'failed', { assetType });

    onUploadError(assembly, error);
    this.setState({ status: UploadStatus.FAILED });
  };

  handleSuccessfulUpload = (assembly: Assembly) => {
    const { onUploadSuccess } = this.props;

    if (onUploadSuccess) {
      onUploadSuccess(assembly);
    }
    this.setState({ status: UploadStatus.IDLE });
  };

  handleFileUploadComplete = (assembly: Assembly) => {
    const { onFileUploadComplete } = this.props;

    if (assembly.error) {
      this.handleFailedUpload(assembly);
    } else {
      this.handleSuccessfulUpload(assembly);
    }

    // Each uppy UI will behave differently after upload, in terms of choosing whether
    // to reset uppy state. Users of this component must implement that in their onUploadError,
    // onAssetCreationError, and onAssetCreationComplete callbacks if reset logic is needed.
    // See `bundles/asset-admin/components/DragDropUploader.jsx` for an example.
    if (onFileUploadComplete) {
      onFileUploadComplete(assembly);
    }
  };

  handleUploadsComplete = (uploadsCompletion: UploadCompletion): void => {
    const { onUploadsComplete } = this.props;
    if (onUploadsComplete) {
      onUploadsComplete(uploadsCompletion);
    }
  };

  setLocalePack() {
    const { uppyRef } = this.props;
    const localePack = this.getLocalePack();
    if (uppyRef?.current) {
      uppyRef.current.setOptions({ locale: localePack });
    }
  }

  getLocalePack = (): Locale => {
    const { locale, allowMultiple } = this.props;
    const overrides: Locale = {
      strings: {
        done: _t('Start over'),
        cancel: _t('Clear'),
        authenticateWithTitle: _t('Authenticate with %{pluginName} to select files'),
        ...(allowMultiple === false ? { dropPasteImport: _t('Drop a file here or import from:') } : {}),
        ...locale?.strings,
      },
    };
    return getUppyLocalePackWithOverrides(_t.getLocale(), overrides);
  };

  render() {
    const { render } = this.props;

    // we do this here in the render method for CSR / SSR consistency for the accessed user locale, and force an update in uppy
    if (this.props.uppyRef?.current) {
      this.setLocalePack();
    }

    return this.state.uppy ? render(this.state) : null;
  }
}
