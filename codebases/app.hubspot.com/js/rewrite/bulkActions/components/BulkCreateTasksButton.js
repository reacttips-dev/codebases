'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import BulkActionPropsRecord from '../../../crm_ui/grid/utils/BulkActionPropsRecord';
import BulkActions from '../../../crm_ui/grid/cells/header/bulkActions/BulkActions';
import { makeLegacyBulkActionWrapper } from './makeLegacyBulkActionWrapper';
import { bulkCreateTasks } from '../../../crm_ui/tasks/helpers/bulkCreateTasks';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { BulkCreateTasksPrompt } from './BulkCreateTasksPrompt';
export var BulkCreateTasksButtonWrapper = function BulkCreateTasksButtonWrapper(props) {
  var _props$bulkActionProp = props.bulkActionProps,
      checked = _props$bulkActionProp.checked,
      objectType = _props$bulkActionProp.objectType;
  var handleBulkCreateTasks = useCallback(function (_ref) {
    var draft = _ref.draft,
        selected = _ref.selected;
    CrmLogger.logIndexInteraction(TASK, {
      action: 'Use task bulk action',
      subAction: 'Create task',
      count: selected.size
    });
    var queueId = parseInt(draft.get('taskQueue'), 10);
    bulkCreateTasks({
      checked: checked,
      draft: draft,
      objectType: objectType,
      queueId: queueId,
      selected: selected
    });
  }, [checked, objectType]);
  var handleToggleBulkCreateModal = useCallback(function () {
    return BulkCreateTasksPrompt({
      checked: checked,
      objectType: objectType
    }).then(handleBulkCreateTasks).catch(rethrowError);
  }, [checked, handleBulkCreateTasks, objectType]);
  return /*#__PURE__*/_jsx(BulkActions.createTasks.Component, Object.assign({}, props, {
    openBulkCreateModal: handleToggleBulkCreateModal
  }));
};
BulkCreateTasksButtonWrapper.propTypes = {
  bulkActionProps: PropTypes.instanceOf(BulkActionPropsRecord).isRequired
};
export default makeLegacyBulkActionWrapper(Object.assign({}, BulkActions.createTasks, {
  Component: BulkCreateTasksButtonWrapper
}));