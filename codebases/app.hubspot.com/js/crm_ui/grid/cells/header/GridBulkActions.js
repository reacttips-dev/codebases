'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { BulkActionsModalProvider } from '../../../lists/context/BulkActionsModalContext';
import BulkActionPropsType from '../../utils/BulkActionPropsType';
import { bulkCreateTasks } from '../../../tasks/helpers/bulkCreateTasks';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import I18n from 'I18n';
import { memo } from 'react';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import Promptable from 'UIComponents/decorators/Promptable';
import PropTypes from 'prop-types';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
var DROPDOWN_OPTIONS = {
  inDropdown: true
};
var GridBulkActions = /*#__PURE__*/memo(function (props) {
  var bulkActions = props.bulkActions,
      bulkMoreDropdownActions = props.bulkMoreDropdownActions,
      bulkActionProps = props.bulkActionProps;
  var checked = bulkActionProps.checked;
  var objectType = bulkActionProps.objectType;

  var handleBulkCreateTasks = function handleBulkCreateTasks(_ref) {
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
  };

  var handleToggleBulkCreateModal = function handleToggleBulkCreateModal() {
    import(
    /* webpackChunkName: 'sidebar-bulk-create' */
    'crm-index-ui/crm_ui/tasks/bulkCreateTask/SidebarBulkCreateModal').then(function (module) {
      return Promptable(module.default)({
        checked: checked,
        objectType: objectType
      });
    }).then(handleBulkCreateTasks).catch(rethrowError);
  };

  var renderButtons = function renderButtons(buttons) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var openBulkCreateModal = handleToggleBulkCreateModal;
    return buttons.filter(function (_ref2) {
      var condition = _ref2.condition;
      return condition == null || condition(props);
    }).map(function (_ref3) {
      var Component = _ref3.Component,
          key = _ref3.key;
      return /*#__PURE__*/_createElement(Component, Object.assign({}, props, {
        bulkActionProps: bulkActionProps,
        key: key,
        openBulkCreateModal: openBulkCreateModal,
        options: options
      }));
    });
  };

  var renderActions = function renderActions() {
    if (!bulkActions) {
      return null;
    }

    return renderButtons(bulkActions);
  };

  var renderDropdown = function renderDropdown() {
    if (!bulkMoreDropdownActions) {
      return null;
    }

    var dropDownButtons = renderButtons(bulkMoreDropdownActions, DROPDOWN_OPTIONS);

    if (dropDownButtons.length === 0) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIDropdown, {
      buttonText: I18n.text('topbarContents.more'),
      buttonUse: "link",
      closeOnMenuClick: false,
      "data-selenium-test": "GridBulkActions__bulk-options",
      menuWidth: bulkActionProps.get('gdprEnabled') ? 220 : 'auto',
      children: /*#__PURE__*/_jsx(UIList, {
        children: dropDownButtons
      })
    });
  };

  return /*#__PURE__*/_jsx(BulkActionsModalProvider, {
    children: /*#__PURE__*/_jsxs(UIList, {
      childClassName: "m-left-3",
      inline: true,
      children: [renderActions(), renderDropdown()]
    })
  });
});
GridBulkActions.displayName = 'GridBulkActions';
GridBulkActions.propTypes = {
  bulkActions: PropTypes.array,
  bulkMoreDropdownActions: PropTypes.array,
  bulkActionProps: BulkActionPropsType,
  hasRestrictedSubscriptionsWrite: PropTypes.bool
};
export default GridBulkActions;