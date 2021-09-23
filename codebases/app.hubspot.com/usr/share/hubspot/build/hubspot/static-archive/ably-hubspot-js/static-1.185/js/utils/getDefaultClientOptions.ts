import enviro from 'enviro';
import { defaultClientOptions } from '../constants/defaultClientOptions';
export var getDefaultClientOptions = function getDefaultClientOptions() {
  var hublet = enviro.getHublet();
  return defaultClientOptions[hublet] || defaultClientOptions['na1'];
};