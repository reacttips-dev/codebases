'use es6';

import { Map as ImmutableMap } from 'immutable';
import { FileTypes } from 'FileManagerCore/Constants';
import { getIsFileAccessibleAnonymously } from 'FileManagerCore/utils/fileAccessibility';
export default function getIsFileOptimizableImage(file) {
  if (ImmutableMap.isMap(file)) {
    return parseInt(file.get('width'), 10) > 0 && file.get('type') === FileTypes.IMG && file.get('encoding') !== 'svg' && getIsFileAccessibleAnonymously(file);
  }

  return false;
}