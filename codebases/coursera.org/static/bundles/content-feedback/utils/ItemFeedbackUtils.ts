import _ from 'underscore';
import type { Category } from 'bundles/content-feedback/constants/ItemFlagCategories';
import itemFlagCategories from 'bundles/content-feedback/constants/ItemFlagCategories';
import { Helpful, Confused } from 'bundles/content-feedback/constants/ItemHelpfulOrConfused';
import type { FlagCategory } from 'bundles/authoring/course-content-feedback/types/courseContentFeedback';
import isFeedbackRedesignEnabled from './isFeedbackRedesignEnabled';
import type { ItemType } from '../constants/ItemTypes';

/**
 * Returns the visible flag categories to the current user.
 * @param itemType Item Type (optional). If not present, return categories across all items
 * @return Array of supported categories.
 */
export const getVisibleFlagCategories = (itemType: ItemType, isSuperuser: boolean) => {
  let categories;
  const categoryConstants = itemFlagCategories();

  if (itemType) {
    categories = categoryConstants[itemType];
  } else {
    categories = _(categoryConstants)
      .chain()
      .values()
      .flatten()
      .uniq((category) => category.id)
      .value();
  }

  let visibleCategories: Array<FlagCategory> = [];

  if (isSuperuser) {
    visibleCategories = categories;
  } else {
    visibleCategories = _(categories).filter((category) => category.isPublic);
  }

  return visibleCategories;
};

export const getHelpfulOrConfusedCategories = () => {
  return [new Helpful(), new Confused()];
};

export const getCategoriesForLearnerItemType = (itemTypeName: ItemType, courseId: string) => {
  const categoryConstants = itemFlagCategories();

  let categories: Category[] = categoryConstants[itemTypeName];

  if (isFeedbackRedesignEnabled(courseId)) {
    // filter out content improvement
    categories = _(categories).filter((category) => category.id !== 'content');
  }

  return categories;
};
