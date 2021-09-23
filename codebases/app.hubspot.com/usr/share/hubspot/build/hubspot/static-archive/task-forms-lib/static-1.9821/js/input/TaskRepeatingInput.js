'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { INPUT_SM_FONT_SIZE, INPUT_FONT_SIZE } from 'HubStyleTokens/sizes';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';
import { Fragment, useCallback, useMemo, useRef } from 'react';
import UIBadge from 'UIComponents/badge/UIBadge';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFieldset from 'UIComponents/form/UIFieldset';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UISelect from 'UIComponents/input/UISelect';
import UIStepperInput from 'UIComponents/input/UIStepperInput';
import UILink from 'UIComponents/link/UILink';
import { CANDY_APPLE } from 'HubStyleTokens/colors';
var HELP_LINK = 'https://knowledge.hubspot.com/tasks/use-tasks';
var frequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
var defaultRepeatInterval = {
  freq: 'DAILY',
  interval: 1
};

var getOptions = function getOptions(_ref) {
  var count = _ref.count;
  return frequencies.map(function (key) {
    return {
      text: I18n.text("taskFormsLib.input.taskRepeating.options." + key, {
        count: count
      }),
      value: key
    };
  });
};

export var HelpText = function HelpText() {
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'taskFormsLib.input.taskRepeating.upgradeHelpText'
      })
    }), /*#__PURE__*/_jsx(UILink, {
      href: HELP_LINK,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'taskFormsLib.input.taskRepeating.upgradeHelpLink'
      })
    })]
  });
};
export default function TaskRepeatingInput(_ref2) {
  var hasRecurringTasksScope = _ref2.hasRecurringTasksScope,
      onChange = _ref2.onChange,
      value = _ref2.value,
      size = _ref2.size,
      selectProps = _ref2.selectProps,
      error = _ref2.error;
  var isRepeating = Boolean(value); // interval is not guaranteed to exist

  var safeInterval = value && value.interval || 1;
  var safeFreq = value && value.freq;
  var lastTruthyRepeatIntervalRef = useRef(value || null);
  var handleCheckboxChange = useCallback(function (event) {
    if (event.target.checked) {
      var formUpdateValue = lastTruthyRepeatIntervalRef.current || defaultRepeatInterval;
      onChange(SyntheticEvent(formUpdateValue));
    } else {
      lastTruthyRepeatIntervalRef.current = value || null;
      onChange(SyntheticEvent(null));
    }
  }, [onChange, value]);
  var handleSelectChange = useCallback(function (evt) {
    onChange(SyntheticEvent({
      freq: evt.target.value,
      interval: safeInterval
    }));
  }, [onChange, safeInterval]);
  var handleStepperChange = useCallback(function (evt) {
    if (typeof evt.target.value === 'number') {
      onChange(SyntheticEvent({
        freq: safeFreq,
        interval: evt.target.value
      }));
    }
  }, [onChange, safeFreq]);
  var uiSelectJSX = useMemo(function () {
    return isRepeating && /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx(UISelect, Object.assign({
        error: error,
        "data-selenium-test": "task-repeating-input__select",
        className: "m-x-1",
        buttonUse: size === 'small' ? 'link' : 'form',
        options: getOptions({
          count: safeInterval
        }),
        onChange: handleSelectChange,
        value: safeFreq
      }, selectProps))
    });
  }, [error, handleSelectChange, isRepeating, safeFreq, safeInterval, selectProps, size]);

  if (!hasRecurringTasksScope) {
    return /*#__PURE__*/_jsx(UICheckbox, {
      error: error,
      checked: isRepeating,
      disabled: true,
      children: /*#__PURE__*/_jsx(UIHelpIcon, {
        title: /*#__PURE__*/_jsx(HelpText, {}),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "taskFormsLib.input.taskRepeating.inactive"
        })
      })
    });
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "display-flex align-center",
    children: [/*#__PURE__*/_jsx(UICheckbox, {
      color: error ? CANDY_APPLE : undefined,
      "data-selenium-test": "task-repeating-input__checkbox",
      checked: isRepeating,
      onChange: handleCheckboxChange,
      className: isRepeating || size === 'small' ? '' : 'm-y-1',
      size: size,
      description: !isRepeating && /*#__PURE__*/_jsx(UIBadge, {
        use: "new",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "taskFormsLib.input.taskRepeating.new"
        })
      }),
      descriptionLayout: "horizontal",
      children: isRepeating ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "taskFormsLib.input.taskRepeating.active"
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "taskFormsLib.input.taskRepeating.inactive"
      })
    }), isRepeating && /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "taskFormsLib.input.taskRepeating.recurrence",
      className: "display-flex align-center m-left-2",
      style: {
        position: 'relative',
        top: '0.0625em',
        fontSize: size === 'small' ? INPUT_SM_FONT_SIZE : INPUT_FONT_SIZE
      },
      options: {
        count: /*#__PURE__*/_jsx(UIFieldset // May 24, 2021 - UIC probably doesn't want people using this willy-nilly
        // but it is the current recommendation to shrink the stepper
        // https://hubspot.slack.com/archives/C1WG3L3J6/p1621632864034000
        , {
          _size: size,
          children: /*#__PURE__*/_jsx(UIStepperInput, {
            error: error,
            "data-selenium-test": "task-repeating-input__stepper",
            defaultValue: 1,
            className: "m-x-1",
            min: 1,
            value: safeInterval,
            style: {
              width: '70px'
            },
            onChange: handleStepperChange
          })
        }),
        timeframe: uiSelectJSX
      }
    })]
  });
}
TaskRepeatingInput.propTypes = {
  hasRecurringTasksScope: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.shape({
    freq: PropTypes.oneOf(frequencies),
    interval: PropTypes.number
  }),
  size: PropTypes.oneOf(['default', 'small']),
  selectProps: PropTypes.object,
  error: PropTypes.bool
};