'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { tracker } from 'SequencesUI/util/UsageTracker';
import UIButton from 'UIComponents/button/UIButton';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIModal from 'UIComponents/dialog/UIModal';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';

var SequencesResumeAllModal = function SequencesResumeAllModal(_ref) {
  var setShowModal = _ref.setShowModal,
      numPausedContacts = _ref.numPausedContacts;
  var dispatch = useDispatch();

  function handleResumeSequence() {
    tracker.track('sequencesUsage', {
      action: 'Resume all',
      subscreen: 'sequences-index'
    });
    dispatch(SequenceActions.resumeAll());
    setShowModal(false);
  }

  return /*#__PURE__*/_jsxs(UIModal, {
    use: "success",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.resumeAllSequenceModal.resume"
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: function onClick() {
          return setShowModal(false);
        }
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "index.resumeAllSequenceModal.description",
        options: {
          count: numPausedContacts
        }
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        onClick: handleResumeSequence,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.resumeAllSequenceModal.button.resume"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          return setShowModal(false);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.resumeAllSequenceModal.button.cancel"
        })
      })]
    })]
  });
};

SequencesResumeAllModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  numPausedContacts: PropTypes.number.isRequired
};
export default SequencesResumeAllModal;