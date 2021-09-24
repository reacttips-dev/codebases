import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { fromJS, OrderedSet, Record, Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import toJS from 'transmute/toJS';
import { QUICK_REPLIES } from '../constants/attachmentTypes';

var QuickReplyAttachment = /*#__PURE__*/function (_Record) {
  _inherits(QuickReplyAttachment, _Record);

  function QuickReplyAttachment() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();

    _classCallCheck(this, QuickReplyAttachment);

    var quickReplies = fromJS(get('quickReplies', properties));
    return _possibleConstructorReturn(this, _getPrototypeOf(QuickReplyAttachment).call(this, Object.assign({}, toJS(properties), {
      quickReplies: OrderedSet(quickReplies)
    })));
  }

  return QuickReplyAttachment;
}(Record({
  '@type': QUICK_REPLIES,
  quickReplies: OrderedSet(),
  allowMultiSelect: false,
  allowUserInput: false
}, 'QuickReplyAttachment'));

export default QuickReplyAttachment;