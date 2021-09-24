'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { tracker } from 'SequencesUI/util/UsageTracker';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIButton from 'UIComponents/button/UIButton';
import UIList from 'UIComponents/list/UIList';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import SequencesPauseAllModal from 'SequencesUI/components/SequencesPauseAllModal.js';
import SequencesResumeAllModal from 'SequencesUI/components/SequencesResumeAllModal.js';
import { fetchAllActiveSequenceContacts, fetchAllPausedSequenceContacts } from 'SequencesUI/actions/SequenceActions';
import { selectAllSequenceActiveContacts, selectAllSequencePausedContacts } from 'SequencesUI/selectors/sequenceContactsSelectors';
import { selectBulkActionProcessingIds } from 'SequencesUI/selectors/bulkActionProcessingSelectors';

var SequencesActionsButton = function SequencesActionsButton() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showPauseModal = _useState2[0],
      setPauseModal = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      showResumeModal = _useState4[0],
      setResumeModal = _useState4[1];

  var dispatch = useDispatch();
  var activeContacts = useSelector(selectAllSequenceActiveContacts);
  var pausedContacts = useSelector(selectAllSequencePausedContacts);
  var processingIds = useSelector(selectBulkActionProcessingIds);
  var isProcessing = processingIds.length > 0;
  useEffect(function () {
    if (activeContacts === undefined || activeContacts === null) {
      dispatch(fetchAllActiveSequenceContacts());
    }

    if (pausedContacts === undefined || pausedContacts === null) {
      dispatch(fetchAllPausedSequenceContacts());
    }
  }, [activeContacts, dispatch, pausedContacts]);

  function trackClickActionDropdown() {
    tracker.track('sequencesInteraction', {
      action: 'Clicked Action for all sequences',
      subscreen: 'sequences-index'
    });
  }

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIDropdown, {
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.actions.actions"
      }),
      buttonUse: "secondary",
      buttonSize: "small",
      onClick: trackClickActionDropdown,
      children: /*#__PURE__*/_jsxs(UIList, {
        children: [/*#__PURE__*/_jsx(UITooltip, {
          placement: "left",
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.actions.pauseAllDisabled"
          }),
          disabled: activeContacts !== 0 || isProcessing,
          children: /*#__PURE__*/_jsx(UIButton, {
            onClick: function onClick() {
              return setPauseModal(true);
            },
            disabled: !activeContacts || isProcessing,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "index.actions.pauseAll"
            })
          })
        }), /*#__PURE__*/_jsx(UITooltip, {
          placement: "left",
          title: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.actions.resumeAllDisabled"
          }),
          disabled: pausedContacts !== 0 || isProcessing,
          children: /*#__PURE__*/_jsx(UIButton, {
            onClick: function onClick() {
              return setResumeModal(true);
            },
            disabled: !pausedContacts || isProcessing,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "index.actions.resumeAll"
            })
          })
        })]
      })
    }), showPauseModal && /*#__PURE__*/_jsx(SequencesPauseAllModal, {
      setShowModal: setPauseModal,
      numActiveContacts: activeContacts
    }), showResumeModal && /*#__PURE__*/_jsx(SequencesResumeAllModal, {
      setShowModal: setResumeModal,
      numPausedContacts: pausedContacts
    })]
  });
};

export default SequencesActionsButton;