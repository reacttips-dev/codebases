'use es6';

import { getKnowledgeBaseEnabled } from '../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { lazyWithPreload } from '../utils/lazyWithPreload';
var ThreadView = lazyWithPreload(function () {
  return import(
  /* webpackChunkName: "CurrentView-ThreadView" */
  '../components/ThreadView');
});
var KnowledgeBaseContainer = lazyWithPreload(function () {
  return import(
  /* webpackChunkName: "CurrentView-KnowledgeBaseContainer" */
  '../knowledge-base/components/KnowledgeBaseContainer');
});
export var preloadThreadViewOrKnowledgeBase = function preloadThreadViewOrKnowledgeBase() {
  return function (__dispatch, getState) {
    if (getKnowledgeBaseEnabled(getState())) {
      KnowledgeBaseContainer.preload();
    } else {
      ThreadView.preload();
    }
  };
};