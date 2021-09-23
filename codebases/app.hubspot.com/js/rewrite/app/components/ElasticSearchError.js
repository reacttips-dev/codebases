'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { NavMarker } from 'react-rhumb';
import ElasticSearchErrorMessage, { getErrorMessageType } from '../../../crm_ui/error/ElasticSearchErrorMessage';
import QueryErrorStateMessage from '../../../crm_ui/messaging/QueryErrorStateMessage';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';

var ElasticSearchError = function ElasticSearchError(_ref) {
  var error = _ref.error;
  var objectTypeId = useSelectedObjectTypeId();
  var objectType = denormalizeTypeId(objectTypeId);
  var errorMessageType = getErrorMessageType(error) || objectType;

  var _ref2 = error.status === 400 ? ElasticSearchErrorMessage(error) : {},
      subtext = _ref2.subtext;

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "TABLE_ERROR"
    }), /*#__PURE__*/_jsx(QueryErrorStateMessage, {
      errorMessageType: errorMessageType,
      objectType: objectType,
      translatedSubtext: subtext
    })]
  });
};

ElasticSearchError.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number.isRequired,
    responseJSON: PropTypes.object.isRequired
  }).isRequired
};
export default ElasticSearchError;