import store from 'js/lib/coursera.store';

const LOCALSTORAGE_KEY = 'last_seen_week_';

export const getLastSeenWeek = (courseId) => {
  return store.get(`${LOCALSTORAGE_KEY}${courseId}`);
};

export const setLastSeenWeek = (courseId, week) => {
  return store.set(`${LOCALSTORAGE_KEY}${courseId}`, week);
};
