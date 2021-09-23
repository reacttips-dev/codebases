'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { getNewSnippetsUrl } from 'draft-plugins/lib/links';
import ContentPopoverEmptyState from 'draft-content-plugins/components/popover/ContentPopoverEmptyState';

var SnippetsPopoverEmptyState = function SnippetsPopoverEmptyState(_ref) {
  var portalId = _ref.portalId;
  return /*#__PURE__*/_jsx(ContentPopoverEmptyState, {
    image: "text-snippet",
    title: "draftPlugins.snippetsPlugin.popover.emptyState.title",
    description: "draftPlugins.snippetsPlugin.popover.emptyState.description",
    buttonLabel: "draftPlugins.snippetsPlugin.popover.emptyState.createFirstSnippet",
    buttonLink: getNewSnippetsUrl(portalId)
  });
};

SnippetsPopoverEmptyState.propTypes = {
  portalId: PropTypes.number.isRequired
};
export default SnippetsPopoverEmptyState;