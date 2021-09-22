import createLoadableComponent from 'js/lib/createLoadableComponent';

import { Category } from 'bundles/content-feedback/constants/ItemFlagCategories';

import _t from 'i18n!nls/content-feedback';

const LoadableFlagFeedbackEditor = createLoadableComponent(() =>
  import('bundles/content-feedback/components/flag/FlagFeedbackEditor')
);

export class Helpful extends Category {
  constructor() {
    super('helpful', _t('Helpful'), _t('This item contained useful information!'), true, LoadableFlagFeedbackEditor);
  }
}

export class Confused extends Category {
  constructor() {
    super('confused', _t('Confused'), _t('This item was difficult to interpret.'), true, LoadableFlagFeedbackEditor);
  }
}
