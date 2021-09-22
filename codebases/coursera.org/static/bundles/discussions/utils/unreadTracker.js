import store from 'js/lib/coursera.store';
import moment from 'moment';

const LOCALSTORAGE_KEY = 'unreadTracker';

export const markRead = function (threadId) {
  const read = store.get(LOCALSTORAGE_KEY) || {};
  read[threadId] = Date.now();
  store.set(LOCALSTORAGE_KEY, read);
};

export const hasUnread = function (thread) {
  if (!thread) {
    return false;
  }

  const read = store.get(LOCALSTORAGE_KEY) || {};
  const readTime = thread.questionId && read[thread.questionId];

  const lastActivityTime = thread.lastAnsweredAt || thread.createdAt;
  return !readTime || moment(readTime).isBefore(lastActivityTime);
};

export default { markRead, hasUnread };
