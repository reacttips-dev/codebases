'use es6';

import { simpleAction } from 'sales-modal/utils/salesModalReduxUtils';
import { countAllFetch } from 'sales-modal/utils/searchReduxUtils';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import { TEMPLATES, SEQUENCES, DOCUMENTS } from '../../constants/SalesModalTabs';
import { RECEIVE_COUNT } from '../actionTypes';

var receiveCount = function receiveCount(payload) {
  return simpleAction(RECEIVE_COUNT, payload);
};

var getContentType = function getContentType(currentTab) {
  switch (currentTab) {
    case TEMPLATES:
      return SearchContentTypes.TEMPLATE;

    case SEQUENCES:
      return SearchContentTypes.SEQUENCE;

    case DOCUMENTS:
      return SearchContentTypes.DOCUMENT;

    default:
      return null;
  }
};

export var fetchCount = function fetchCount(currentTab) {
  return countAllFetch(getContentType(currentTab), receiveCount);
};