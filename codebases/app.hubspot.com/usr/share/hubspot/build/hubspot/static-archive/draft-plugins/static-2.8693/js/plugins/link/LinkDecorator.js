'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { ContentState } from 'draft-js';
import LinkPopoverDecorator from './LinkPopoverDecorator';
import UILink from 'UIComponents/link/UILink';
var LinkComponent = createReactClass({
  displayName: "LinkComponent",
  propTypes: {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.instanceOf(ContentState),
    togglePopover: PropTypes.func.isRequired,
    children: PropTypes.node
  },
  contextTypes: {
    getReadOnly: PropTypes.func.isRequired
  },
  getEntity: function getEntity() {
    var _this$props = this.props,
        entityKey = _this$props.entityKey,
        contentState = _this$props.contentState;
    return contentState.getEntity(entityKey);
  },
  handleClick: function handleClick(e) {
    var togglePopover = this.props.togglePopover;
    var getReadOnly = this.context.getReadOnly;

    if (getReadOnly()) {
      return;
    }

    e.preventDefault();
    togglePopover();
  },
  render: function render() {
    var _this$getEntity$getDa = this.getEntity().getData(),
        isNoFollow = _this$getEntity$getDa.isNoFollow,
        isTargetBlank = _this$getEntity$getDa.isTargetBlank,
        url = _this$getEntity$getDa.url;

    var target = isTargetBlank ? '_blank' : '_self';
    var rel = isNoFollow ? 'nofollow' : null;
    return /*#__PURE__*/_jsx(UILink, {
      href: url,
      onClick: this.handleClick,
      rel: rel,
      target: target,
      children: this.props.children
    });
  }
});
export default LinkPopoverDecorator(LinkComponent);