'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { Set as ImmutableSet } from 'immutable';
import UIAlert from 'UIComponents/alert/UIAlert';
import UISelect from 'UIComponents/input/UISelect';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import { setProp, listProp, logicalChannelProp } from '../../lib/propTypes';
import { ACCOUNT_TYPES } from '../../lib/constants';

var BAPPopoverBody = /*#__PURE__*/function (_Component) {
  _inherits(BAPPopoverBody, _Component);

  function BAPPopoverBody() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BAPPopoverBody);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BAPPopoverBody)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onSelectChange = function (evt) {
      evt.preventDefault();

      _this.props.updateSelectedBlogs(ImmutableSet(evt.target.value));
    };

    return _this;
  }

  _createClass(BAPPopoverBody, [{
    key: "isAvailable",
    value: function isAvailable(blogId) {
      var _this$props = this.props,
          channel = _this$props.channel,
          otherBlogsEnabledForNetwork = _this$props.otherBlogsEnabledForNetwork;

      if (ACCOUNT_TYPES.twitter === channel.accountSlug) {
        var otherBlogsIdsEnabledForNetwork = otherBlogsEnabledForNetwork.map(function (b) {
          return b.id;
        }).toSet();

        if (otherBlogsIdsEnabledForNetwork.includes(blogId)) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "blogsToOptions",
    value: function blogsToOptions() {
      var _this2 = this;

      return this.props.blogs.filter(function (b) {
        return _this2.isAvailable(b.id);
      }).map(function (b) {
        return b.toOption();
      }).toJS();
    }
  }, {
    key: "renderSelect",
    value: function renderSelect() {
      var options = this.blogsToOptions();

      if (!options.length) {
        return null;
      }

      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIFormLabel, {
          htmlFor: "enableBAP",
          children: I18n.text('sui.accounts.table.autoPublish.popover.formLabel')
        }), /*#__PURE__*/_jsx(UISelect, {
          id: "enableBAP",
          multi: true,
          open: this.props.selectOpen,
          onOpenChange: this.props.onToggleSelect,
          onChange: this.onSelectChange,
          options: this.blogsToOptions(),
          placeholder: I18n.text('sui.accounts.table.autoPublish.popover.placeholder'),
          defaultValue: this.props.blogsForChannel.toJS()
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          channel = _this$props2.channel,
          otherBlogsEnabledForNetwork = _this$props2.otherBlogsEnabledForNetwork;
      var showTwitterExplanation = channel.accountSlug === ACCOUNT_TYPES.twitter && !otherBlogsEnabledForNetwork.isEmpty();
      var enabledBlogsList = I18n.formatList(otherBlogsEnabledForNetwork.map(function (b) {
        return "\"" + b.name + "\"";
      }).toArray());
      return /*#__PURE__*/_jsxs(UIPopoverBody, {
        children: [I18n.text('sui.accounts.table.autoPublish.popover.body'), showTwitterExplanation && /*#__PURE__*/_jsx(UIAlert, {
          type: "info",
          className: "m-top-2 m-bottom-2",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "sui.accounts.table.autoPublish.twitterExplanation",
            options: {
              enabledBlogsList: enabledBlogsList
            }
          })
        }), this.renderSelect()]
      });
    }
  }]);

  return BAPPopoverBody;
}(Component);

BAPPopoverBody.propTypes = {
  channel: logicalChannelProp,
  blogsForChannel: setProp,
  blogs: listProp,
  otherBlogsEnabledForNetwork: listProp,
  updateSelectedBlogs: PropTypes.func,
  onToggleSelect: PropTypes.func,
  selectOpen: PropTypes.bool
};
export { BAPPopoverBody as default };