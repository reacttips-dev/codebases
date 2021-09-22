import React from 'react';
import PropTypes from 'prop-types';

import type { RenderProps } from 'bundles/asset-admin/components/UppyAssetUploader';
import UppyAssetUploader from 'bundles/asset-admin/components/UppyAssetUploader';
import { DashboardModal, Dashboard } from '@uppy/react-1.10';
import type { Locale } from '@uppy/core-1.13';
import Uppy from '@uppy/core-1.13';

import type { TransloaditFile, TransloaditFileMap, Assembly } from 'bundles/authoring/common/types/Upload';
import type { UppyRef, UppyFile, FileUploadProgress, UploadCompletion } from 'bundles/asset-admin/types/uppy';
import AssetAdminTracking from 'bundles/asset-admin/utils/AssetAdminTracking';

import 'css!./__styles__/DashboardUploader';
// eslint-disable-next-line no-restricted-syntax, import/extensions
import 'css!@uppy/core-1.13/dist/style.css';
// eslint-disable-next-line no-restricted-syntax, import/extensions
import 'css!@uppy/dashboard-1.12/dist/style.css';
// eslint-disable-next-line no-restricted-syntax, import/extensions
import 'css!@uppy/url/dist/style.css';

const DEFAULT_PLUGIN_SOURCES = ['GoogleDrive', 'OneDrive', 'Dropbox', 'Url'];
/*
 * Wrapper component around the Uppy Dashboard (https://uppy.io/docs/dashboard/) file uploader
 * It declares event handlers to both prepare files for uploading after they have been selected
 * and to save assets after their transloadit (https://transloadit.com/docs/) assemblies have completed.
 *
 * We override the proptypes here https://github.com/transloadit/uppy/blob/main/packages/%40uppy/react/src/propTypes.js#L2 which is referencing the child dependency of @uppy/react (because of the version resolution we enforce) rather than the sibling @uppy/core we instantiate from (so the instanceOf check fails).
 */
Dashboard.propTypes = {
  ...Dashboard.propTypes,
  uppy: PropTypes.instanceOf(Uppy.Uppy).isRequired,
};

export type Props = {
  courseId?: string;
  templateId?: string;
  uploadToAssetService?: boolean;
  uploadPaused?: boolean;
  uppyRef?: UppyRef;

  // TODO: we should refactor this so we allow all dashboard options to be set by consumer
  open?: boolean;
  height?: number | string; // number in px, string for other units
  width?: number | string; // number in px, string for other units
  hideUploadButton?: boolean;

  allowMultiple?: boolean;
  allowedFileTypes?: Array<string>;
  assetType?: string;
  autoProceed?: boolean;
  inline?: boolean;
  pdfTemplate?: {};
  enableZoom?: boolean;
  disablePluginSources?: boolean;
  assetCreationUrl?: string;

  onFileAdded?: (file: TransloaditFile) => void;
  onFilesReadyForUpload?: (files: TransloaditFileMap) => void;
  onUploadStart?: (files: TransloaditFileMap) => void;
  onUploadProgress?: (file: UppyFile, progress: FileUploadProgress) => void;
  onUploadError?: (assembly: Assembly, error: Error | undefined | null) => void;
  onUploadSuccess?: (assembly: Assembly) => void;
  onAssetCreationError?: (error: Error, assembly: Assembly) => void; // TODO(wbowers): Write a type for `error`
  onAssetCreationComplete?: (assetIds: Array<string>, assembly: Assembly) => void | Promise<void>;
  onFileUploadComplete?: (assembly: Assembly) => void;
  onUploadsComplete?: (uploadCompletion: UploadCompletion) => void;
  locale?: Locale;
  showPostAssemblyLoader?: boolean;
  onAssemblyComplete?: (assembly: Assembly) => void;
};

