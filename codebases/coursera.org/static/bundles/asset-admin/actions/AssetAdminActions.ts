import { map } from 'lodash';
import raven from 'raven-js';
import { getShouldLoadRaven } from 'js/lib/sentry';
import { ActionContext } from 'js/lib/ActionContext';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import AssetManager from 'js/lib/AssetManager';
import CourseAssetAdminApiUtils from 'bundles/asset-admin/utils/CourseAssetAdminApiUtils';
import AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';

import { dismissNoticeMessage, isNoticeMessageDismissed } from 'bundles/asset-admin/utils/NoticeUtils';
import type { UpdateAssetDataPayload } from 'bundles/asset-admin/utils/CourseAssetAdminApiUtils';
import { PAGE_SIZE } from '../constants/TableConstants';
import type { Asset, AssetConfig, AssetMap } from '../types/assets';
import type { UploadStatusType } from '../constants/UploadStatus';

const WAIT_BEFORE_FETCH = 1000; // milliseconds to wait before fetching assets, see PARTNER-18185

type AssetsListByContextResponse = {
  elements: Array<Asset>;
  paging: {
    next: number;
    total: number;
  };
};

export const getAssetsListByContext = (actionContext: ActionContext, config: AssetConfig) => {
  const isInitialFetch = !config.startIndex;
  const pageSize = config.pageSize || PAGE_SIZE;

  if (isInitialFetch) {
    actionContext.dispatch('START_RECEIVING_ASSETS');
  }

  return CourseAssetAdminApiUtils.getAssetsListByContext(config)
    .then((response: AssetsListByContextResponse | null) => {
      if (!response) {
        return {};
      }

      const assets = response.elements;
      const nextPageIndex = response.paging.next;
      const totalAssets = response.paging.total;

      if (config.fetchUrls) {
        const assetIds = map(assets, 'id');
        const assetManager = new AssetManager();
        return assetManager.getAssetMap(assetIds).then((assetMap: AssetMap) => {
          actionContext.dispatch('RECEIVED_ASSETS_LIST', {
            assets,
            nextPageIndex,
            totalAssets,
            assetMap,
            isInitialFetch,
            pageSize,
          });
        });
      } else {
        return actionContext.dispatch('RECEIVED_ASSETS_LIST', {
          assets,
          nextPageIndex,
          totalAssets,
          isInitialFetch,
          pageSize,
        });
      }
    })
    .catch((error) => {
      // [fe-tech-debt] CP-5902: We should let the user know when this retrieval fail.
      if (typeof window !== undefined && getShouldLoadRaven()) {
        raven.setExtraContext({ error, config: JSON.stringify(config) });
        raven.captureException('Error getting assets by context list');
      }
    });
};

export const initializeAssetManager = (actionContext: ActionContext, config: AssetConfig) => {
  return CourseAssetAdminApiUtils.getCourse(config.courseId).then((response: { elements: Array<AuthoringCourse> }) => {
    actionContext.dispatch('INITIALIZED', {
      course: response.elements[0],
      noticeDismissed: isNoticeMessageDismissed(),
    });

    if (!config.hideAssets) {
      getAssetsListByContext(actionContext, config);
    }
  });
};

export const initializePage = (actionContext: ActionContext, config: AssetConfig) => {
  actionContext.dispatch('INITIALIZED', {
    noticeDismissed: isNoticeMessageDismissed(),
  });

  return getAssetsListByContext(actionContext, {
    courseId: config.courseId,
    pageSize: config.pageSize || PAGE_SIZE,
    fetchUrls: true,
  });
};

export const setNextPageIndex = (actionContext: ActionContext, { nextPageIndex }: { nextPageIndex: number }) => {
  actionContext.dispatch('SET_NEXT_PAGE_INDEX', nextPageIndex);
};

export const resetAssets = (actionContext: ActionContext) => {
  actionContext.dispatch('RESET_ASSETS');
};

export const updateAssetData = (
  actionContext: ActionContext,
  { courseId, assetId, description, longDescription, name }: UpdateAssetDataPayload
) => {
  actionContext.dispatch('UPDATE_ASSET_DATA_START');

  return CourseAssetAdminApiUtils.updateNameAndDescription({ courseId, assetId, name, description, longDescription })
    .then(() => {
      actionContext.dispatch('UPDATE_ASSET_DATA', { assetId, name, description, longDescription });
    })
    .catch(() => {
      actionContext.dispatch('UPDATE_ASSET_FAIL');
    });
};

export const resetUpdateDescription = (actionContext: ActionContext) => {
  actionContext.dispatch('RESET_UPDATE_ASSET_DESCRIPTION');
};

export const updateUploadProgress = (actionContext: ActionContext, uploadStatus: UploadStatusType) => {
  actionContext.dispatch('UPLOAD_STATUS_UPDATED', uploadStatus);
};

export const fetchSuccessfulAttempts = (
  // updates the list of uploaded files in assets store
  actionContext: ActionContext,
  { assetContext, successfulAttemptIds }: { assetContext: { courseId: string }; successfulAttemptIds: Array<string> }
) => {
  CourseAssetAdminApiUtils.getAssetsById(successfulAttemptIds).then((response: { elements: Array<Asset> }) => {
    actionContext.dispatch('ADD_UPLOADED_FILES', response.elements);
  });
};

export const deleteAsset = (
  actionContext: ActionContext,
  { assetIds, courseId, pageSize, keyword, assetType }: { assetIds: Array<string>; courseId: string } & AssetConfig
) => {
  CourseAssetAdminApiUtils.deleteAssets(assetIds).then(() => {
    // wait for BE indexes to update before refetching, see PARTNER-18185
    setTimeout(() => {
      getAssetsListByContext(actionContext, {
        courseId,
        fetchUrls: true,
        keyword,
        assetType,
        pageSize,
      });
    }, WAIT_BEFORE_FETCH);
  });
};

export const dismissNotice = (actionContext: ActionContext) => {
  dismissNoticeMessage();
  actionContext.dispatch('NOTICE_MESSAGE_DISMISSED');
};
