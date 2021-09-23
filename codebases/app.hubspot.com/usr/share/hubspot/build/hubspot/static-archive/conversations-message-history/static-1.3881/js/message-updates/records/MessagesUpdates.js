'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Map as ImmutableMap, Record } from 'immutable';
import { MESSAGES_UPDATED } from '../constants/messageTypes';
import { buildUpdates } from '../operators/buildUpdates';
/**
 * A message that indicates that a CMF has been updated
 *
 * @param {Object} auditParams one of five types of audit with id: SYSTEM_TEST, SYSTEM_MIGRATION, MANUAL, BOT_HANDOFF, INTEGRATOR_AUDIT to indicate the source of this update
 * @param {String} auditParams.id id of either the Bot or the
 * @param {Map} updates a map of message id to updates
 * @param {Map} updates.messageId map of an update of Status and/or messageDeleteStatus
 *
 **/

var MessagesUpdates = /*#__PURE__*/function (_Record) {
  _inherits(MessagesUpdates, _Record);

  function MessagesUpdates() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MessagesUpdates);

    return _possibleConstructorReturn(this, _getPrototypeOf(MessagesUpdates).call(this, {
      updates: buildUpdates(properties),
      auditParams: ImmutableMap(properties.audit)
    }));
  }

  return MessagesUpdates;
}(Record({
  '@type': MESSAGES_UPDATED,
  auditParams: ImmutableMap(),
  updates: ImmutableMap()
}, 'MessagesUpdates'));

export { MessagesUpdates as default };