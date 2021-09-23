'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWrite } from 'SequencesUI/lib/permissions';
import UIBuilderCard from 'UIComponents/card/UIBuilderCard';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';

var CardSeparatorWithoutButton = function CardSeparatorWithoutButton() {
  return /*#__PURE__*/_jsx("div", {
    className: "m-top-4 m-bottom-4",
    style: {
      height: '26px'
    }
  });
};

var AddCardButton = createReactClass({
  displayName: "AddCardButton",
  propTypes: {
    index: PropTypes.number.isRequired,
    isFirst: PropTypes.bool,
    openCardModal: PropTypes.func.isRequired,
    closeCardModal: PropTypes.func.isRequired,
    addCardIndex: PropTypes.number.isRequired,
    isCardModalOpen: PropTypes.bool.isRequired
  },
  isSelected: function isSelected() {
    var _this$props = this.props,
        index = _this$props.index,
        addCardIndex = _this$props.addCardIndex,
        isCardModalOpen = _this$props.isCardModalOpen;
    return isCardModalOpen && addCardIndex === index;
  },
  toggleCardModal: function toggleCardModal() {
    var _this$props2 = this.props,
        index = _this$props2.index,
        openCardModal = _this$props2.openCardModal,
        closeCardModal = _this$props2.closeCardModal;
    return this.isSelected() ? closeCardModal() : openCardModal(index);
  },
  renderBlankCard: function renderBlankCard() {
    var isFirst = this.props.isFirst;
    var className = 'editor-list-card-blank p-all-0' + (!isFirst ? " m-bottom-9" : "");

    if (this.isSelected()) {
      return /*#__PURE__*/_jsx("div", {
        className: className,
        children: /*#__PURE__*/_jsx(UIBuilderCard, {
          selected: true,
          clickable: false,
          hovered: false,
          children: /*#__PURE__*/_jsx("div", {
            className: "text-center",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.newItem.text"
            })
          })
        })
      });
    }

    return null;
  },
  render: function render() {
    var isFirst = this.props.isFirst;
    var className = 'editor-list-template-card-button m-top-4' + (!isFirst || this.isSelected() && isFirst ? " m-bottom-4" : "");

    if (!canWrite()) {
      return /*#__PURE__*/_jsx(CardSeparatorWithoutButton, {});
    }

    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("div", {
        className: className,
        children: /*#__PURE__*/_jsx(UIIconButton, {
          className: this.isSelected() ? 'selected' : null,
          shape: "circle",
          placement: "right",
          size: isFirst ? 'md' : 'xs',
          use: isFirst ? 'primary' : 'tertiary-light',
          onClick: this.toggleCardModal,
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "add"
          })
        })
      }), this.renderBlankCard()]
    });
  }
});
export default AddCardButton;