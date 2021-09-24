'use es6';

import { getUrl } from '../../common/urls';
import { search } from '../dao';
import { generate } from '../generate';
import { transform } from './transform';
export default (function (spec, config, runtimeOptions) {
  return generate(config, null).then(function (payload) {
    return search(getUrl(config, runtimeOptions), payload);
  }).then(function (response) {
    return transform(config, response);
  });
});