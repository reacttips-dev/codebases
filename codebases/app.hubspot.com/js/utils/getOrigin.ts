import isQA from './isQA';
import { isHublet, getHublet } from 'unified-navigation-ui/utils/hublet';
export default function getOrigin() {
  var subdomain = 'app';

  if (isHublet()) {
    subdomain = subdomain + "-" + getHublet();
  }

  var qaVar = isQA() ? 'qa' : '';
  return "https://" + subdomain + ".hubspot" + qaVar + ".com";
}