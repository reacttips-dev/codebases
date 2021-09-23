'use es6'; // Copied from crm_ui/tasks/buttons/TaskCompleteIconButton

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import classNames from 'classnames';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { NOT_STARTED, COMPLETED } from 'customer-data-objects/engagement/EngagementStatusTypes';
import { BATTLESHIP, GYPSUM, OZ, OLAF } from 'HubStyleTokens/colors';
var ICON_COLORS = {
  NOT_STARTED: {
    color: BATTLESHIP,
    background: GYPSUM,
    border: BATTLESHIP
  },
  COMPLETED: {
    color: OLAF,
    background: OZ,
    border: OZ
  }
};
var TaskCompleteIconButton = createReactClass({
  displayName: 'TaskCompleteIconButton',
  mixins: [PureRenderMixin],
  propTypes: {
    className: PropTypes.string,
    onChange: PropTypes.func,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.string,
    disabled: PropTypes.bool,
    displayAsIcon: PropTypes.bool,
    animate: PropTypes.bool,
    tooltipPlacement: PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false,
      size: 18,
      displayAsIcon: true,
      animate: false,
      tooltipPlacement: 'top left'
    };
  },
  onClick: function onClick() {
    var _this$props = this.props,
        disabled = _this$props.disabled,
        value = _this$props.value,
        onChange = _this$props.onChange;

    if (disabled) {
      return;
    }

    var currentStatus;

    if (value === COMPLETED) {
      currentStatus = NOT_STARTED;
    } else {
      currentStatus = COMPLETED;
    }

    onChange(SyntheticEvent(currentStatus));
  },
  getClassName: function getClassName() {
    var _this$props2 = this.props,
        value = _this$props2.value,
        displayAsIcon = _this$props2.displayAsIcon,
        animate = _this$props2.animate;
    var isComplete = value === COMPLETED;
    return classNames('pointer', this.props.className, displayAsIcon && animate && ['animated-task-icon', isComplete && 'task-complete', !isComplete && 'task-incomplete']);
  },
  renderIcon: function renderIcon() {
    var background;
    var border;
    var color;
    var _this$props3 = this.props,
        value = _this$props3.value,
        size = _this$props3.size;

    if (value === COMPLETED) {
      var _ICON_COLORS$COMPLETE = ICON_COLORS[COMPLETED];
      color = _ICON_COLORS$COMPLETE.color;
      background = _ICON_COLORS$COMPLETE.background;
      border = _ICON_COLORS$COMPLETE.border;
    } else {
      var _ICON_COLORS$NOT_STAR = ICON_COLORS[NOT_STARTED];
      color = _ICON_COLORS$NOT_STAR.color;
      background = _ICON_COLORS$NOT_STAR.background;
      border = _ICON_COLORS$NOT_STAR.border;
    }

    return /*#__PURE__*/_jsx(UITooltip, {
      placement: this.props.tooltipPlacement,
      title: I18n.text(this.props.value === COMPLETED ? 'taskFormsLib.input.taskStatus.markAsIncomplete' : 'taskFormsLib.input.taskStatus.markAsComplete'),
      children: /*#__PURE__*/_jsx(UIIconCircle, {
        name: "success",
        onClick: this.onClick,
        className: this.getClassName(),
        color: color,
        backgroundColor: background,
        borderColor: border,
        size: size,
        legacy: true
      })
    });
  },
  renderButton: function renderButton() {
    if (this.props.disabled) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary-light",
      onClick: this.onClick,
      className: this.getClassName(),
      size: this.props.size,
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: this.props.value === COMPLETED ? 'taskFormsLib.input.taskStatus.markAsIncomplete' : 'taskFormsLib.input.taskStatus.markAsComplete'
      })
    });
  },
  render: function render() {
    return this.props.displayAsIcon ? this.renderIcon() : this.renderButton();
  }
});
export default TaskCompleteIconButton;