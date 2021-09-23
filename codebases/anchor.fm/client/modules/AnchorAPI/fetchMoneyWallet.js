import Promise from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const fetchMoneyWallet = ({ isCacheBust }) => {
  const urlPath = '/api/proxy/v3/wallet';
  return new Promise((resolve, reject) => {
    fetch(isCacheBust ? `${urlPath}?${Date.now()}` : urlPath, {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(resolve)
      .catch(reject);
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new AnchorAPIError(response, 'Server error.');
    })
    .then(responseJson => responseJson);
};

export { fetchMoneyWallet };
