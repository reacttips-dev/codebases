'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { fromJS } from 'immutable';
import I18n from 'I18n';
import { SelectionState, EditorState } from 'draft-js';
import { callIfPossible } from 'UIComponents/core/Functions';
import UIButton from 'UIComponents/button/UIButton';
import EventBoundaryPopover from 'draft-plugins/components/EventBoundaryPopover';
import { getMeetingsUrl } from '../../lib/links';
import { fetchMeetingsLinks } from '../../api/MeetingsApi';
import { MEETINGS_LINK_TYPES as LINK_TYPES } from '../../lib/constants';
import insertMeetingLink from './insertMeetingLink';

var toI18nText = function toI18nText(name, opts) {
  return I18n.text("draftPlugins.meetings.proTip." + name, opts);
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      onFetchMeetingsError = _ref.onFetchMeetingsError,
      onHideProTip = _ref.onHideProTip;

  return createReactClass({
    propTypes: {
      entityKey: PropTypes.string,
      children: PropTypes.any
    },
    contextTypes: {
      getEditorState: PropTypes.func,
      onChange: PropTypes.func
    },
    getInitialState: function getInitialState() {
      return {
        meetingsLinks: null,
        open: true
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      fetchMeetingsLinks().then(function (resp) {
        _this.setState({
          hasFetchedMeetings: true,
          meetingsLinks: fromJS(resp)
        });
      }, function (err) {
        return callIfPossible(onFetchMeetingsError, err);
      });
    },
    getEntity: function getEntity() {
      var getEditorState = this.context.getEditorState;
      var contentState = getEditorState().getCurrentContent();
      return contentState.getEntity(this.props.entityKey);
    },
    handleConvertToMeeting: function handleConvertToMeeting() {
      var _this$context = this.context,
          getEditorState = _this$context.getEditorState,
          onChange = _this$context.onChange;
      var editorState = getEditorState();

      var _this$getEntity$getDa = this.getEntity().getData(),
          phrase = _this$getEntity$getDa.phrase,
          offset = _this$getEntity$getDa.offset,
          blockKey = _this$getEntity$getDa.blockKey;

      var meetingSelection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: offset,
        focusOffset: offset + phrase.length
      });
      var editorStateWithSelection = EditorState.forceSelection(editorState, meetingSelection);
      var editorStateWithMeeting = insertMeetingLink(editorStateWithSelection, LINK_TYPES.CUSTOM, phrase);
      this.setState({
        open: false
      }, function () {
        onChange(editorStateWithMeeting);
      });
    },
    handleSetupMeeting: function handleSetupMeeting() {
      this.setState({
        open: false
      }, function () {
        return window.open(getMeetingsUrl(), '_blank');
      });
    },
    handleClose: function handleClose() {
      callIfPossible(onHideProTip);
      this.setState({
        open: false
      });
    },
    renderFooter: function renderFooter() {
      var meetingsLinks = this.state.meetingsLinks;
      var confirmCopy = meetingsLinks === null ? toI18nText('setUpMeeting') : toI18nText('turnIntoMeeting');
      var confirmOnClick = meetingsLinks === null ? this.handleSetupMeeting : this.handleConvertToMeeting;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          onClick: confirmOnClick,
          children: confirmCopy
        }), /*#__PURE__*/_jsx(UIButton, {
          onClick: this.handleClose,
          children: toI18nText('dismiss')
        })]
      });
    },
    render: function render() {
      var open = this.state.open;

      var _this$getEntity$getDa2 = this.getEntity().getData(),
          phrase = _this$getEntity$getDa2.phrase;

      return /*#__PURE__*/_jsx(EventBoundaryPopover, {
        use: "shepherd",
        width: 350,
        open: open,
        placement: "bottom right",
        content: {
          header: /*#__PURE__*/_jsx("h4", {
            children: toI18nText('title')
          }),
          body: /*#__PURE__*/_jsx("span", {
            children: toI18nText('description', {
              phrase: phrase
            })
          }),
          footer: this.renderFooter()
        },
        children: /*#__PURE__*/_jsx("span", {
          children: this.props.children
        })
      });
    }
  });
});