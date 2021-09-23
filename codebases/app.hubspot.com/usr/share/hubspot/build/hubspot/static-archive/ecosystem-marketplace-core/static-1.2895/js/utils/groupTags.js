'use es6';

import memoize from './memoize';
import * as Category from '../constants/groupTags/Category';
import * as SuperCategory from '../constants/groupTags/SuperCategory';
import * as SuperCategoryGroup from '../constants/groupTags/SuperCategoryGroup';
import * as CategorySlug from '../constants/urlSlugs/CategorySlug';
import * as SuperCategorySlug from '../constants/urlSlugs/SuperCategorySlug';
var superCategoryValues = Object.values(SuperCategory);
var getSuperCategoryGroupValues = memoize(function (superCategory) {
  return SuperCategoryGroup[superCategory];
});
export var getCategorySuperCategory = memoize(function (category) {
  switch (category) {
    case Category.DATA_MANAGEMENT:
      return SuperCategory.MARKETING;

    case Category.LIVE_CHAT:
      return SuperCategory.MARKETING;

    case Category.VIDEO:
      return SuperCategory.MARKETING;

    default:
      return superCategoryValues.find(function (superCategory) {
        var superCategoryGroupValues = getSuperCategoryGroupValues(superCategory);
        return superCategoryGroupValues.includes(category);
      });
  }
});
export var getSuperCategoriesForCategory = memoize(function (category) {
  return superCategoryValues.filter(function (superCategory) {
    var superCategoryGroupValues = getSuperCategoryGroupValues(superCategory);
    return superCategoryGroupValues.includes(category);
  });
});
export var getAdminToolSlugDisplay = function getAdminToolSlugDisplay(category, slug) {
  var superCategory = getCategorySuperCategory(category);
  return "/" + SuperCategorySlug[superCategory] + "/" + CategorySlug[category] + "/" + slug;
};