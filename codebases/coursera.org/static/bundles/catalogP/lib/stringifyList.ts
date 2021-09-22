// homegrown version of http://epeli.github.io/underscore.string/#tosentence-array-delimiter-lastdelimiter-gt-string

import _ from 'underscore';

export default function (list: $TSFixMe) {
  list = list || [];
  const initial = _.initial(list);
  const last = _.last(list);
  return _.compact([initial.join(', '), last]).join(' & ');
}
