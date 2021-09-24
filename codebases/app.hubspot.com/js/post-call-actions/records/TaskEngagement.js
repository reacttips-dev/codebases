'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Set as ImmutableSet, Map as ImmutableMap } from 'immutable';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';

var TaskEngagement = /*#__PURE__*/function (_Record) {
  _inherits(TaskEngagement, _Record);

  function TaskEngagement() {
    _classCallCheck(this, TaskEngagement);

    return _possibleConstructorReturn(this, _getPrototypeOf(TaskEngagement).apply(this, arguments));
  }

  _createClass(TaskEngagement, null, [{
    key: "fromJS",
    value: function fromJS(_ref) {
      var ownerId = _ref.ownerId,
          timestamp = _ref.timestamp,
          subject = _ref.subject,
          body = _ref.body,
          reminders = _ref.reminders,
          associations = _ref.associations;
      var dynamicProperties = ImmutableSet([{
        name: 'hs_task_subject',
        value: subject
      }, {
        name: 'hs_task_body',
        value: body
      }, {
        name: 'hubspot_owner_id',
        value: ownerId
      }, {
        name: 'hs_task_reminders',
        value: reminders
      }, {
        name: 'hs_timestamp',
        value: timestamp
      }]);
      var taskEngagement = new TaskEngagement();
      taskEngagement = taskEngagement.updateIn(['object', 'properties'], function (properties) {
        return properties.concat(dynamicProperties);
      });
      taskEngagement = taskEngagement.set('objectsToAssociate', associations.toSet());
      return taskEngagement;
    }
  }]);

  return TaskEngagement;
}(Record({
  objectsToAssociate: ImmutableSet(),
  shouldValidateAssociations: true,
  associations: ImmutableMap({
    ENGAGEMENT_TO_COMPANY: ImmutableSet(),
    ENGAGEMENT_TO_CONTACT: ImmutableSet(),
    ENGAGEMENT_TO_DEAL: ImmutableSet(),
    ENGAGEMENT_TO_TICKET: ImmutableSet()
  }),
  object: ImmutableMap({
    properties: ImmutableSet([{
      name: 'hs_engagement_type',
      value: TASK
    }, {
      name: 'hs_task_priority',
      value: 'NONE'
    }, {
      name: 'hs_task_status',
      value: 'NOT_STARTED'
    }, {
      name: 'hs_task_type',
      value: 'TODO'
    }])
  })
}, 'TaskEngagement'));

export { TaskEngagement as default };