'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import EnumCell from './EnumCell';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useMemo, memo } from 'react';
export var StatusTypes = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  PAST: 'PAST',
  CANCELLED: 'CANCELLED'
};

var StatusCell = function StatusCell(_ref) {
  var value = _ref.value;
  var StatusOptions = useMemo(function () {
    return Object.keys(StatusTypes).map(function (status) {
      return {
        label: I18n.text("customerDataTable.cells.status." + status),
        value: status
      };
    });
  }, []);
  return /*#__PURE__*/_jsx(EnumCell, {
    options: List(StatusOptions),
    value: value
  });
};

StatusCell.propTypes = {
  value: PropTypes.string
};
export default /*#__PURE__*/memo(StatusCell);