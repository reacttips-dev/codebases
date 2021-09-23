'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import { fetchPausedSequenceContacts } from 'SequencesUI/actions/SequenceActions';
import { selectSequencePausedContactsById } from 'SequencesUI/selectors/sequenceContactsSelectors';
import { selectBulkActionProcessingIds } from '../../selectors/bulkActionProcessingSelectors';

var ResumeHoverButton = function ResumeHoverButton(_ref) {
  var searchResult = _ref.searchResult,
      setShowModal = _ref.setShowModal;
  var dispatch = useDispatch();
  var processingIds = useSelector(selectBulkActionProcessingIds);
  var isProcessing = processingIds.length > 0;
  var pausedContacts = useSelector(selectSequencePausedContactsById(searchResult.contentId));
  useEffect(function () {
    if (pausedContacts === undefined || pausedContacts === null) {
      dispatch(fetchPausedSequenceContacts(searchResult.contentId));
    }
  }, [pausedContacts, dispatch, searchResult.contentId]);
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.sequenceTable.rows.hoverButtons.resumeDisabled"
    }),
    disabled: pausedContacts !== 0 || isProcessing,
    placement: "right",
    children: /*#__PURE__*/_jsx(UIButton, {
      onClick: function onClick() {
        return setShowModal(true);
      },
      size: "extra-small",
      use: "tertiary-light",
      disabled: !pausedContacts || isProcessing,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.sequenceTable.rows.hoverButtons.resume"
      })
    }, "resume")
  });
};

ResumeHoverButton.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
  setShowModal: PropTypes.func.isRequired
};
export default ResumeHoverButton;