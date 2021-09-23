'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker } from 'SequencesUI/util/UsageTracker';
import UIBuilderCard from 'UIComponents/card/UIBuilderCard';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import AddCardButton from './AddCardButton';

var TemplateErrorCard = /*#__PURE__*/function (_Component) {
  _inherits(TemplateErrorCard, _Component);

  function TemplateErrorCard(props) {
    var _this;

    _classCallCheck(this, TemplateErrorCard);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TemplateErrorCard).call(this, props));
    _this.renderTitleAction = _this.renderTitleAction.bind(_assertThisInitialized(_this));
    _this.handleDelete = _this.handleDelete.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TemplateErrorCard, [{
    key: "handleDelete",
    value: function handleDelete() {
      var _this$props = this.props,
          index = _this$props.index,
          onDelete = _this$props.onDelete,
          deleteStep = _this$props.deleteStep;
      deleteStep(index);
      tracker.track('createOrEditSequence', {
        action: 'Deleted task card'
      });

      if (onDelete) {
        onDelete();
      }
    }
  }, {
    key: "renderTitleAction",
    value: function renderTitleAction() {
      return /*#__PURE__*/_jsx(UIIconButton, {
        use: "link",
        onClick: this.handleDelete,
        children: /*#__PURE__*/_jsx(UIIcon, {
          name: "remove",
          size: "xxs"
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          index = _this$props2.index,
          openCardModal = _this$props2.openCardModal,
          closeCardModal = _this$props2.closeCardModal,
          addCardIndex = _this$props2.addCardIndex,
          isCardModalOpen = _this$props2.isCardModalOpen;
      return /*#__PURE__*/_jsxs("div", {
        className: "editor-list-template-package",
        "data-selenium-test": "builder-card",
        children: [/*#__PURE__*/_jsx("div", {
          className: "editor-list-card-template-error",
          children: /*#__PURE__*/_jsx(UIBuilderCard, {
            className: "m-bottom-2 p-all-0",
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.templateErrorNode.noAccessTitle"
            }),
            titleUse: "sorbet",
            clickable: false,
            use: "error",
            hovered: false,
            TitleAction: this.renderTitleAction,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.templateErrorNode.noAccessBody"
            })
          })
        }), /*#__PURE__*/_jsx(AddCardButton, {
          index: index,
          openCardModal: openCardModal,
          closeCardModal: closeCardModal,
          addCardIndex: addCardIndex,
          isCardModalOpen: isCardModalOpen
        })]
      });
    }
  }]);

  return TemplateErrorCard;
}(Component);

TemplateErrorCard.propTypes = {
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  openCardModal: PropTypes.func.isRequired,
  closeCardModal: PropTypes.func.isRequired,
  addCardIndex: PropTypes.number.isRequired,
  isCardModalOpen: PropTypes.bool.isRequired,
  deleteStep: PropTypes.func.isRequired
};
export default TemplateErrorCard;