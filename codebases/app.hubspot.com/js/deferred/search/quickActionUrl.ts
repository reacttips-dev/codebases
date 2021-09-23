import { getBaseUrl } from 'unified-navigation-ui/utils/API';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
export default function quickActionUrl(_ref) {
  var type = _ref.type,
      query = _ref.query;

  if (!getPortalId() || !type) {
    return '';
  }

  var path = '';
  var queryParams = '';

  if (type === 'contact') {
    path = 'contacts/list/view/all';
    queryParams = 'createNewObject=CONTACT';

    if (query) {
      if (query.indexOf('@') !== -1) {
        queryParams += "&email=" + encodeURIComponent(query);
      } else if (query.indexOf(' ') !== -1) {
        var index = query.indexOf(' ');
        queryParams += "&firstname=" + encodeURIComponent(query.slice(0, index).trim()) + "&lastname=" + encodeURIComponent(query.slice(index + 1).trim());
      } else {
        queryParams += "&firstname=" + encodeURIComponent(query);
      }
    }
  } else if (type === 'company') {
    path = 'companies/list/view/all';
    queryParams = 'createNewObject=COMPANY';

    if (query) {
      queryParams += "&name=" + encodeURIComponent(query.trim());
    }
  }

  var baseUrl = getBaseUrl({
    subDomain: 'app'
  });
  return baseUrl + "/contacts/" + getPortalId() + "/" + path + "?" + queryParams;
}