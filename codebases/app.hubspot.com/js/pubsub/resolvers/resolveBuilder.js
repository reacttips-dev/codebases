'use es6';

export var resolveBuilder = function resolveBuilder() {
  return import(
  /* webpackChunkName: "conversations-internal-pub-sub-client-builder" */
  'conversations-internal-pub-sub/conversations-pub-sub/builders/buildConversationsPubSub');
};