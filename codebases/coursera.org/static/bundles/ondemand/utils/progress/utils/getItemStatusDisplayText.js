import { ItemStatus } from 'bundles/ondemand/utils/progress/constants';
import _t from 'i18n!nls/ondemand';

export default (itemStatus) => {
  switch (itemStatus) {
    case ItemStatus.COMPLETED:
      return _t('Passed');
    case ItemStatus.FAILED:
      return _t('Try again');
    case ItemStatus.OVERDUE:
      return _t('Overdue');
    default:
      return '';
  }
};
