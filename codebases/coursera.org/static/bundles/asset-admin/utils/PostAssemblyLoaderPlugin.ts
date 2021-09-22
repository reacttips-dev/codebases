import Core from '@uppy/core-1.13';
import { Assembly } from 'bundles/authoring/common/types/Upload';
import _t from 'i18n!nls/asset-admin';

type UppyOptions = {
  id?: string;
  enabled: boolean;
  onAssemblyComplete?: (assembly: Assembly) => void;
};

// sets the progress bar to show that next step is in progress
export default class PostAssemblyLoaderPlugin extends Core.Plugin {
  opts: UppyOptions;

  constructor(uppy: Core.Uppy, opts: UppyOptions) {
    super(uppy, opts);
    this.id = opts.id ?? 'PostAssemblyLoaderPlugin';
    this.type = 'PostAssemblyLoaderPlugin';
    this.uppy = uppy;
    this.opts = opts;
  }

  onAssemblyComplete = (assembly: Assembly) => {
    this.opts.onAssemblyComplete?.(assembly);
  };

  showPendingStatusBar = async (fileIds: Array<string>) => {
    const files = this.uppy.getFiles().filter((file) => fileIds.includes(file.id));
    files.forEach((file) => {
      this.uppy.emit('postprocess-progress', file, {
        mode: 'indeterminate',
        message: _t('Processing...'),
      });
    });
  };

  install = () => {
    if (this.opts.enabled) {
      this.uppy.addPostProcessor(this.showPendingStatusBar);
      this.uppy.on('transloadit:complete', this.onAssemblyComplete);
    }
  };

  uninstall = () => {
    if (this.opts.enabled) {
      this.uppy.removePostProcessor(this.showPendingStatusBar);
      this.uppy.off('transloadit:complete', this.onAssemblyComplete);
    }
  };
}
