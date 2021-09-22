import React from 'react';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgAttachment } from '@coursera/coursera-ui/svg';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AssetManager from 'js/lib/AssetManager';
import type { Asset } from 'bundles/asset-admin/types/assets';
import type { SlateValue, SlateChange } from 'bundles/authoring/content-authoring/types';

import _t from 'i18n!nls/authoring';
import { assetStrategy, hasAsset } from './utils';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';


export type Props = {
  isDisabled?: boolean;
};

type PropsFromEditor = {
  toggleAssetModal: (
    showAssetModal?: boolean,
    isUploadingImage?: boolean,
    handleAssetModalSelect?: (selectedAssets: Array<Asset>) => void,
    handleAssetModalCancel?: () => void
  ) => void;
  value: SlateValue;
  onChange: (change: SlateChange) => void;
  assetManager: AssetManager;
};

class AssetButton extends React.Component<Props & Partial<PropsFromEditor>> {
  handleClick = () => {
    const { toggleAssetModal } = this.props;

    if (toggleAssetModal) {
      toggleAssetModal(true, false, this.handleAssetModalSelect, this.handleAssetModalCancel);
    }
  };

  handleAssetModalSelect = (selectedAssets: Array<Asset>) => {
    const { value, onChange, assetManager, toggleAssetModal } = this.props;

    if (!value) {
      return;
    }
    assetStrategy(value.change(), selectedAssets, assetManager, onChange);

    if (toggleAssetModal) {
      toggleAssetModal(false);
    }
  };

  handleAssetModalCancel = () => {
    const { toggleAssetModal } = this.props;

    if (toggleAssetModal) {
      toggleAssetModal(false);
    }
  };

  render() {
    const { value, isDisabled = false } = this.props;

    return (
      <SvgButton
        rootClassName="rc-AssetButton toolbar-button"
        type="icon"
        size="zero"
        svgElement={<SvgAttachment size={14} color={color.primaryText} title={_t('Attach Assets')} />}
        onClick={this.handleClick}
        disabled={
          isDisabled || hasAsset(value as SlateValue) || shouldDisableTool(value as SlateValue, BLOCK_TYPES.ASSET)
        }
      />
    );
  }
}

export default AssetButton;
