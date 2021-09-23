'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { generateCdnHostnames } from '../utils/cdnHostnames';
var QaCdnHostnames = ['cdn2.hubspotqa.com', //redirecting to cdn2.hubspotqa.net
'cdn2.hubspotqa.net'].concat(_toConsumableArray(generateCdnHostnames('qa')));
var ProdCdnHostnames = ['cdn2.hubspot.net'].concat(_toConsumableArray(generateCdnHostnames('prod')));
var CdnHostnames = [].concat(_toConsumableArray(QaCdnHostnames), _toConsumableArray(ProdCdnHostnames));
export default CdnHostnames;