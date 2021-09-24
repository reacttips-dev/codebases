'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';

var EditorPage = function EditorPage(_ref) {
  var children = _ref.children,
      tab = _ref.tab,
      selectedTab = _ref.selectedTab;
  // Always renders the children, but turns off the opacity and positions
  // offscreen when this tab is not selected. This is to prevent re-initializing
  // EditorState and avoid issues with editor height adjustments.
  // https://git.hubteam.com/HubSpot/SequencesUI/issues/2019
  var style = {
    position: 'absolute',
    overflow: 'auto',
    height: '100%',
    width: '100%'
  };

  if (tab !== selectedTab) {
    style = {
      opacity: 0,
      position: 'relative',
      left: '300%'
    };
  }

  return /*#__PURE__*/_jsx("div", {
    style: style,
    children: children
  });
};

EditorPage.propTypes = {
  children: PropTypes.node.isRequired,
  tab: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired
};
export default EditorPage;