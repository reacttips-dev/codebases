import { find, values } from 'lodash';
import Uppy, { InternalMetadata } from '@uppy/core-1.13';

import ASSET_TYPES, { ALL_TYPES } from '../constants/AssetTypes';

type UppyFileMeta = InternalMetadata & { language: string | undefined };

export const getAssetType = (file: Uppy.UppyFile) => {
  // Some file types (e.g. xml, yaml) end up being null after being processed by Transloadit
  if (!file.type) {
    return ASSET_TYPES.Generic.name;
  }

  const lastDotIndex = file.name.lastIndexOf('.');
  const extension = lastDotIndex > -1 ? file.name.substring(lastDotIndex + 1) : '';

  const findType = (fileType: string, types: Array<string>) => {
    return find(types, (type) => !!fileType.match(type));
  };

  if (findType(file.type, ASSET_TYPES.Image.types)) {
    return ASSET_TYPES.Image.name;
  } else if (findType(file.type, ASSET_TYPES.Video.types) || ASSET_TYPES.Video.extensions.includes(extension)) {
    return ASSET_TYPES.Video.name;
  } else if (findType(file.type, ASSET_TYPES.Audio.types)) {
    return ASSET_TYPES.Audio.name;
  } else if (findType(file.type, ASSET_TYPES.Pdf.types)) {
    return ASSET_TYPES.Pdf.name;
    // only treat subtitle files as subtitle assets if they have a language code(https://coursera.atlassian.net/browse/CP-1664)
  } else if (
    (findType(file.type, ASSET_TYPES.Subtitle.types) || ASSET_TYPES.Subtitle.extensions.includes(extension)) &&
    (file.meta as UppyFileMeta).language
  ) {
    return ASSET_TYPES.Subtitle.name;
  } else {
    return ASSET_TYPES.Generic.name;
  }
};

export const mapAssetTypeToMimes = (assetType: string) => {
  const category = values(ASSET_TYPES).find(({ name }) => name === assetType);

  // entry is an array of [name, types]
  return category ? category.types : ALL_TYPES;
};

export const getTypeSpecificOptions = (assetType: string) => {
  let options;
  switch (assetType) {
    case ASSET_TYPES.Video.name: {
      options = {
        videoTemplate: 'fullVideo',
        tags: [
          {
            name: 'scope',
            value: 'video',
          },
        ],
      };
      break;
    }

    default: {
      options = { tags: [] };
      break;
    }
  }

  return options;
};
