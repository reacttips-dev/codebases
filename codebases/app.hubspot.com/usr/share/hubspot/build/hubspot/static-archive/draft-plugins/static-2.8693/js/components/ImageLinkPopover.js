'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import EventBoundaryPopover from './EventBoundaryPopover';
import LinkForm from 'draft-plugins/plugins/link/LinkForm';
import { encodeUrl, ensureUrlHasProtocol } from 'draft-plugins/lib/utils';

var isNotDefined = function isNotDefined(value) {
  return value === undefined || value === null;
};

export default (function (Component) {
  return createReactClass({
    displayName: 'ImageLinkPopover',
    mixins: [PureRenderMixin],
    propTypes: {
      open: PropTypes.bool.isRequired,
      onOpen: PropTypes.func.isRequired,
      onCancel: PropTypes.func.isRequired,
      onConfirm: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
      url: PropTypes.string,
      isTargetBlank: PropTypes.bool,
      isNoFollow: PropTypes.bool,
      className: PropTypes.string,
      onOpenChange: PropTypes.func.isRequired
    },
    getDefaultProps: function getDefaultProps() {
      return {
        className: ''
      };
    },
    getInitialState: function getInitialState() {
      var _this$props = this.props,
          url = _this$props.url,
          isTargetBlank = _this$props.isTargetBlank,
          isNoFollow = _this$props.isNoFollow;

      if (isNotDefined(url)) {
        url = '';
      }

      if (isNotDefined(isTargetBlank)) {
        isTargetBlank = true;
      }

      if (isNotDefined(isNoFollow)) {
        isNoFollow = false;
      }

      return {
        url: url,
        isTargetBlank: isTargetBlank,
        isNoFollow: isNoFollow
      };
    },
    clearInput: function clearInput() {
      this.setState(this.getInitialState());
    },
    togglePopover: function togglePopover() {
      var _this$props2 = this.props,
          open = _this$props2.open,
          onOpen = _this$props2.onOpen,
          onCancel = _this$props2.onCancel;
      this.clearInput();

      if (open) {
        onCancel();
      } else {
        onOpen();
      }
    },
    handleChange: function handleChange(state) {
      this.setState(state);
    },
    handleConfirm: function handleConfirm() {
      var _this$state = this.state,
          url = _this$state.url,
          isTargetBlank = _this$state.isTargetBlank,
          isNoFollow = _this$state.isNoFollow;
      var urlWithProtocol = ensureUrlHasProtocol(url);
      var encodedUrl = encodeUrl(urlWithProtocol);
      this.props.onConfirm({
        url: encodedUrl,
        isTargetBlank: isTargetBlank,
        isNoFollow: isNoFollow
      });
    },
    handleCancel: function handleCancel() {
      this.clearInput();
      this.props.onCancel();
    },
    handleRemove: function handleRemove() {
      this.props.onRemove();
      this.props.onCancel();
    },
    renderPopoverContent: function renderPopoverContent() {
      var _this$state2 = this.state,
          url = _this$state2.url,
          isTargetBlank = _this$state2.isTargetBlank,
          isNoFollow = _this$state2.isNoFollow;
      return /*#__PURE__*/_jsx(LinkForm, {
        isNew: false,
        url: url,
        isTargetBlank: isTargetBlank,
        isNoFollow: isNoFollow,
        showText: false,
        onChange: this.handleChange,
        onConfirm: this.handleConfirm,
        onCancel: this.handleCancel,
        onRemove: this.handleRemove
      });
    },
    render: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          open = _this$props3.open,
          onOpenChange = _this$props3.onOpenChange;
      return /*#__PURE__*/_jsx(EventBoundaryPopover, {
        open: open,
        onOpenChange: onOpenChange,
        Content: this.renderPopoverContent,
        closeOnOutsideClick: true,
        animateOnToggle: false,
        className: className,
        children: /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {
          togglePopover: this.togglePopover
        }))
      });
    }
  });
});