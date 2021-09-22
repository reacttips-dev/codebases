import Q from 'q';
import Uppy from '@uppy/core-1.13';
import { flatten, values } from 'lodash';
import API from 'js/lib/api';
import URI from 'jsuri';

import type { AssemblyFields } from 'bundles/authoring/common/types/Upload';
import { getAssetType, getTypeSpecificOptions } from './AssetUploaderUtils';
import type {
  UppyFile,
  AssetOptions,
  FileAttempt,
  SuccessAsset,
  AssetAssembly,
  ValidAssetSources,
} from '../types/uppy';
import type { AssetContext } from '../types/assets';

import UppyAssetUploadSources from '../constants/UppyAssetUploadSources';

const assetCreationAttemptsAPI = API('/api/assetCreationAttempts.v1/', { type: 'rest' });

export const createAssetCreationAttempt = (
  assetOptions: AssetOptions,
  context: AssetContext,
  file: Uppy.UppyFile,
  assetCreationUrl = '/api/authoringAssetCreationAttempts.v1'
): Q.Promise<FileAttempt> => {
  const typeName = 'pending';
  const assetType = getAssetType(file);
  const typeSpecificOptions = getTypeSpecificOptions(assetType);
  // default asset creation endpoint is the authoring one, but for new use cases like
  // learner-side forums we override this to use product-specific urls to avoid permission issues
  const assetCreationAttemptAPI = API(assetCreationUrl, { type: 'rest' });

  const pendingAssetCreation = {
    assetType,
    typeName,
    ...typeSpecificOptions,
    ...assetOptions,
  };

  const data = {
    pendingAssetCreation,
    context,
  };

  return Q(assetCreationAttemptAPI.post('', { data })).then((resp) => {
    const attemptId = resp.elements[0].id;
    return { ...file, attemptId };
  });
};

export const succeedAssetCreationAttempt = (assembly: AssetAssembly, uppy: Uppy.Uppy): Q.Promise<void> => {
  const { attemptId }: AssemblyFields = assembly.fields;
  const uri = new URI(attemptId);
  const allFiles = flatten(values(assembly.results));
  const uppyFiles: Array<UppyFile & { meta: { attemptId: string } }> = uppy.getFiles();

  const assets: Array<SuccessAsset> = allFiles.map((asset) => {
    const uppyFileSource = uppyFiles.find((file) => file.meta.attemptId === assembly.fields.attemptId)?.source || '';

    return {
      filename: asset.name,
      mime: asset.mime,
      size: asset.size,
      sslUrl: asset.ssl_url,
      url: asset.url,
      pageCount: asset.meta.page_count,
      duration: asset.meta.duration,
      audioBitRate: asset.meta.audio_bit_rate,
      subtitleType: asset.meta.subtitle_type,
      sourceType: UppyAssetUploadSources[uppyFileSource as keyof typeof UppyAssetUploadSources] as ValidAssetSources,
    };
  });

  const data = {
    typeName: 'successful',
    transloaditData: JSON.stringify(assembly),
    assets,
  };

  return Q(assetCreationAttemptsAPI.put(uri.toString(), { data }));
};

export const failAssetCreationAttempt = (assembly: AssetAssembly): Q.Promise<Array<string>> => {
  const uri = new URI(assembly.fields.attemptId);

  const data = {
    typeName: 'failed',
    transloaditData: JSON.stringify(assembly),
    errorMessage: assembly.error,
  };

  return Q(assetCreationAttemptsAPI.put(uri.toString(), { data })).then((resp) =>
    resp.elements.map((element: { id: number }) => element.id)
  );
};
