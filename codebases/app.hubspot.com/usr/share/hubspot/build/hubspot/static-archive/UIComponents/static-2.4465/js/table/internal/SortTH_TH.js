'use es6';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TABLE_SORTABLE_HOVER_BACKGROUND_COLOR, TABLE_SORTABLE_SORTED_BACKGROUND_COLOR } from 'HubStyleTokens/theme';
import { sortPropType } from './TablePropTypes';
import UIClickable from '../../button/UIClickable';
import { omitProps } from '../../utils/Props';

var getBackgroundColor = function getBackgroundColor(hovered, sort) {
  if (hovered) return TABLE_SORTABLE_HOVER_BACKGROUND_COLOR;
  if (sort !== 'none') return TABLE_SORTABLE_SORTED_BACKGROUND_COLOR;
  return null;
};

var SortTH_TH = styled(omitProps(UIClickable, ['hovered', 'sort'])).attrs({
  tagName: 'th'
}).withConfig({
  displayName: "SortTH_TH",
  componentId: "sc-1ujcdpg-0"
})(["&&{background-color:", ";cursor:pointer;user-select:none;}"], function (_ref) {
  var hovered = _ref.hovered,
      sort = _ref.sort;
  return getBackgroundColor(hovered, sort);
});
SortTH_TH.propTypes = {
  hovered: PropTypes.bool,
  sort: sortPropType
};
SortTH_TH.displayName = 'UISortTH_TH';
export default SortTH_TH;