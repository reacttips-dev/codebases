let subscribers = [];

const KEY_PREFIX = 'common/local-storage/';

export function setItem(key, value) {
  localStorage.setItem(`${KEY_PREFIX}-${key}`, JSON.stringify(value));
  _.each(subscribers, (subscriber) => subscriber());
}

export function getItem(key) {
  const item = localStorage.getItem(`${KEY_PREFIX}-${key}`);

  if (_.isNil(item) || item === 'undefined') {
    return undefined;
  } else {
    return JSON.parse(item);
  }
}

const unsubscribe = (subscriber) => {
  return () => _.pull(subscribers, subscriber);
};

export function subscribe(subscriber) {
  subscribers.push(subscriber);
  return unsubscribe(subscriber);
}
