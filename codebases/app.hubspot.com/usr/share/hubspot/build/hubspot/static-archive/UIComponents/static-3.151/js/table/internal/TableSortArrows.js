'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TABLE_SORT_ARROW_COLOR, TABLE_SORT_ARROW_SELECTED_COLOR, TABLE_SORTABLE_HOVER_ICON_COLOR } from 'HubStyleTokens/theme';
import { sortPropType, preferredSortPropType } from './TablePropTypes';

var getArrowColor = function getArrowColor(selected, hoveredWithHint) {
  if (selected) return TABLE_SORT_ARROW_SELECTED_COLOR;
  if (hoveredWithHint) return TABLE_SORTABLE_HOVER_ICON_COLOR;
  return null;
};

var getLabelText = function getLabelText(sort) {
  if (sort === 'ascending') {
    return I18n.text('ui.UISortTH.ascendingSort');
  }

  if (sort === 'descending') {
    return I18n.text('ui.UISortTH.descendingSort');
  }

  return I18n.text('ui.UISortTH.pressToSort');
};

var Arrow = styled('polygon').withConfig({
  displayName: "TableSortArrows__Arrow",
  componentId: "sc-4dm5a7-0"
})(["fill:", ";"], function (_ref) {
  var hovered = _ref.hovered,
      preferred = _ref.preferred,
      selected = _ref.selected;
  return getArrowColor(selected, preferred && hovered);
});

var UnstyledArrows = function UnstyledArrows(props) {
  var hovered = props.hovered,
      preferredSort = props.preferredSort,
      sort = props.sort,
      rest = _objectWithoutProperties(props, ["hovered", "preferredSort", "sort"]);

  return /*#__PURE__*/_jsx("span", Object.assign({
    "aria-label": getLabelText(sort),
    "aria-live": "polite"
  }, rest, {
    children: /*#__PURE__*/_jsxs("svg", {
      role: "presentation",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 7.5 14",
      children: [/*#__PURE__*/_jsx(Arrow, {
        hovered: hovered,
        points: "7.5 5 0 5 3.75 0 7.5 5",
        preferred: preferredSort === 'ascending' || sort === 'descending',
        selected: sort === 'ascending'
      }), /*#__PURE__*/_jsx(Arrow, {
        hovered: hovered,
        points: "0 9 7.5 9 3.75 14 0 9",
        preferred: preferredSort === 'descending' || sort === 'ascending',
        selected: sort === 'descending'
      })]
    })
  }));
};

var TableSortArrows = styled(UnstyledArrows).withConfig({
  displayName: "TableSortArrows",
  componentId: "sc-4dm5a7-1"
})(["display:inline-block;fill:", ";flex-shrink:0;margin-left:6px;margin-right:0;width:7.5px;"], TABLE_SORT_ARROW_COLOR);
TableSortArrows.propTypes = {
  hovered: PropTypes.bool.isRequired,
  preferredSort: preferredSortPropType.isRequired,
  sort: sortPropType.isRequired
};
TableSortArrows.displayName = 'TableSortArrows';
export default TableSortArrows;