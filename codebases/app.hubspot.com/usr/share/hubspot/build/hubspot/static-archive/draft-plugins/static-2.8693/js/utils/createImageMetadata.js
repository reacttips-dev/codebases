'use es6';

import { Map as ImmutableMap } from 'immutable';
import { IMAGE_ATOMIC_TYPE } from '../lib/constants';
export default (function (_image, _link, _align) {
  var image;
  var link;
  var align;

  if (_image) {
    image = ImmutableMap(_image);
  }

  if (_link) {
    link = ImmutableMap(_link);
  } else {
    link = ImmutableMap();
  }

  if (_align) {
    align = _align.get('align');
  }

  return ImmutableMap({
    atomicType: IMAGE_ATOMIC_TYPE,
    image: image,
    link: link,
    align: align
  });
});