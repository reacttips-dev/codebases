/**
 * Un-prefixed API client for use with naptime resources.
 */

import API from 'bundles/phoenix/lib/apiWrapper';

const api = API('/api/', {
  type: 'rest',
});

export default api;
