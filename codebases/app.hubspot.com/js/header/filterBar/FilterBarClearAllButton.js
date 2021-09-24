'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
export var FilterBarClearAllButton = function FilterBarClearAllButton(_ref) {
  var filters = _ref.filters,
      onUpdateQuery = _ref.onUpdateQuery;
  var clearAllFilters = useCallback(function () {
    onUpdateQuery([]); // an empty array represents the new filters to apply
  }, [onUpdateQuery]);
  return filters.count() > 0 && /*#__PURE__*/_jsx("div", {
    children: /*#__PURE__*/_jsx(UIButton, {
      onClick: clearAllFilters,
      use: "transparent",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.genericActions.clearAll"
      })
    })
  });
};
FilterBarClearAllButton.propTypes = {
  filters: PropTypes.instanceOf(List).isRequired,
  onUpdateQuery: PropTypes.func.isRequired
};
export default FilterBarClearAllButton;