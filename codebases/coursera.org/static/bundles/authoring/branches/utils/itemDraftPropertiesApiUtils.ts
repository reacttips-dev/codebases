import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

const itemDraftPropertiesApi = API('/api/itemDraftProperties.v1/', { type: 'rest' });

export const getItemDraftInfoByBranch = (branchId: string) => {
  const uri = new URI().addQueryParam('q', 'getItemDraftInfo').addQueryParam('branchId', branchId);

  return Q(itemDraftPropertiesApi.get(uri.toString())).then((response) => (response && response.elements) || []);
};

export default getItemDraftInfoByBranch;
