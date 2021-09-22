import Q from 'q';
import Api from 'js/lib/api';

const api = new Api('', { type: 'rest' });

export default function executeMutation(client, naptimeStore, options = {}) {
  if (!client) return Q();

  const optimistic = typeof options.optimistic === 'boolean' ? options.optimistic : true;

  if (optimistic) {
    naptimeStore.performOptimisticUpdate(client);
  }

  // TODO(bryan): investigate whether client.method can be moved
  // to a static property on the client
  const urlData = {
    client,
    url: client.getUri().toString().replace(/%2C/g, ','),
    method: client.method,
  };

  urlData.body = client.body;

  return Q(api[urlData.method](urlData.url, { data: urlData.body }))
    .then((res) => {
      urlData.data = res;
      naptimeStore.completeMutation(urlData);
      return urlData;
    })
    .catch((error) => {
      urlData.data = {};
      urlData.failure = error;
      naptimeStore.rollBackMutation(urlData);
      throw error;
    });
}
