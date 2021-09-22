import Immutable from 'immutable';
import Q from 'q';
import type { Asset, AssetMap } from 'bundles/asset-admin/types/assets';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AssetManager from 'js/lib/AssetManager';
import { BLOCK_TYPES } from '../../constants';
import { insertImage } from '../Image/utils';
import type { SlateChange, SlateValue, SlateBlock } from '../../types';

export const getNameAndExtension = (asset: Asset, assetFromMap: AssetMap) => {
  const { filename } = asset;
  const { fileExtension } = assetFromMap;

  let name = filename;
  let extension = fileExtension || '';

  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex > -1) {
    name = filename.substring(0, lastDotIndex);
    extension = extension || filename.substring(lastDotIndex + 1);
  }

  return { name, extension };
};

export function insertAsset(
  change: SlateChange,
  asset: Asset,
  assetFromMap: AssetMap,
  onChange?: (change: SlateChange) => void
) {
  const { name, extension } = getNameAndExtension(asset, assetFromMap);
  const { typeName: assetType, id: assetId } = asset;

  if (assetType === 'image') {
    insertImage(change, assetId, onChange);
  } else if (onChange) {
    onChange(
      change
        .insertBlock({
          type: BLOCK_TYPES.ASSET,
          data: Immutable.fromJS({
            attributes: {
              ...asset,
              assetType,
              name,
              extension,
            },
          }),
        })
        .insertBlock(BLOCK_TYPES.PARAGRAPH)
        .focus()
    );
  }
}

export const hasAsset = (value: SlateValue) =>
  value.blocks.some((block: SlateBlock) => block.type === BLOCK_TYPES.ASSET);

export const assetStrategy = (
  change: SlateChange,
  selectedAssets: Array<Asset>,
  assetManager: AssetManager,
  onChange?: (change: SlateChange) => void
) => {
  const assetIds = selectedAssets.map((asset) => asset.id);

  Q(assetManager.getAssetMap(assetIds)).then((assetMap) => {
    selectedAssets.forEach((asset) => {
      insertAsset(change, asset, assetMap[asset.id], onChange);
    });
  });
};
