'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { tracker } from 'SequencesUI/util/UsageTracker';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite } from 'SequencesUI/lib/permissions';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import { create } from 'SequencesUI/lib/links';
import UIRouterButtonLink from 'ui-addon-react-router/UIRouterButtonLink';
import CreateSequenceTooltip from 'SequencesUI/components/create/CreateSequenceTooltip';

var SequencesCreateButton = function SequencesCreateButton(_ref) {
  var portalIsAtLimit = _ref.portalIsAtLimit;
  var disabled = !canWrite() || portalIsAtLimit;
  return /*#__PURE__*/_jsx(CreateSequenceTooltip, {
    subscreen: "sequences-index",
    children: /*#__PURE__*/_jsx(UIRouterButtonLink, {
      onClick: function onClick() {
        tracker.track('sequencesInteraction', {
          action: 'Clicked create a sequence',
          subscreen: 'sequences-index'
        });
      },
      disabled: disabled,
      size: "small",
      to: {
        pathname: create(),
        query: getQueryParams()
      },
      use: "primary",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.sequenceIndexHeader.createSequence"
      })
    })
  });
};

SequencesCreateButton.propTypes = {
  portalIsAtLimit: PropTypes.bool
};
export default SequencesCreateButton;