export default class DashboardUploader extends React.Component<Props> {
  static defaultProps = {
    onUploadStart: (files: TransloaditFileMap) => files,
    onUploadComplete: (assembly: Assembly) => assembly,
    onUploadError: (assembly: Assembly) => assembly,
    onAssetCreationComplete: (assetIds: string[]) => assetIds,
    onAssetCreationError: (error: Error) => error,
    enableZoom: false,
  };

  componentDidMount() {
    const { uppyRef } = this.props;

    if (uppyRef) {
      uppyRef.current = this.uppyRef.current;
    }
  }

  handleUploadError = (assembly: Assembly, error: Error | undefined | null): void => {
    const { onUploadError, assetType } = this.props;

    if (onUploadError) {
      onUploadError(assembly, error);
    }

    AssetAdminTracking.track('upload', 'failed', { assetType });
  };

  handleAssetCreationComplete = (assetIds: Array<string>, assembly: Assembly): void | Promise<void> => {
    const { onAssetCreationComplete } = this.props;

    if (onAssetCreationComplete) {
      return onAssetCreationComplete(assetIds, assembly);
    }

    return undefined;
  };

  uppyRef: UppyRef = { current: undefined };

  render() {
    const {
      courseId,
      templateId,
      uploadToAssetService,
      uploadPaused,
      allowMultiple,
      allowedFileTypes,
      assetType,
      autoProceed,
      inline,
      open,
      height,
      width,
      onFileAdded,
      onFilesReadyForUpload,
      onUploadStart,
      onUploadProgress,
      onUploadSuccess,
      onAssetCreationError,
      onAssetCreationComplete,
      onFileUploadComplete,
      onUploadsComplete,
      enableZoom,
      disablePluginSources,
      locale,
      assetCreationUrl,
      showPostAssemblyLoader,
      onAssemblyComplete,
      hideUploadButton,
    } = this.props;
    let pluginSources = DEFAULT_PLUGIN_SOURCES;

    /*
     * TODO: instead of this pattern, consider a new `pluginSources` prop that defaults to DEFAULT_PLUGIN_SOURCES, and can be
     * used to pass a customizable list of plugins. We would also need to expose all the plugin sources as consts to do this,
     * and then we can remove separate plugin enablers like `enableZoom`
     */
    if (enableZoom) {
      pluginSources = ['Zoom', ...DEFAULT_PLUGIN_SOURCES];
    }
    const DashboardComponent = inline ? Dashboard : DashboardModal;
    return (
      <div className="rc-DashboardUploader">
        <UppyAssetUploader
          courseId={courseId}
          assetCreationUrl={assetCreationUrl}
          uploadToAssetService={uploadToAssetService}
          uploadPaused={uploadPaused}
          templateId={templateId}
          uppyProps={{ autoProceed }}
          allowMultiple={allowMultiple}
          allowedFileTypes={allowedFileTypes}
          assetType={assetType}
          onFileAdded={onFileAdded}
          onFilesReadyForUpload={onFilesReadyForUpload}
          onUploadStart={onUploadStart}
          onUploadProgress={onUploadProgress}
          onUploadError={this.handleUploadError}
          onUploadSuccess={onUploadSuccess}
          onAssetCreationError={onAssetCreationError}
          onAssetCreationComplete={onAssetCreationComplete}
          onFileUploadComplete={onFileUploadComplete}
          onUploadsComplete={onUploadsComplete}
          uppyRef={this.uppyRef}
          showPostAssemblyLoader={showPostAssemblyLoader}
          onAssemblyComplete={onAssemblyComplete}
          locale={locale}
          render={({ uppy }: RenderProps) => (
            <div className="uppy-wrapper">
              <DashboardComponent
                uppy={uppy}
                height={height ?? 400}
                width={width ?? 786}
                open={open ?? true}
                plugins={disablePluginSources ? undefined : pluginSources}
                {...(hideUploadButton ? { hideUploadButton } : {})}
              />
            </div>
          )}
        />
      </div>
    );
  }
}
