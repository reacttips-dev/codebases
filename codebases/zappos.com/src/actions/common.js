import { PAGE_TYPE_CHANGE } from 'constants/reduxActions';

export const pageTypeChange = pageType => ({
  type: PAGE_TYPE_CHANGE,
  pageType
});
