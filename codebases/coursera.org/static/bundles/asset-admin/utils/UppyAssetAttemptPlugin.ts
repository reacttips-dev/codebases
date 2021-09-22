import _t from 'i18n!nls/asset-admin';
import Core from '@uppy/core-1.13';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';

import {
  createAssetCreationAttempt,
  failAssetCreationAttempt,
} from 'bundles/asset-admin/utils/AssetCreationAttemptsApiUtils';
import type { AssetContext } from '../types/assets';
import type { AssetAssembly } from '../types/uppy';

type UppyOptions = {
  enabled: boolean;
  assetContext: AssetContext;
  pdfTemplate?: string;
  id: string;
  assetCreationUrl?: string;
};
export default class AssetAttemptPlugin extends Core.Plugin {
  opts: UppyOptions;

  constructor(uppy: Core.Uppy, opts: UppyOptions) {
    super(uppy, opts);
    this.id = opts.id || 'AssetAttemptPlugin';
    this.type = 'AssetAttemptPlugin';
    this.uppy = uppy;
    this.opts = opts;
  }

  // create an asset creation attempt before starting the transloadit upload process
  createAssetCreationAttempt = async (fileIds: Array<string>) => {
    const { pdfTemplate, assetContext, assetCreationUrl } = this.opts;

    const files = this.uppy.getFiles().filter((file) => fileIds.includes(file.id));
    await Promise.all(
      files.map((file: Core.UppyFile) => {
        const options = Object.assign({}, { name: file.name }, { pdfTemplate }, file.meta);
        return createAssetCreationAttempt(options, assetContext, file, assetCreationUrl).then((attemptedAsset) => {
          const { id, attemptId } = attemptedAsset;
          this.uppy.setFileMeta(id, { attemptId });
          this.uppy.emit('preprocess-progress', file, {
            mode: 'indeterminate',
            message: _t('Preparing Upload...'),
          });
        });
      })
    );

    files.forEach((file) => {
      this.uppy.emit('preprocess-complete', file);
    });
  };

  failAssetCreationAttempt = async (error: { assembly?: AssetAssembly }) => {
    if (error.assembly) {
      await failAssetCreationAttempt(error.assembly);
      if (getShouldLoadRaven()) {
        raven.captureException('Asset Creation Attempt Failure');
        raven.setExtraContext({ error });
      }
    }
  };

  install = () => {
    if (this.opts.enabled) {
      this.uppy.addPreProcessor(this.createAssetCreationAttempt);
      this.uppy.on('error', this.failAssetCreationAttempt);
    }
  };

  uninstall = () => {
    if (this.opts.enabled) {
      this.uppy.removePreProcessor(this.createAssetCreationAttempt);
      this.uppy.off('error', this.failAssetCreationAttempt);
    }
  };
}
