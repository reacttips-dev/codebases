'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';

var SequencesIntroState = function SequencesIntroState() {
  return /*#__PURE__*/_jsx(UIEmptyState, {
    className: "sequence-zero-state",
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.sequenceZeroState.detailsTitle"
    }),
    primaryContent: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.sequenceZeroState.detailsText"
    }),
    secondaryContent: /*#__PURE__*/_jsx(UIIllustration, {
      name: "sequences",
      alt: "",
      width: "90%"
    }),
    secondaryContentWidth: 295
  });
};

export default SequencesIntroState;