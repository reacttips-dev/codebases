'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import MeetingsLinkPopover from './MeetingsLinkPopover';
import { OZ, OZ_LIGHT } from 'HubStyleTokens/colors';
var MeetingsLinkDecorator = createReactClass({
  displayName: "MeetingsLinkDecorator",
  propTypes: {
    entityKey: PropTypes.string.isRequired,
    togglePopover: PropTypes.func.isRequired,
    disableTooltip: PropTypes.bool.isRequired,
    children: PropTypes.any
  },
  contextTypes: {
    getEditorState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      disableTooltip: false
    };
  },
  getEntity: function getEntity() {
    var getEditorState = this.context.getEditorState;
    var contentState = getEditorState().getCurrentContent();
    return contentState.getEntity(this.props.entityKey);
  },
  renderLink: function renderLink() {
    var _this$props = this.props,
        togglePopover = _this$props.togglePopover,
        disableTooltip = _this$props.disableTooltip;
    var entity = this.getEntity();

    var _entity$getData = entity.getData(),
        type = _entity$getData.type;

    return /*#__PURE__*/_jsx(UITooltip, {
      title: I18n.text("draftPlugins.meetings." + type),
      disabled: disableTooltip,
      children: /*#__PURE__*/_jsx("a", {
        onClick: togglePopover,
        children: this.props.children
      })
    });
  },
  renderToken: function renderToken() {
    var togglePopover = this.props.togglePopover;
    return /*#__PURE__*/_jsx("span", {
      style: {
        height: '20px',
        width: 'auto',
        padding: '4px 8px',
        margin: '0 4px',
        backgroundColor: OZ_LIGHT,
        borderRadius: '2px',
        color: OZ,
        border: 'solid 1px transparent'
      },
      onClick: togglePopover,
      children: this.props.children
    });
  },
  render: function render() {
    var _this$getEntity$getDa = this.getEntity().getData(),
        customText = _this$getEntity$getDa.customText;

    if (customText === true) {
      return this.renderLink();
    }

    return this.renderToken();
  }
});
export default MeetingsLinkPopover(MeetingsLinkDecorator);