'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import I18n from 'I18n';
import TwitterText from 'twitter-text';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UICardSection from 'UIComponents/card/UICardSection';
import UIList from 'UIComponents/list/UIList';
import UILink from 'UIComponents/link/UILink';
import { ACCOUNT_TYPES } from '../../lib/constants';
import { feedUserProp, listProp } from '../../lib/propTypes';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
var PAGE_SIZE = 10;

var Interactions = /*#__PURE__*/function (_Component) {
  _inherits(Interactions, _Component);

  function Interactions() {
    var _this;

    _classCallCheck(this, Interactions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Interactions).call(this));

    _this.onClickViewMore = function () {
      _this.setState({
        loadMoreCursor: _this.state.loadMoreCursor + PAGE_SIZE
      });
    };

    _this.renderInteraction = function (interaction, i) {
      var typeKey = interaction.interactionType.toLowerCase();
      var label = I18n.text("sui.profile.interactions.types." + typeKey, {
        actorUsername: interaction.actorUser ? "@" + interaction.actorUser.get('username') : I18n.text('sui.profile.interactions.you'),
        username: interaction.user.get('username') ? "@" + interaction.user.get('username') : I18n.text('sui.profile.interactions.them'),
        streamName: interaction.streamName,
        dateDisplay: I18n.moment(interaction.interactionDate).format('l'),
        messageUrl: interaction.getMessageUrl(),
        message: _this.props.profile.network === ACCOUNT_TYPES.twitter ? I18n.text('sui.profile.interactions.message.twitter') : I18n.text('sui.profile.interactions.message.other')
      });
      var actionHtml = TwitterText.autoLinkUsernamesOrLists(label, {
        targetBlank: true
      });
      var messageHtml = interaction.content;

      if (interaction.body) {
        messageHtml = interaction.body.get('textAsHtml');
      }

      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "action",
          dangerouslySetInnerHTML: {
            __html: actionHtml
          }
        }), messageHtml && /*#__PURE__*/_jsx("p", {
          className: "message",
          dangerouslySetInnerHTML: {
            __html: messageHtml
          }
        })]
      }, i);
    };

    _this.state = {
      loadMoreCursor: PAGE_SIZE
    };
    return _this;
  }

  _createClass(Interactions, [{
    key: "renderInteractions",
    value: function renderInteractions() {
      return /*#__PURE__*/_jsx(UIList, {
        children: this.props.interactions.slice(0, this.state.loadMoreCursor).map(this.renderInteraction)
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.interactions || this.props.interactions.isEmpty()) {
        return null;
      }

      var firstInteraction = I18n.moment(this.props.interactions.last().interactionDate).format('l');
      var summary = I18n.text('sui.profile.interactions.summary', {
        count: this.props.interactions.size,
        firstInteraction: firstInteraction
      });
      return /*#__PURE__*/_jsxs(UICardWrapper, {
        className: "interactions",
        compact: true,
        children: [/*#__PURE__*/_jsx(UICardHeader, {
          title: I18n.text('sui.profile.interactions.header')
        }), /*#__PURE__*/_jsxs(UICardSection, {
          className: "card-body",
          children: [this.renderInteractions(), this.state.loadMoreCursor < this.props.interactions.size && /*#__PURE__*/_jsx("div", {
            className: "view-more",
            children: /*#__PURE__*/_jsx(UILink, {
              onClick: this.onClickViewMore,
              children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: "sui.profile.viewMore",
                options: {
                  count: Math.min(this.props.interactions.size - this.state.loadMoreCursor, PAGE_SIZE)
                }
              })
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "summary",
            children: summary
          })]
        })]
      });
    }
  }]);

  return Interactions;
}(Component);

Interactions.propTypes = {
  profile: feedUserProp,
  interactions: listProp
};
export { Interactions as default };