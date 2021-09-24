'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import OverlayResultsContainer from 'draft-plugins/components/overlay/OverlayResultsContainer';

function OverlayContents(_ref) {
  var currentSearch = _ref.currentSearch,
      addKeyCommandListener = _ref.addKeyCommandListener,
      removeKeyCommandListener = _ref.removeKeyCommandListener,
      onSelect = _ref.onSelect,
      portalId = _ref.portalId,
      ResultsComponent = _ref.ResultsComponent,
      cancel = _ref.cancel,
      forceClose = _ref.forceClose,
      setForcedOverlayFocus = _ref.setForcedOverlayFocus,
      data = _ref.data,
      setSearchQuery = _ref.setSearchQuery,
      options = _ref.options,
      isLoading = _ref.isLoading;
  var ResultsContainer = useMemo(function () {
    return OverlayResultsContainer(ResultsComponent);
  }, [ResultsComponent]);
  useEffect(function () {
    if (currentSearch !== null) {
      setSearchQuery(currentSearch.search);
    }
  }, [setSearchQuery, currentSearch]);

  if (currentSearch === null) {
    return /*#__PURE__*/_jsx("div", {});
  }

  if (data) {
    return /*#__PURE__*/_jsx("div", {
      className: "overlay-dropdown",
      children: /*#__PURE__*/_jsx(ResultsContainer, Object.assign({}, currentSearch, {
        portalId: portalId,
        results: options,
        onSelect: onSelect,
        onCancel: cancel,
        forceClose: forceClose,
        toggleForcedOverlayFocus: setForcedOverlayFocus,
        addKeyCommandListener: addKeyCommandListener,
        removeKeyCommandListener: removeKeyCommandListener
      }))
    });
  }

  if (isLoading) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "small"
    });
  }

  return null;
}

OverlayContents.propTypes = {
  currentSearch: PropTypes.object,
  addKeyCommandListener: PropTypes.func,
  removeKeyCommandListener: PropTypes.func,
  onSelect: PropTypes.func,
  portalId: PropTypes.number.isRequired,
  ResultsComponent: PropTypes.func,
  cancel: PropTypes.func.isRequired,
  forceClose: PropTypes.func.isRequired,
  setForcedOverlayFocus: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(ImmutableMap),
  setSearchQuery: PropTypes.func.isRequired,
  options: PropTypes.array,
  isLoading: PropTypes.bool
};
export default OverlayContents;