import React from 'react';
import _t from 'i18n!nls/asset-admin';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import { SvgArrowLeft } from '@coursera/coursera-ui/svg';
import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';
import { Button, color, Divider } from '@coursera/coursera-ui';
import { CONTENT_TYPES } from 'bundles/asset-admin/constants/AssetUpload';
import type { Asset } from 'bundles/asset-admin/types/assets';
import DashboardUploader from 'bundles/asset-admin/components/DashboardUploader';
import type { UploadCompletion, UppyRef } from 'bundles/asset-admin/types/uppy';
import PartnerHelpLink from 'bundles/authoring/common/components/PartnerHelpLink';

type DefaultAssetSelectorContentsProps = {
  courseId: string;
  assetType?: string;
  allowMultiple: boolean;
  onUploadsComplete: (uploadCompletion: UploadCompletion) => void;
  hideAssetLibraryLink: boolean;
  onAssetLibraryClick: () => void;
  uppyRef: UppyRef;
  uploaderHeight?: number;
  uploaderWidth?: number;
  enableZoom?: boolean;
  disablePluginSources?: boolean;
  assetCreationUrl?: string;
};

export const DefaultAssetSelectorContents: React.SFC<DefaultAssetSelectorContentsProps> = (props) => {
  const {
    courseId,
    assetType,
    allowMultiple,
    onUploadsComplete,
    onAssetLibraryClick,
    hideAssetLibraryLink,
    uploaderHeight,
    uploaderWidth,
    uppyRef,
    enableZoom,
    disablePluginSources,
    assetCreationUrl,
  } = props;
  const assetLibraryButton = (
    <div className="asset-library-section">
      <Divider>
        <span className="text-muted">{_t('or')}</span>
      </Divider>
      <Button onClick={onAssetLibraryClick} data-testid="asset-library-button" rootClassName="asset-library-button">
        {_t('Find in asset library')}
      </Button>
    </div>
  );

  return (
    <div className="rc-DefaultAssetSelectorContents">
      <div className="dashboard-wrapper">
        <DashboardUploader
          courseId={courseId}
          assetType={assetType}
          allowMultiple={allowMultiple}
          inline={true}
          onUploadsComplete={onUploadsComplete}
          height={uploaderHeight || 400}
          width={uploaderWidth || 786}
          uppyRef={uppyRef}
          enableZoom={enableZoom}
          disablePluginSources={disablePluginSources}
          assetCreationUrl={assetCreationUrl}
        />
      </div>
      {!hideAssetLibraryLink && assetLibraryButton}
    </div>
  );
};

type AssetAdminManagerHeaderPropTypes = {
  onBack: () => void;
  title?: string;
  description?: string;
  currentContent: CONTENT_TYPES;
  allowMultiple: boolean;
  assetType?: string;
  helperLinkId?: string;
};

export const AssetAdminManagerHeader: React.SFC<AssetAdminManagerHeaderPropTypes> = (props) => {
  const { onBack, title, currentContent, allowMultiple, assetType, helperLinkId, description } = props;
  const asset = assetType || 'default';
  let descriptionComponent;

  const defaultDescriptions = {
    video: _t(
      'You can add {fileTypes, plural, =0 {a video} other {videos}} to your library by importing {fileTypes, plural, =0 {a file} other {one or more files}} here. After importing, you’ll be able to edit the asset name in the Asset Library.'
    ),
    image: _t(
      'You can add {fileTypes, plural, =0 {an image} other {images}} to your library by importing {fileTypes, plural, =0 {a file} other {one or more files}} here. After importing, you’ll be able to edit the asset names and accessibility descriptions in the Asset Library.'
    ),
    default: _t(
      'You can add {fileTypes, plural, =0 {an asset} other {assets}} to your library by importing {fileTypes, plural, =0 {a file} other {one or more files}} here. After importing, you’ll be able to edit the asset name in the Asset Library.'
    ),
  };

  if (currentContent === CONTENT_TYPES.DEFAULT) {
    descriptionComponent = (
      <CdsMigrationTypography variant="body1" cuiComponentName="P" className="asset-description">
        <FormattedMessage
          message={description || defaultDescriptions[asset as keyof typeof defaultDescriptions]}
          fileTypes={allowMultiple ? 1 : 0}
        />
        &nbsp;
        {helperLinkId && <PartnerHelpLink articleId={helperLinkId} />}
      </CdsMigrationTypography>
    );
  }

  if (currentContent === CONTENT_TYPES.ASSET_LIBRARY) {
    const assetDescriptions = {
      video: _t('Choose {fileTypes, plural, =0 {a video} other {videos}} from your Asset Library to use.'),
      image: _t('Choose {fileTypes, plural, =0 {an image} other {images}} from your Asset Library to use.'),
      default: _t('Choose {fileTypes, plural, =0 {an asset} other {assets}} from your Asset Library to use.'),
    };

    descriptionComponent = (
      <CdsMigrationTypography variant="body1" cuiComponentName="P" className="asset-description">
        <FormattedMessage
          message={assetDescriptions[asset as keyof typeof assetDescriptions]}
          fileTypes={allowMultiple ? 1 : 0}
        />
      </CdsMigrationTypography>
    );
  }

  const buttonComponent = (
    <Button onClick={onBack} type="link" label={_t('Back')} rootClassName="back-btn">
      <SvgArrowLeft size={24} color={color.primary} hoverColor={color.darkPrimary} />
    </Button>
  );

  return (
    <header className="rc-AssetAdminManagerHeader">
      {title && (
        <CdsMigrationTypography variant="h1semibold" component="h2" cuiComponentName="H2">
          {title}
        </CdsMigrationTypography>
      )}
      {currentContent === CONTENT_TYPES.ASSET_LIBRARY && buttonComponent}
      {descriptionComponent}
    </header>
  );
};

type FooterButtonsProps = {
  onCancel: () => void;
  onContinue: () => void;
  selectedAssets: Set<Asset>;
  uploadedAssets: Array<Asset>;
};

export const FooterButtons: React.SFC<FooterButtonsProps> = (props) => {
  const { onCancel, onContinue, selectedAssets, uploadedAssets } = props;
  const enableContinue = selectedAssets?.size > 0 || uploadedAssets?.length > 0;

  return (
    <footer className="rc-AssetAdminManager-FooterButtons">
      <Button size="md" onClick={onCancel} data-testid="cancel-button">
        {_t('Cancel')}
      </Button>
      <Button size="md" type="primary" onClick={onContinue} disabled={!enableContinue} data-testid="continue-button">
        {_t('Continue')}
      </Button>
    </footer>
  );
};
