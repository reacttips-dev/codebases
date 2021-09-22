import _t from 'i18n!nls/asset-admin';
import Core from '@uppy/core-1.13';
import {
  succeedAssetCreationAttempt,
  failAssetCreationAttempt,
} from 'bundles/asset-admin/utils/AssetCreationAttemptsApiUtils';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';
import { UppyFile, AssetAssembly } from '../types/uppy';

type UppyOptions = { id?: string; enabled: boolean };

export default class AssetCreationPlugin extends Core.Plugin {
  opts: UppyOptions;

  assetCreationPromiseMap: { [attemptId: string]: Q.Promise<void> } = {};

  constructor(uppy: Core.Uppy, opts: UppyOptions) {
    super(uppy, opts);
    this.id = opts.id ?? 'AssetCreationPlugin';
    this.type = 'AssetCreationPlugin';
    this.uppy = uppy;
    this.opts = opts;
  }

  // enqueue an asset creation promise to wait for before completing the upload
  succeedAssetCreationAttempt = (assembly: AssetAssembly) => {
    const attemptId = assembly.fields.attemptId as string;

    if (assembly.ok === 'REQUEST_ABORTED') {
      return failAssetCreationAttempt(assembly);
    }

    this.assetCreationPromiseMap[attemptId] = succeedAssetCreationAttempt(assembly, this.uppy)
      .then(() => {
        const assetIds = [attemptId];
        this.uppy.log(`[assetCreation:complete]: ${assetIds} ${assembly}`, 'info');
        this.uppy.emit('assetCreation:complete', assetIds, assembly);
      })
      .catch((error) => {
        // [fe-tech-debt] CP-3095: we should update our asset upload flow to handle cancelled uploads correctly. For now, when a user cancels their upload, the assembly still returns an ok status so we ignore logging it https://transloadit.com/docs/api/#ok-codes
        if (assembly.ok === 'ASSEMBLY_CANCELED') {
          return;
        }

        const errorMessage = `${error.status} - ${error.responseText}`;
        this.uppy.log(
          `[assetCreation:error]: error - ${errorMessage}
          assembly - ${JSON.stringify(assembly)}`,
          'error'
        );

        this.uppy.log(`[assetCreation:error]: ${error} ${assembly}`, 'error');
        this.uppy.emit('assetCreation:error', error, assembly);
        if (getShouldLoadRaven()) {
          raven.setExtraContext({ error: errorMessage, assembly: JSON.stringify(assembly) });
          raven.captureException('Asset Creation Failure');
        }
      });
  };

  waitForAssetsToBeCreated = async (fileIds: Array<string>) => {
    const files = this.uppy.getFiles().filter((file) => fileIds.includes(file.id));

    await Promise.all(
      files.map(async (file) => {
        this.uppy.emit('postprocess-progress', file, {
          mode: 'indeterminate',
          message: _t('Saving Asset to Coursera...'),
        });
        try {
          const attemptId = (file as UppyFile & { meta: { attemptId: string } }).meta.attemptId;
          const assetCreationPromise = this.assetCreationPromiseMap[attemptId];
          if (!assetCreationPromise) {
            throw new Error(_t('We encountered an error saving your asset'));
          }
          await assetCreationPromise;
        } catch (error) {
          this.uppy.setState({ error });
        }
        this.uppy.emit('postprocess-complete', file);
      })
    );
  };

  install = () => {
    if (this.opts.enabled) {
      this.uppy.on('transloadit:complete', this.succeedAssetCreationAttempt);
      this.uppy.addPostProcessor(this.waitForAssetsToBeCreated);
    }
  };

  uninstall = () => {
    if (this.opts.enabled) {
      this.uppy.off('transloadit:complete', this.succeedAssetCreationAttempt);
      this.uppy.removePostProcessor(this.waitForAssetsToBeCreated);
    }
  };
}
