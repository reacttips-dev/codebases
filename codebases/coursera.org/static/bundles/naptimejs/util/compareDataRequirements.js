import calculateDataRequirements from 'bundles/naptimejs/util/calculateDataRequirements';
import { constructUrl } from 'bundles/naptimejs/util/naptimeUrl';

const getCombinedUrlString = function (component, context, props) {
  const requirements = calculateDataRequirements(component, context, props);

  const urls = constructUrl(requirements, context);

  return urls.reduce((str, url) => str + url.url, '');
};

export default function (component, context, existingProps, newProps) {
  const existingDataRequirements = getCombinedUrlString(component, context, existingProps);
  const newDataRequirements = getCombinedUrlString(component, context, newProps);

  return existingDataRequirements === newDataRequirements;
}
