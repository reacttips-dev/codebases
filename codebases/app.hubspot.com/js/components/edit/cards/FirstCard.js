'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import AddCardButton from './AddCardButton';

var FirstCard = function FirstCard(_ref) {
  var index = _ref.index,
      openCardModal = _ref.openCardModal,
      closeCardModal = _ref.closeCardModal,
      addCardIndex = _ref.addCardIndex,
      isCardModalOpen = _ref.isCardModalOpen,
      fromCreatePage = _ref.fromCreatePage;
  return /*#__PURE__*/_jsxs("div", {
    className: "editor-list-card-first-package",
    children: [/*#__PURE__*/_jsx("div", {
      className: 'editor-list-card-first-container' + (fromCreatePage ? " from-create" : ""),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "edit.emptyCard.text"
      })
    }), !fromCreatePage && /*#__PURE__*/_jsx(AddCardButton, {
      index: index,
      isFirst: true,
      openCardModal: openCardModal,
      closeCardModal: closeCardModal,
      addCardIndex: addCardIndex,
      isCardModalOpen: isCardModalOpen
    })]
  });
};

FirstCard.propTypes = {
  index: PropTypes.number,
  openCardModal: PropTypes.func,
  closeCardModal: PropTypes.func,
  addCardIndex: PropTypes.number,
  isCardModalOpen: PropTypes.bool,
  fromCreatePage: PropTypes.bool
};
export default FirstCard;