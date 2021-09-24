'use es6';

import sort from 'SalesContentIndexUI/data/utils/sort';
import { NAME_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
import SortValues from 'SalesContentIndexUI/data/constants/SortValues';
export default sort(NAME_FIELD, SortValues.ASC);