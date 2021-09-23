'use es6';

import PropTypes from 'prop-types';
import { List, Map as ImmutableMap, OrderedMap } from 'immutable';
import { ObjectCategory } from '../Constants';
import * as ReadOnlyReason from '../enums/ReadOnlyReason';
var TTL_OPTIONS = ['P1Y', 'P12M', 'P6M', 'P1D', 'P8W', 'P52W'];
export var FileUploadOptionsPropType = PropTypes.exact({
  ttl: PropTypes.oneOf(TTL_OPTIONS),
  folderId: PropTypes.number,
  folderPath: PropTypes.string,
  overwrite: PropTypes.bool
});
export var FILE_UPLOAD_V3_OPTION_KEYS = ['ttl', 'folderId', 'folderPath', 'overwrite'];
export var SUPPORTED_UI_DROP_ZONE_PROPS = ['className', 'children', 'contentClassName', 'iconName', 'iconSize', 'size', 'use'];
export var mapProp = PropTypes.instanceOf(ImmutableMap);
export var orderedMapProp = PropTypes.instanceOf(OrderedMap);
export var listProp = PropTypes.instanceOf(List);
export var objectCategoryProp = PropTypes.oneOf(Object.values(ObjectCategory));
export var readOnlyReasonProp = PropTypes.oneOf(Object.values(ReadOnlyReason));