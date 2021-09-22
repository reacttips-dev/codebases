import localStorageEx from 'bundles/common/utils/localStorageEx';

const BASE_KEY = 'InteractiveTranscript';

// TODO: Have more specific types
const StorageUtils = {
  set(key: string, value: any) {
    return localStorageEx.setItem(BASE_KEY + ':' + key, value, String);
  },

  get(key: string) {
    return localStorageEx.getItem(BASE_KEY + ':' + key, String, undefined);
  },
};

export default StorageUtils;
