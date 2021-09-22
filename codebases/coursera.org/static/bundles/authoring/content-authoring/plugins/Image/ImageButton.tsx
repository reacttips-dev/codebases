import React from 'react';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgPhoto } from '@coursera/coursera-ui/svg';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AssetManager from 'js/lib/AssetManager';
import _t from 'i18n!nls/authoring';
import type { Asset } from 'bundles/asset-admin/types/assets';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';

import { imageStrategy, hasImage } from './utils';
import type { SlateValue } from '../../types';

export type Props = {
  key?: string;
  isDisabled?: boolean;
};

// EditorToolbar passes these props down via the CMLEditorV2
type PropsFromEditor = {
  value: SlateValue;
  onChange: ({ value }: { value: SlateValue }) => void;
  toggleAssetModal: (
    showAssetModal?: boolean,
    isUploadingImage?: boolean,
    handleAssetModalSelect?: (selectedAssets: Array<Asset>) => void,
    handleAssetModalCancel?: () => void
  ) => void;
  assetManager: AssetManager;
};

class ImageButton extends React.Component<Props & Partial<PropsFromEditor>> {
  handleClick = () => {
    const { toggleAssetModal } = this.props;
    if (toggleAssetModal) {
      toggleAssetModal(true, true, this.handleAssetModalSelect, this.handleAssetModalCancel);
    }
  };

  handleAssetModalSelect = (selectedAssets: Array<Asset>) => {
    const { value, onChange, assetManager, toggleAssetModal } = this.props;

    if (!value) {
      return;
    }

    imageStrategy(value.change(), selectedAssets, assetManager, onChange);

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
        rootClassName="rc-ImageButton toolbar-button"
        type="icon"
        size="zero"
        svgElement={
          <SvgPhoto size={18} color={color.primaryText} title={_t('Embed Images')} style={{ marginTop: 4 }} />
        }
        onClick={this.handleClick}
        disabled={
          isDisabled || hasImage(value as SlateValue) || shouldDisableTool(value as SlateValue, BLOCK_TYPES.IMAGE)
        }
      />
    );
  }
}
export default ImageButton;
