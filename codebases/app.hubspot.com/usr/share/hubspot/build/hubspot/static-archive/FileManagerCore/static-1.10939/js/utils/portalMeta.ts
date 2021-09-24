import { Map as ImmutableMap } from 'immutable';
import { VidyardTosStatus } from '../Constants';
import PortalMetaCategoryIds from '../enums/PortalMetaCategoryIds';

var createCategoryValueGetter = function createCategoryValueGetter(defaultValue) {
  return function (categoryMap) {
    return categoryMap.get('category_value') || defaultValue;
  };
};

export var getVidyardTosStatus = createCategoryValueGetter(VidyardTosStatus.NOT_ASKED);
var getIsVideoPQLBannerDismissedValue = createCategoryValueGetter(false);
export var getIsVideoPQLBannerDismissed = function getIsVideoPQLBannerDismissed(videoPqlMap) {
  return getIsVideoPQLBannerDismissedValue(videoPqlMap) === 'true';
};

var createCategoryMapGetter = function createCategoryMapGetter(portalDataCategory) {
  return function (portalDataList) {
    return portalDataList.find(function (portalDataMap) {
      return portalDataMap.get('category') === portalDataCategory;
    }) || ImmutableMap();
  };
};

export var getVidyardTosMap = createCategoryMapGetter(PortalMetaCategoryIds.VIDYARD_TOS_STATUS);
export var getVideoPQLMap = createCategoryMapGetter(PortalMetaCategoryIds.DISMISS_VIDEO_PQL_V1);
export var getImportCopyrightMap = createCategoryMapGetter(PortalMetaCategoryIds.IMPORT_IMAGE_COPYRIGHT_NOTICE);

var getCategoryId = function getCategoryId(category) {
  if (category in PortalMetaCategoryIds) {
    return PortalMetaCategoryIds[category];
  }

  return null;
};

export var getCategoryName = function getCategoryName(categoryId) {
  return Object.keys(PortalMetaCategoryIds).find(function (category) {
    return getCategoryId(category) === categoryId;
  }) || null;
};
export var getCategoryMap = function getCategoryMap(portalMetaList, categoryId) {
  return portalMetaList.find(function (item) {
    return item ? item.get('category') === categoryId : false;
  }) || null;
};
export var getCategoryValues = function getCategoryValues(portalMetaList) {
  return ImmutableMap(portalMetaList.filter(function (item) {
    return Object.values(PortalMetaCategoryIds).includes(item.get('category'));
  }).map(function (item) {
    return [getCategoryName(item.get('category')), item.get('category_value')];
  }));
};