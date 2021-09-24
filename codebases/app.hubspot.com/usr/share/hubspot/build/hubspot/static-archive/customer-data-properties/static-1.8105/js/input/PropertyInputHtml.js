'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useCallback, forwardRef, Fragment } from 'react';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UIExpandingTextArea from 'UIComponents/input/UIExpandingTextArea';
import { getTextContentFromHtml } from 'sanitize-text/sanitizers/TextSanitizer';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import unescapedText from 'I18n/utils/unescapedText';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import emptyFunction from 'react-utils/emptyFunction';
import { getFullUrl } from 'hubspot-url-utils';
import PortalIdParser from 'PortalIdParser';
import once from 'transmute/once';
import UIIFrame from 'ui-addon-iframeable/host/UIIFrame';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import ModalIFrameLayer from './html/ModalIFrameLayer';

var getEmbedUrl = function getEmbedUrl(objectTypeId, propertyName) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$use = _ref.use,
      use = _ref$use === void 0 ? 'modal' : _ref$use;

  return getFullUrl('app') + "/customer-data-properties-ui/" + PortalIdParser.get() + "/" + encodeURIComponent(objectTypeId) + "/" + encodeURIComponent(propertyName) + "/" + (use === 'inline' ? 'inline' : 'layer');
};

var defaultIframePassthruProps = {
  id: 'property-input-html'
}; // Shown in the edit modal when the input is read-only

var readOnlyActionButtons = once(function () {
  return [{
    name: MSG_TYPE_MODAL_DIALOG_CLOSE,
    label: unescapedText('customerDataProperties.PropertyInputHtml.modal.actionButtons.close'),
    props: {
      use: 'tertiary-light'
    }
  }];
}); // Shown in the edit modal when the input is disabled

var disabledActionButtons = once(function () {
  return [{
    name: 'UPDATE',
    label: unescapedText('customerDataProperties.PropertyInputHtml.modal.actionButtons.update'),
    props: {
      use: 'primary',
      disabled: true
    }
  }, {
    name: MSG_TYPE_MODAL_DIALOG_CLOSE,
    label: unescapedText('customerDataProperties.PropertyInputHtml.modal.actionButtons.cancel'),
    props: {
      use: 'secondary'
    }
  }];
}); // Shown in the edit modal when the input is editable

