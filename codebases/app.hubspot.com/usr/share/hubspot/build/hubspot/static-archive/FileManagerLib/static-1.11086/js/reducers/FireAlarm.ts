import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { RequestStatus } from 'FileManagerCore/Constants';
import { FETCH_FIREALARM_SUCCESS } from '../actions/ActionTypes';

var State = /*#__PURE__*/function (_Record) {
  _inherits(State, _Record);

  function State() {
    _classCallCheck(this, State);

    return _possibleConstructorReturn(this, _getPrototypeOf(State).apply(this, arguments));
  }

  return State;
}(Record({
  data: null,
  fetchStatus: RequestStatus.UNINITIALIZED
}));

export default function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new State();
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      data = action.data;

  switch (type) {
    case FETCH_FIREALARM_SUCCESS:
      return state.merge({
        data: data,
        fetchStatus: RequestStatus.SUCCEEDED
      });

    default:
      return state;
  }
}