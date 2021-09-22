import Immutable from 'immutable';
import Q from 'q';
import type { Asset } from 'bundles/asset-admin/types/assets';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AssetManager from 'js/lib/AssetManager';
import { BLOCK_TYPES } from '../../constants';
import type { SlateChange, SlateValue } from '../../types';

export function insertImage(change: SlateChange, assetId: string, onChange?: (change: SlateChange) => void): void {
  if (onChange) {
    onChange(
      change
        .insertBlock({
          type: BLOCK_TYPES.IMAGE,
          data: Immutable.fromJS({
            attributes: {
              assetId,
            },
          }),
        })
        .insertBlock(BLOCK_TYPES.PARAGRAPH)
        .focus()
    );
  }
}

export const imageStrategy = (
  change: SlateChange,
  selectedAssets: Array<Asset>,
  assetManager: AssetManager,
  onChange?: (change: SlateChange) => void
): void => {
  const assetIds = selectedAssets.map((asset) => asset.id);

  Q(assetManager.getAssetMap(assetIds)).then(() => {
    selectedAssets.forEach((asset) => {
      insertImage(change, asset.id, onChange);
    });
  });
};

export const hasImage = (value: SlateValue): boolean =>
  value && value.blocks.some((block) => block.type === BLOCK_TYPES.IMAGE);
