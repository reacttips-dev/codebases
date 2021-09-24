'use es6';

import { fromJS, List } from 'immutable';
import identity from 'transmute/identity';
export default (function (RecordStore) {
  return {
    stores: [RecordStore],
    deref: function deref(_ref) {
      var state = _ref.state,
          selected = _ref.selected;

      if (state.selected && state.selected.length) {
        return RecordStore.get(fromJS(state.selected)).filter(identity);
      }

      if (selected) {
        return RecordStore.get(fromJS(selected)).filter(identity);
      }

      return List();
    }
  };
});