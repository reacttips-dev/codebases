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

var SequencesPauseAllModal = function SequencesPauseAllModal(_ref) {
  var setShowModal = _ref.setShowModal,
      numActiveContacts = _ref.numActiveContacts;
  var dispatch = useDispatch();

  function handlePauseSequence() {
    tracker.track('sequencesUsage', {
      action: 'Pause all',
      subscreen: 'sequences-index'
    });
    dispatch(SequenceActions.pauseAll());
    setShowModal(false);
  }

  return /*#__PURE__*/_jsxs(UIModal, {
    use: "success",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.pauseAllSequenceModal.pause"
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: function onClick() {
          return setShowModal(false);
        }
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "index.pauseAllSequenceModal.description",
        options: {
          count: numActiveContacts
        }
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        onClick: handlePauseSequence,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.pauseAllSequenceModal.button.pause"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          return setShowModal(false);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.pauseAllSequenceModal.button.cancel"
        })
      })]
    })]
  });
};

SequencesPauseAllModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  numActiveContacts: PropTypes.number.isRequired
};
export default SequencesPauseAllModal;