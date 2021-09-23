'use es6';

export var generateConversationInboxLabel = function generateConversationInboxLabel(conversationInbox) {
  return conversationInbox.get('hs_inbox_name');
};