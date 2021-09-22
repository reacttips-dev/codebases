import wrapApi from 'bundles/phoenix/lib/apiWrapper';

const API_DEFAULTS = {
  type: 'rest',
};

export default function (moreApiConfig: $TSFixMe) {
  const apiConfig = Object.assign({}, API_DEFAULTS, moreApiConfig);
  return wrapApi('/api/', apiConfig);
}
