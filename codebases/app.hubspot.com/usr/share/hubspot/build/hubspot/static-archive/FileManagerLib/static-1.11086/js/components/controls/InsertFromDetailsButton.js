'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import { mapProp } from 'FileManagerCore/constants/propTypes';
import InternalShutterstockLicenseAgreement from 'FileManagerCore/components/InternalShutterstockLicenseAgreement';
import { getShutterstockTosAccepted } from 'FileManagerCore/selectors/UserSettings';
import InsertButton from '../../components/controls/InsertButton';
export var InsertFromDetailsButton = function InsertFromDetailsButton(_ref) {
  var selectedFile = _ref.selectedFile,
      isSingleFileFetched = _ref.isSingleFileFetched,
      isAcquiringStockFile = _ref.isAcquiringStockFile,
      forShutterstock = _ref.forShutterstock,
      shutterstockTosAccepted = _ref.shutterstockTosAccepted,
      onInsert = _ref.onInsert;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showShutterstockAgreement = _useState2[0],
      setShowShutterstockAgreement = _useState2[1];

  var onClickStockFileInsert = useCallback(function () {
    if (!shutterstockTosAccepted) {
      setShowShutterstockAgreement(true);
    } else {
      onInsert();
    }
  }, [onInsert, shutterstockTosAccepted]);

  if (forShutterstock) {
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [showShutterstockAgreement && /*#__PURE__*/_jsx(InternalShutterstockLicenseAgreement, {
        onCancel: function onCancel() {
          return setShowShutterstockAgreement(false);
        },
        onClose: function onClose() {
          return setShowShutterstockAgreement(false);
        },
        onAgreeCallback: onInsert
      }), /*#__PURE__*/_jsx(UILoadingButton, {
        use: "primary",
        preventClicksOnLoading: true,
        loading: isAcquiringStockFile,
        onClick: onClickStockFileInsert,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerLib.actions.insert"
        })
      })]
    });
  }

  if (!isSingleFileFetched) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      className: "m-bottom-4"
    });
  }

  return /*#__PURE__*/_jsx(InsertButton, {
    file: selectedFile,
    onInsert: onInsert
  });
};
InsertFromDetailsButton.propTypes = {
  selectedFile: mapProp,
  forShutterstock: PropTypes.bool.isRequired,
  isSingleFileFetched: PropTypes.bool.isRequired,
  isAcquiringStockFile: PropTypes.bool.isRequired,
  shutterstockTosAccepted: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    shutterstockTosAccepted: getShutterstockTosAccepted(state)
  };
};

export default connect(mapStateToProps)(InsertFromDetailsButton);