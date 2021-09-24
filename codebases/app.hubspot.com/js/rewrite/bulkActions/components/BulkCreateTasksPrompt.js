'use es6';

import Promptable from 'UIComponents/decorators/Promptable';
export var BulkCreateTasksPrompt = function BulkCreateTasksPrompt(_ref) {
  var checked = _ref.checked,
      objectType = _ref.objectType;
  return import(
  /* webpackChunkName: 'sidebar-bulk-create' */
  'crm-index-ui/crm_ui/tasks/bulkCreateTask/SidebarBulkCreateModal').then(function (module) {
    return Promptable(module.default)({
      checked: checked,
      objectType: objectType
    });
  });
};