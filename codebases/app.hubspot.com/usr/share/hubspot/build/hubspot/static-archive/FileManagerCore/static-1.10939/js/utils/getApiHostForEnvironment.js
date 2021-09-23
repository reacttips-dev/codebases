'use es6';

import enviro from 'enviro';
import { getFullUrl } from 'hubspot-url-utils';
export default function getApiHostForEnvironment() {
  var apiUrl = getFullUrl('api');

  if (enviro.getShort('filemanager') === 'local') {
    apiUrl = getFullUrl('local', {
      envOverride: 'qa'
    });
  }

  return apiUrl.replace('https://', '');
}