var editableActionButtons = once(function () {
  return [{
    name: 'UPDATE',
    label: unescapedText('customerDataProperties.PropertyInputHtml.modal.actionButtons.update'),
    props: {
      use: 'primary'
    }
  }, {
    name: MSG_TYPE_MODAL_DIALOG_CLOSE,
    label: unescapedText('customerDataProperties.PropertyInputHtml.modal.actionButtons.cancel'),
    props: {
      use: 'secondary'
    }
  }];
});
var PropertyInputHtmlModal = /*#__PURE__*/forwardRef(function (_ref2, ref) {
  var property = _ref2.property,
      objectType = _ref2.objectType,
      className = _ref2.className,
      _ref2$disabled = _ref2.disabled,
      disabled = _ref2$disabled === void 0 ? false : _ref2$disabled,
      _ref2$readOnly = _ref2.readOnly,
      readOnly = _ref2$readOnly === void 0 ? false : _ref2$readOnly,
      value = _ref2.value,
      onChange = _ref2.onChange,
      use = _ref2.use;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      initialized = _useState2[0],
      setInitialized = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      show = _useState4[0],
      setShow = _useState4[1];

  var handleFocus = useCallback(function () {
    setInitialized(true);
    setShow(true);
  }, []);
  var handleClose = useCallback(function () {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        nextValue = _ref3.value;

    if (typeof nextValue !== 'undefined') {
      onChange(SyntheticEvent(nextValue));
    }

    setShow(false);
  }, [onChange]); // unable to initialize the iframe (onInitError), or unable to establish
  // communication with the iframe within a timeout (onReadyError).
  // close the panel so the user isn't stuck looking at an empty panel.

  var handleIFrameError = useCallback(function () {
    FloatingAlertStore.addAlert({
      message: unescapedText('customerDataProperties.PropertyInputHtml.modal.error'),
      type: 'warning'
    });
    setInitialized(false);
    setShow(false);
  }, []);
  var propertyLabel = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
  var title;

  if (disabled || readOnly) {
    title = unescapedText('customerDataProperties.PropertyInputHtml.modal.title.view', {
      propertyLabel: propertyLabel
    });
  } else {
    title = unescapedText('customerDataProperties.PropertyInputHtml.modal.title.edit', {
      propertyLabel: propertyLabel
    });
  }

  var actionButtons;

  if (readOnly) {
    actionButtons = readOnlyActionButtons();
  } else if (disabled) {
    actionButtons = disabledActionButtons();
  } else {
    actionButtons = editableActionButtons();
  }

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UIExpandableText, {
      buttonAlign: "left",
      hideButtonCaret: true,
      children: /*#__PURE__*/_jsx(UIExpandingTextArea, {
        className: className,
        disabled: disabled,
        readOnly: readOnly // `UIExpandingTextArea` input is for display only; all editing is done in the modal.
        // Make `onChange` a no-op instead of setting `readOnly={true}` so that the input
        // looks like it has editable styling, but clicking it only brings up the modal.
        ,
        onChange: emptyFunction,
        value: getTextContentFromHtml(value),
        onFocus: handleFocus,
        inputRef: ref,
        shrink: true
      })
    }), initialized && /*#__PURE__*/_jsx(ModalIFrameLayer, {
      actionButtons: actionButtons,
      embeddedPassthruProps: {
        property: property.toJS(),
        defaultValue: value,
        readOnly: readOnly,
        disabled: disabled
      },
      height: 500,
      iframePassthruProps: defaultIframePassthruProps,
      onClose: handleClose,
      onInitError: handleIFrameError,
      onMessage: emptyFunction,
      onReady: emptyFunction,
      onReadyError: handleIFrameError,
      show: show,
      showProgressIndicator: true,
      src: getEmbedUrl(ObjectTypesToIds[objectType] || objectType, property.name, {
        use: use
      }),
      title: title,
      width: 800
    })]
  });
});
var PropertyInputHtmlInline = /*#__PURE__*/forwardRef(function (_ref4, ref) {
  var property = _ref4.property,
      objectType = _ref4.objectType,
      className = _ref4.className,
      _ref4$disabled = _ref4.disabled,
      disabled = _ref4$disabled === void 0 ? false : _ref4$disabled,
      _ref4$readOnly = _ref4.readOnly,
      readOnly = _ref4$readOnly === void 0 ? false : _ref4$readOnly,
      value = _ref4.value,
      onChange = _ref4.onChange,
      use = _ref4.use;
  // unable to initialize the iframe (onInitError), or unable to establish
  // communication with the iframe within a timeout (onReadyError).
  var handleIFrameError = useCallback(function () {
    FloatingAlertStore.addAlert({
      message: unescapedText('customerDataProperties.PropertyInputHtml.modal.error'),
      type: 'warning'
    });
  }, []);
  var handleMessage = useCallback(function (_ref5) {
    var _ref5$payload = _ref5.payload;
    _ref5$payload = _ref5$payload === void 0 ? {} : _ref5$payload;
    var type = _ref5$payload.type,
        nextValue = _ref5$payload.value;

    if (type === 'CHANGE') {
      if (typeof nextValue !== 'undefined') {
        onChange(SyntheticEvent(nextValue));
      }
    }
  }, [onChange]);
  return /*#__PURE__*/_jsx(UIIFrame, {
    className: className,
    embeddedPassthruProps: {
      property: property.toJS(),
      defaultValue: value,
      readOnly: readOnly,
      disabled: disabled
    } // NOTE: 400px looks extremely tall for an inline editor. But please remember:
    // the iframe needs to be tall enough to vertically accommodate any
    // plugins or popovers that the RTE might show (the emoji picker popover
    // and the insert link popover, for instance). These popovers cannot break the
    // bounds of the iframe, and will get clipped if insufficient vertical space is
    // available
    ,
    height: 400,
    iframePassthruProps: defaultIframePassthruProps,
    onInitError: handleIFrameError,
    onMessage: handleMessage,
    onReady: emptyFunction,
    onReadyError: handleIFrameError,
    showProgressIndicator: true,
    src: getEmbedUrl(ObjectTypesToIds[objectType] || objectType, property.name, {
      use: use
    }),
    width: "100%",
    innerRef: ref
  });
});
var PropertyInputHtml = /*#__PURE__*/forwardRef(function (props, ref) {
  var subjectId = props.subjectId,
      _props$use = props.use,
      use = _props$use === void 0 ? subjectId ? 'modal' : 'inline' : _props$use,
      rest = _objectWithoutProperties(props, ["subjectId", "use"]);

  var InputComponent = use === 'inline' ? PropertyInputHtmlInline : PropertyInputHtmlModal;
  return /*#__PURE__*/_jsx(InputComponent, Object.assign({
    ref: ref,
    subjectId: subjectId,
    use: use
  }, rest));
});
PropertyInputHtml.propTypes = {
  objectType: AnyCrmObjectTypePropType.isRequired,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  onChange: PropTypes.func,
  use: PropTypes.oneOf(['inline', 'modal'])
};
export default PropertyInputHtml;