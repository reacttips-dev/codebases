import { compose } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';

import app from 'bundles/asset-admin/app';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import { FluxibleContext } from 'fluxible';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import { CONTENT_TYPES } from 'bundles/asset-admin/constants/AssetUpload';
import { Asset } from 'bundles/asset-admin/types/assets';
import {
  AssetAdminManagerHeader,
  DefaultAssetSelectorContents,
  FooterButtons,
} from 'bundles/asset-admin/components/AssetAdminManagerComponents';
import AssetBrowserV2 from 'bundles/asset-admin/components/AssetBrowserV2';
import BounceLoader from 'bundles/teach-course/components/BounceLoader';

import {
  fetchSuccessfulAttempts,
  initializeAssetManager,
  getAssetsListByContext,
  resetAssets,
} from 'bundles/asset-admin/actions/AssetAdminActions';
import {
  MODAL_WIDTH,
  NAME_FIELD,
  FILETYPE_FIELD,
  CREATED_AT_FIELD,
  TOOLBAR_SEARCH,
  TOOLBAR_FILETYPE_DROPDOWN,
  ASSET_MANAGER_SIZE,
} from 'bundles/asset-admin/constants/TableConstants';
import type { UploadCompletion, UppyRef } from 'bundles/asset-admin/types/uppy';
import UploadStatus from 'bundles/asset-admin/constants/UploadStatus';
import { OptionsContext } from 'bundles/cml/types/Content';

import 'css!bundles/asset-admin/components/__styles__/AssetAdminManager';

/*
 * Works very similarly to AssetAdminModal with differences in subcomponents shown/hidden, and use outside of modal.
 */

export type PropsFromCaller = {
  allowMultiple: boolean;
  assetContext: OptionsContext;
  assetType?: string;
  enableZoom?: boolean;
  title?: string;
  helperLinkId?: string;
  description?: string;
  onAfterConfirm?: () => void;
  onConfirmHandler?: (assets: Array<Asset>) => void;
  onCancel?: () => void;
  hideFooterButtonsOnDefault?: boolean;
  hideAssetLibraryLink?: boolean;
  uploaderHeight?: number;
  uploaderWidth?: number;
  assetBrowserWidth?: string;
  disablePluginSources?: boolean;
  assetCreationUrl?: string;
  customSubHeader?: React.ReactElement;
};

type PropsFromStores = {
  assetMap: { [assetId: string]: Asset & { url: { url: string; expires: number } } };
  assetsByPage: { [page: number]: Array<Asset> };
  nextPageIndex: number | null;
  totalAssets: number;
  uploadStatus: string;
  uploadedAssets: Array<Asset>;
  successfulAttemptIds: Array<string>;
  isAssetsListReady: boolean;
};

type Props = PropsFromCaller & PropsFromStores;

type State = {
  currentContent: CONTENT_TYPES;
  hideFooterButtons: boolean;
  hideAssetLink: boolean;
  selectedAssets: Set<Asset>;
  keyword?: string;
  assetTypeFilter?: string;
};

