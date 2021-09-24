'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap, List } from 'immutable';
import { useSelector, useDispatch } from 'react-redux';
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
import { selectSequenceActiveContactsById } from 'SequencesUI/selectors/sequenceContactsSelectors';

var PauseSequenceModal = function PauseSequenceModal(_ref) {
  var setShowModal = _ref.setShowModal,
      searchResults = _ref.searchResults,
      subscreen = _ref.subscreen;
  var sequenceName = searchResults.first().get('name');
  var sequenceId = searchResults.first().get('contentId');
  var dispatch = useDispatch();
  var activeContacts = useSelector(selectSequenceActiveContactsById(sequenceId));

  function handlePauseSequence() {
    tracker.track('sequencesUsage', {
      action: 'Pause sequence',
      subscreen: subscreen
    });
    dispatch(SequenceActions.pauseAll(sequenceId));
    setShowModal(false);
  }

  return /*#__PURE__*/_jsxs(UIModal, {
    use: "success",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.pauseSequenceModal.pause"
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: function onClick() {
          return setShowModal(false);
        }
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "index.pauseSequenceModal.description",
        options: {
          sequenceName: sequenceName,
          count: activeContacts
        }
      })
    }), /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        onClick: handlePauseSequence,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.pauseSequenceModal.button.pause"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          return setShowModal(false);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.pauseSequenceModal.button.cancel"
        })
      })]
    })]
  });
};

PauseSequenceModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  searchResults: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.instanceOf(List)]).isRequired,
  subscreen: PropTypes.string.isRequired
};
export default PauseSequenceModal;