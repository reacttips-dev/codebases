'use es6';

import { Map as ImmutableMap } from 'immutable';
export default (function (title, description, degree) {
  return ImmutableMap({
    title: title,
    description: description,
    degree: degree
  });
});