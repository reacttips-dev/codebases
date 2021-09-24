'use es6';

import aggregate from '../aggregate';
import getProperties from './properties';
export default function (config, _, runtimeOptions) {
  return getProperties(config).then(function (properties) {
    return aggregate(config, properties, runtimeOptions);
  });
}