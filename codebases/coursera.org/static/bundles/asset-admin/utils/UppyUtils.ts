/* eslint-disable camelcase */
import { Uppy, InternalMetadata, UppyFile } from '@uppy/core-1.13';
import Transloadit from '@uppy/transloadit';
import GoogleDrive from '@uppy/google-drive';
import Url from '@uppy/url';
import Dropbox from '@uppy/dropbox';
import OneDrive from '@uppy/onedrive';
import Zoom from '@uppy/zoom';
import { Assembly } from 'bundles/authoring/common/types/Upload';
import AssetAttemptPlugin from 'bundles/asset-admin/utils/UppyAssetAttemptPlugin';
import AssetCreationPlugin from 'bundles/asset-admin/utils/UppyAssetCreationPlugin';
import { UppyEvents } from 'bundles/asset-admin/types/uppy';
import PostAssemblyLoaderPlugin from 'bundles/asset-admin/utils/PostAssemblyLoaderPlugin';

export const DEFAULT_KEY = '05912e90e83346abb96c261bf458b615';
export const DEFAULT_TEMPLATE_ID = '9fe2b030809a11e4943d19e60b9af16b';
const UPPY_ID = 'uppyInstance';

// transloadit hosted companion information
const COMPANION = 'https://api2.transloadit.com/companion';
const COMPANION_PATTERN = /\.transloadit\.com$/;

/*
 * Utility function for easily creating an Uppy instance preconfigured to work with our asset service
 * or more generically with configuration parameters
 */
export default function createUppyInstance({
  params = {},
  events = {},
  key = DEFAULT_KEY,
  templateId = DEFAULT_TEMPLATE_ID,
  uppyId = UPPY_ID,
  assetContext,
  pdfTemplate,
  uploadToAssetService = true,
  assetCreationUrl,
  showPostAssemblyLoader = false,
  onAssemblyComplete,
}: {
  params: {};
  events: UppyEvents;
  key: string;
  templateId: string;
  uppyId: string;
  assetContext: { courseId?: string };
  pdfTemplate?: {};
  uploadToAssetService?: boolean;
  assetCreationUrl?: string;
  showPostAssemblyLoader?: boolean;
  onAssemblyComplete?: (assembly: Assembly) => void;
}) {
  // set `debug: true` for e2e tests, possibly check window.href to contain `teach/e2e-test-000-empty-` ?
  const debug = typeof window === 'undefined' ? false : window.location.href.includes('/e2e-test-');

  const defaultParams = { debug, autoProceed: false };
  const uppy = new Uppy({ ...defaultParams, ...params, id: uppyId })
    // set up cloud to cloud upload companions
    .use(GoogleDrive, {
      companionUrl: COMPANION,
      companionAllowedHosts: COMPANION_PATTERN,
    })
    .use(OneDrive, {
      companionUrl: COMPANION,
      companionAllowedHosts: COMPANION_PATTERN,
    })
    .use(Dropbox, {
      companionUrl: COMPANION,
      companionAllowedHosts: COMPANION_PATTERN,
    })
    .use(Zoom, {
      companionUrl: COMPANION,
      companionAllowedHosts: COMPANION_PATTERN,
    })
    .use(Url, {
      companionUrl: COMPANION,
      companionAllowedHosts: COMPANION_PATTERN,
    })
    // handle asset creation attempts before transloadit uploads
    .use(AssetAttemptPlugin, { assetContext, pdfTemplate, enabled: uploadToAssetService, assetCreationUrl })
    .use(Transloadit, {
      // limit's concurrent uploads, recommended value per the uppy documentation
      limit: 10,
      waitForEncoding: true,
      getAssemblyOptions(file: UppyFile & { meta: InternalMetadata & { templateId?: string; attemptId: string } }) {
        return {
          params: {
            notify_url: '',
            wait: true,
            auth: { key },
            template_id: file.meta.templateId || templateId,
          },
          fields: {
            attemptId: file.meta.attemptId,
          },
        };
      },
    })
    // handle actual asset creation after transloadit uploads
    .use(AssetCreationPlugin, { enabled: uploadToAssetService })
    // show a loading status after assembly completes if enabled
    .use(PostAssemblyLoaderPlugin, {
      enabled: showPostAssemblyLoader,
      onAssemblyComplete,
    });

  Object.entries(events).forEach(([event, action]) => uppy.on(event, action));
  return uppy;
}
