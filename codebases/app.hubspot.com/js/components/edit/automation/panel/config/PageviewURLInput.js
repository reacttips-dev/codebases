'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import { useCallback } from 'react';
import { getPropertyValue, setPropertyValue } from '../../lib/Triggers';
import { withFlowEditorContext } from '../FlowEditorContext';
import { PageviewOperators } from '../../lib/Operators';
import { splitProtocolAndDomain, HTTPS_PROTOCOL, PROTOCOL_OPTIONS } from '../../lib/PageviewURLUtils';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIInputGroup from 'UIComponents/form/UIInputGroup';
import UISelect from 'UIComponents/input/UISelect';
import UITextInput from 'UIComponents/input/UITextInput';
export var PageviewURLInput = function PageviewURLInput(_ref) {
  var selectedOperator = _ref.selectedOperator,
      stagedTrigger = _ref.stagedTrigger,
      setStagedTrigger = _ref.setStagedTrigger;
  var useInputGroup = selectedOperator === PageviewOperators.HAS_PAGEVIEW_EQUAL;
  var propertyValue = getPropertyValue(stagedTrigger);

  var _ref2 = useInputGroup ? splitProtocolAndDomain(propertyValue, HTTPS_PROTOCOL) : ['', propertyValue],
      _ref3 = _slicedToArray(_ref2, 2),
      protocol = _ref3[0],
      domain = _ref3[1];

  var readOnly = !canEditSequencesContextualWorkflows();
  var onChangeProtocol = useCallback(function (_ref4) {
    var value = _ref4.target.value;
    setStagedTrigger(setPropertyValue(stagedTrigger, "" + value + domain));
  }, [stagedTrigger, setStagedTrigger, domain]);
  var onChangeDomain = useCallback(function (_ref5) {
    var value = _ref5.target.value;
    setStagedTrigger(setPropertyValue(stagedTrigger, "" + protocol + value));
  }, [stagedTrigger, setStagedTrigger, protocol]);

  var DomainInput = /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('sequencesAutomation.trigger.pageView.config.aria.domain'),
    children: /*#__PURE__*/_jsx(UITextInput, {
      "data-test-id": "pageview-domain-input",
      name: "domain",
      value: domain || '',
      onChange: onChangeDomain,
      readOnly: readOnly
    })
  });

  if (!useInputGroup) {
    return DomainInput;
  } else {
    return /*#__PURE__*/_jsxs(UIInputGroup, {
      "aria-label": I18n.text('sequencesAutomation.trigger.pageView.config.aria.url'),
      use: "itemLeft",
      required: true,
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        "aria-label": I18n.text('sequencesAutomation.trigger.pageView.config.aria.protocol'),
        children: /*#__PURE__*/_jsx(UISelect, {
          value: protocol,
          options: PROTOCOL_OPTIONS,
          onChange: onChangeProtocol,
          readOnly: readOnly
        })
      }), DomainInput]
    });
  }
};
PageviewURLInput.propTypes = {
  stagedTrigger: PropTypes.object.isRequired,
  setStagedTrigger: PropTypes.func.isRequired
};
export default withFlowEditorContext(PageviewURLInput);