export class AssetAdminManager extends React.Component<Props, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  uppyRef: UppyRef = { current: undefined };

  defaultState = {};

  constructor(props: Props) {
    super(props);
    this.state = {
      currentContent: CONTENT_TYPES.DEFAULT,
      hideFooterButtons: props.hideFooterButtonsOnDefault || false,
      hideAssetLink: false,
      selectedAssets: new Set(),
      keyword: '',
    };
    this.defaultState = { ...this.state };
  }

  componentWillMount() {
    const { assetContext, assetType, hideAssetLibraryLink } = this.props;
    if (!hideAssetLibraryLink) {
      this.context.executeAction(initializeAssetManager, {
        ...assetContext,
        pageSize: ASSET_MANAGER_SIZE,
        fetchUrls: true,
        assetType,
      });
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { uploadStatus, successfulAttemptIds, assetContext, assetsByPage } = this.props;
    const { IN_PROGRESS, ASSEMBLIES_COMPLETED } = UploadStatus;

    if (prevProps.uploadStatus === IN_PROGRESS && uploadStatus === ASSEMBLIES_COMPLETED) {
      this.context.executeAction(fetchSuccessfulAttempts, {
        successfulAttemptIds,
        assetContext,
      });
    }

    const selectedFromAssetLibrary = prevState.selectedAssets.size === 0 && this.state.selectedAssets.size > 0;
    if (selectedFromAssetLibrary) {
      this.updateModalFunctions();
    }

    const currentPage = Math.ceil((this.props.nextPageIndex ?? this.props.totalAssets) / ASSET_MANAGER_SIZE);
    // if a search or filter is done, only keep visible selected assets
    if (
      prevState.currentContent === CONTENT_TYPES.ASSET_LIBRARY &&
      !isEqual(this.props.assetsByPage, prevProps.assetsByPage)
    ) {
      const currentShownAssets = assetsByPage && assetsByPage[currentPage];
      const assetArray = Array.from(this.state.selectedAssets);

      const visibleSelection = new Set(
        assetArray.filter((asset) => currentShownAssets.some((item) => isEqual(item, asset)) && asset)
      );

      if (visibleSelection.size !== this.state.selectedAssets.size) {
        this.setState({ selectedAssets: new Set(visibleSelection) });
        visibleSelection.forEach((asset) => this.handleSelection(asset));
      }
    }
  }

  updateModalFunctions = () => {
    this.setState({ hideFooterButtons: false, hideAssetLink: true });
  };

  handleUploadsComplete = ({ successful }: UploadCompletion): void => {
    // this is hooked automatically into the uppy lifecycle
    const { assetContext } = this.props;
    if (successful.length > 0) {
      this.context.executeAction(fetchSuccessfulAttempts, {
        successfulAttemptIds: successful.map((file) => file.meta.attemptId),
        assetContext,
      });
      this.updateModalFunctions();
    }
  };

  handleSelection = (asset: Asset) => {
    const { allowMultiple } = this.props;
    this.setState(({ selectedAssets }) => {
      const newSelectedAssets = allowMultiple ? new Set(selectedAssets) : new Set<Asset>();
      newSelectedAssets.add(asset);
      return { selectedAssets: newSelectedAssets };
    });
  };

  handleDeselection = (asset: Asset) => {
    this.setState(({ selectedAssets }) => {
      const newSelectedAssets = new Set(selectedAssets);
      newSelectedAssets.delete(asset);
      return { selectedAssets: newSelectedAssets };
    });
  };

  onFilter = (assetTypeFilter?: string) => {
    this.setState({ assetTypeFilter });
  };

  onConfirm = () => {
    const { uploadStatus, uploadedAssets, onConfirmHandler, onAfterConfirm, allowMultiple } = this.props;
    const { selectedAssets } = this.state;

    const confirmUppyImport = uploadStatus === UploadStatus.SUCCESS && uploadedAssets.length > 0;

    const confirmAssetLibraryImport =
      this.state.currentContent === CONTENT_TYPES.ASSET_LIBRARY && selectedAssets.size > 0;

    if (!confirmUppyImport && !confirmAssetLibraryImport) {
      this.onCancel();
      return;
    }

    let assetSelected: Array<Asset> = [];

    if (confirmUppyImport) {
      assetSelected = uploadedAssets;
    } else if (confirmAssetLibraryImport) {
      assetSelected = Array.from(selectedAssets);
    }
    if (!assetSelected.length) {
      return;
    }

    if (onConfirmHandler) {
      if (allowMultiple) {
        onConfirmHandler(assetSelected);
      } else {
        onConfirmHandler(assetSelected.slice(0, 1));
      }
    }

    if (onAfterConfirm) {
      onAfterConfirm();
    }
  };

  onAssetLibraryClick = () => {
    this.setState({ currentContent: CONTENT_TYPES.ASSET_LIBRARY });
    const { assetContext, assetType } = this.props;
    this.context.executeAction(getAssetsListByContext, {
      ...assetContext,
      pageSize: ASSET_MANAGER_SIZE,
      fetchUrls: true,
      assetType,
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    this.reset();
    if (onCancel) {
      onCancel();
    }
  };

  reset = () => {
    this.uppyRef.current?.cancelAll();
    this.setState(this.defaultState);
    this.context.executeAction(resetAssets);
  };

  render() {
    const {
      assetType,
      allowMultiple,
      nextPageIndex,
      assetContext,
      title,
      uploaderHeight,
      uploaderWidth,
      uploadedAssets,
      helperLinkId,
      totalAssets,
      assetsByPage,
      assetMap,
      isAssetsListReady,
      assetBrowserWidth,
      description,
      hideAssetLibraryLink,
      enableZoom,
      disablePluginSources,
      assetCreationUrl,
      customSubHeader,
    } = this.props;
    const { selectedAssets } = this.state;

    return (
      <section className="rc-AssetAdminManager">
        <AssetAdminManagerHeader
          onBack={this.reset}
          title={title}
          currentContent={this.state.currentContent}
          allowMultiple={allowMultiple}
          assetType={assetType}
          helperLinkId={helperLinkId}
          description={description}
        />
        {customSubHeader && <div className="custom-SubHeader">{customSubHeader}</div>}
        {this.state.currentContent === CONTENT_TYPES.DEFAULT && (
          <DefaultAssetSelectorContents
            courseId={assetContext.courseId as string}
            assetType={assetType}
            allowMultiple={allowMultiple}
            onUploadsComplete={this.handleUploadsComplete}
            onAssetLibraryClick={this.onAssetLibraryClick}
            hideAssetLibraryLink={hideAssetLibraryLink || this.state.hideAssetLink}
            uppyRef={this.uppyRef}
            uploaderHeight={uploaderHeight}
            uploaderWidth={uploaderWidth}
            enableZoom={enableZoom}
            disablePluginSources={disablePluginSources}
            assetCreationUrl={assetCreationUrl}
          />
        )}
        {this.state.currentContent === CONTENT_TYPES.ASSET_LIBRARY &&
          (isAssetsListReady ? (
            <div
              className={`rc-AssetBrowserV2 ${allowMultiple ? 'multi-select' : 'single-select'} ${
                assetBrowserWidth === MODAL_WIDTH ? 'modal-width' : 'flat-mid-width'
              }`}
            >
              <AssetBrowserV2
                courseId={assetContext.courseId as string}
                currentPage={Math.ceil((nextPageIndex ?? totalAssets) / ASSET_MANAGER_SIZE)}
                totalAssets={totalAssets}
                assetsByPage={assetsByPage}
                assetMap={assetMap}
                width={assetBrowserWidth}
                pageSize={ASSET_MANAGER_SIZE}
                fields={[NAME_FIELD, FILETYPE_FIELD, CREATED_AT_FIELD]}
                toolbar={[TOOLBAR_SEARCH, TOOLBAR_FILETYPE_DROPDOWN]}
                onSelect={this.handleSelection}
                onDeselect={this.handleDeselection}
                allowedAssetTypes={assetType}
                selectedAssets={this.state.selectedAssets}
                onFilter={this.onFilter}
                allowMultiple={allowMultiple}
              />
            </div>
          ) : (
            <BounceLoader />
          ))}
        {!this.state.hideFooterButtons && (
          <FooterButtons
            onCancel={this.onCancel}
            onContinue={this.onConfirm}
            selectedAssets={selectedAssets}
            uploadedAssets={uploadedAssets}
          />
        )}
      </section>
    );
  }
}

const ConnectedAssetAdminManager = compose<Props, PropsFromCaller>(
  connectToStores<Props, PropsFromCaller>(['AssetAdminStore'], ({ AssetAdminStore }) => {
    return {
      assetMap: AssetAdminStore.getAssetMap(),
      assetsByPage: AssetAdminStore.getAssetsByPage(),
      nextPageIndex: AssetAdminStore.getNextPageIndex(),
      totalAssets: AssetAdminStore.getTotalAssets(),
      uploadStatus: AssetAdminStore.getUploadStatus(),
      uploadedAssets: AssetAdminStore.getUploadedAssets(),
      successfulAttemptIds: AssetAdminStore.getSuccessFullAttemptIds(),
      isAssetsListReady: AssetAdminStore.isAssetsListReady(),
    };
  })
)(AssetAdminManager);

// [fe-tech-debt] CP-3854: this fluxible context wrapper is required to work with the scribe plugin for the older CML editor. Once that is deprecated, this can be removed.
export default class FluxibleAssetAdminManager extends React.Component<PropsFromCaller> {
  fluxibleContext: FluxibleContext | null = null;

  componentWillMount() {
    this.fluxibleContext = app.createContext();
  }

  render() {
    return (
      <FluxibleComponent context={this.fluxibleContext?.getComponentContext()}>
        <ConnectedAssetAdminManager {...this.props} />
      </FluxibleComponent>
    );
  }
}
