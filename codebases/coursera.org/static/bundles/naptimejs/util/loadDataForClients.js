import Q from 'q';
import { constructUrl } from 'bundles/naptimejs/util/naptimeUrl';
import loadData from 'bundles/naptimejs/util/loadData';

export default function loadDataForClients(context, clients, fulfilledUrls = [], subcomponents = []) {
  if (!clients.length) return Q();

  const applicationStore = context.getStore('ApplicationStore');
  const naptimeStore = context.getStore('NaptimeStore');

  const requestUrls = constructUrl(clients, context, subcomponents).filter(
    (urlData) => fulfilledUrls.indexOf(urlData.url) === -1
  );

  const promises = requestUrls.map((requestUrl) => {
    return loadData(requestUrl.url, applicationStore, naptimeStore, requestUrl.client);
  });

  return Q.all(promises);
}
