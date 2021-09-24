'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import { fetchActiveSequenceContacts } from 'SequencesUI/actions/SequenceActions';
import { selectSequenceActiveContactsById } from 'SequencesUI/selectors/sequenceContactsSelectors';
import { selectBulkActionProcessingIds } from '../../selectors/bulkActionProcessingSelectors';

var PauseHoverButton = function PauseHoverButton(_ref) {
  var searchResult = _ref.searchResult,
      setShowModal = _ref.setShowModal;
  var dispatch = useDispatch();
  var processingIds = useSelector(selectBulkActionProcessingIds);
  var isProcessing = processingIds.length > 0;
  var activeContacts = useSelector(selectSequenceActiveContactsById(searchResult.contentId));
  useEffect(function () {
    if (activeContacts === undefined || activeContacts === null) {
      dispatch(fetchActiveSequenceContacts(searchResult.contentId));
    }
  }, [activeContacts, dispatch, searchResult.contentId]);
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.sequenceTable.rows.hoverButtons.pauseDisabled"
    }),
    disabled: activeContacts !== 0 || isProcessing,
    placement: "right",
    children: /*#__PURE__*/_jsx(UIButton, {
      onClick: function onClick() {
        return setShowModal(true);
      },
      size: "extra-small",
      use: "tertiary-light",
      disabled: !activeContacts || isProcessing,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "index.sequenceTable.rows.hoverButtons.pause"
      })
    }, "pause")
  });
};

PauseHoverButton.propTypes = {
  searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
  setShowModal: PropTypes.func.isRequired
};
export default PauseHoverButton;