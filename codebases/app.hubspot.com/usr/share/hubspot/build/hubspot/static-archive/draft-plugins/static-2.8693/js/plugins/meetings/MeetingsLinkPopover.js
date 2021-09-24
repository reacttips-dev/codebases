'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import formatRelativeDuration from 'I18n/utils/formatRelativeDuration';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { fromJS, List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { callIfPossible } from 'UIComponents/core/Functions';
import UIFlex from 'UIComponents/layout/UIFlex';
import UISelect from 'UIComponents/input/UISelect';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIFormActions from 'UIComponents/form/UIFormActions';
import UITextInput from 'UIComponents/input/UITextInput';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import { fetchMeetingsLinks } from '../../api/MeetingsApi';
import EventBoundaryPopover from '../../components/EventBoundaryPopover';
import EmptyStatePopover from '../../components/EmptyStatePopover';
import { MEETINGS_LINK_TYPES as LINK_TYPES, MEETING_LINK_DOMAINS } from '../../lib/constants';
import { getMeetingsUrl } from '../../lib/links';
import insertMeetingLink from './insertMeetingLink';
import NotMyMeetingsLinkPopover from './NotMyMeetingsLinkPopover';
import getDefaultMeetingsLink from './getDefaultMeetingsLink';
var MEETING_RADIO_NAME = 'meetings-link-selection';

var toI18nText = function toI18nText(name, opts) {
  return I18n.text("draftPlugins.meetings." + name, opts);
};

function getReadableDurations(durations) {
  var durationList = I18n.formatList(durations.sort(function (a, b) {
    return b - a;
  }).map(function (duration) {
    return formatRelativeDuration(I18n.moment.duration(duration));
  }));
  return I18n.text('draftPlugins.meetings.meetingDuration', {
    durationList: durationList
  });
}

function getMeetingsLinkOptions(meetingsLinks) {
  return meetingsLinks.map(function (link) {
    var isDefaultLink = link.get('isDefaultLink');
    var durations = link.getIn(['customParams', 'durations']).toArray();
    var name = link.get('name') || getReadableDurations(durations);

    var _linkURL = link.get('link');

    var dropdownText = isDefaultLink ? toI18nText('default', {
      name: name
    }) : name;
    return {
      text: name,
      dropdownText: dropdownText,
      value: _linkURL,
      help: _linkURL
    };
  }).toArray();
}

function updateMeetingsLinkDomain(meetingsLinks, originalLinkURL) {
  if (!originalLinkURL) {
    return null;
  }

  var linkSlug = MEETING_LINK_DOMAINS.reduce(function (fullUrl, domain) {
    return fullUrl.indexOf(domain) !== -1 ? fullUrl.replace(domain, '') : fullUrl;
  }, originalLinkURL);
  var currentLink = meetingsLinks.find(function (link) {
    return link.get('slug') === linkSlug;
  });

  if (currentLink && currentLink.get('link') !== originalLinkURL) {
    return currentLink.get('link');
  }

  return null;
}

export default (function (Child) {
  return function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        onFetchMeetingsError = _ref.onFetchMeetingsError,
        onInsertMeetingsLink = _ref.onInsertMeetingsLink,
        zeroStateImageUrl = _ref.zeroStateImageUrl,
        _ref$getMeetingsLink = _ref.getMeetingsLink,
        getMeetingsLink = _ref$getMeetingsLink === void 0 ? fetchMeetingsLinks : _ref$getMeetingsLink;

    var MeetingsEmptyStatePopover = EmptyStatePopover(Child);
    var NotMyMeetingsLink = NotMyMeetingsLinkPopover(Child);
    return createReactClass({
      propTypes: {
        entityKey: PropTypes.string,
        decoratedText: PropTypes.string,
        editorState: PropTypes.object,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        showHeader: PropTypes.bool
      },
      contextTypes: {
        getEditorState: PropTypes.func,
        getReadOnly: PropTypes.func.isRequired,
        onChange: PropTypes.func
      },
      getInitialState: function getInitialState() {
        return Object.assign({
          hasFetchedMeetings: false,
          meetingsLinks: List(),
          open: false
        }, this.getInitialFormState());
      },
      UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
        this.inputRef = {
          current: null
        };
      },
      componentDidMount: function componentDidMount() {
        var _this = this;

        getMeetingsLink().then(function (resp) {
          var meetingsLinks = fromJS(resp);
          var linkURL = _this.state.linkURL;
          var updatedLinkURL = updateMeetingsLinkDomain(meetingsLinks, linkURL);

          _this.setState({
            linkURL: updatedLinkURL || linkURL,
            hasFetchedMeetings: true,
            meetingsLinks: meetingsLinks,
            meetingsLinkOptions: getMeetingsLinkOptions(meetingsLinks)
          }, function () {
            // if the full URL of the meetings link needed to be updated
            // (because the user changed their domain preference), emit that
            // change to the editor
            if (updatedLinkURL) {
              _this.handleConfirm(false);
            }
          });
        }, function (err) {
          _this.setState({
            hasFetchedMeetings: true
          });

          callIfPossible(onFetchMeetingsError, err);
        });
      },
      componentDidUpdate: function componentDidUpdate(_, prevState) {
        var wasFirstRenderAfterFetchingMeetings = !prevState.hasFetchedMeetings && this.state.hasFetchedMeetings;

        if (wasFirstRenderAfterFetchingMeetings && this.inputRef && this.inputRef.current) {
          this.inputRef.current.focus();
        }
      },
      getInitialFormState: function getInitialFormState() {
        if (this.isNew()) {
          return {
            linkType: LINK_TYPES.CUSTOM,
            linkURL: null,
            text: ''
          };
        }

        var decoratedText = this.props.decoratedText;

        var _this$getEntity$getDa = this.getEntity().getData(),
            type = _this$getEntity$getDa.type,
            customText = _this$getEntity$getDa.customText,
            _this$getEntity$getDa2 = _this$getEntity$getDa.linkURL,
            linkURL = _this$getEntity$getDa2 === void 0 ? null : _this$getEntity$getDa2;

        return {
          linkType: type,
          text: customText ? decoratedText : '',
          linkURL: linkURL
        };
      },
      getEditorData: function getEditorData() {
        var _this$context = this.context,
            getEditorState = _this$context.getEditorState,
            onChange = _this$context.onChange;

        if (getEditorState && onChange) {
          return {
            editorState: getEditorState(),
            onChange: onChange
          };
        }

        return {
          editorState: this.props.editorState,
          onChange: this.props.onChange
        };
      },
      getEntity: function getEntity() {
        if (this.isNew()) {
          return null;
        }

        var _this$getEditorData = this.getEditorData(),
            editorState = _this$getEditorData.editorState;

        var contentState = editorState.getCurrentContent();
        return contentState.getEntity(this.props.entityKey);
      },
      getSelectedMeetingName: function getSelectedMeetingName() {
        var _this$state = this.state,
            linkType = _this$state.linkType,
            meetingsLinks = _this$state.meetingsLinks,
            linkName = _this$state.linkName;

        if (linkType === LINK_TYPES.OWNER) {
          return null;
        }

        var defaultMeeting = getDefaultMeetingsLink(meetingsLinks);
        var durations = defaultMeeting.getIn(['customParams', 'durations']).toArray();
        return linkName || defaultMeeting.get('name') || getReadableDurations(durations);
      },
      getSelectedMeetingURL: function getSelectedMeetingURL() {
        var _this$state2 = this.state,
            linkType = _this$state2.linkType,
            meetingsLinks = _this$state2.meetingsLinks,
            linkURL = _this$state2.linkURL;

        if (linkType === LINK_TYPES.OWNER) {
          return null;
        }

        var defaultMeeting = getDefaultMeetingsLink(meetingsLinks);
        return linkURL || defaultMeeting.get('link');
      },
      isNew: function isNew() {
        return this.props.entityKey === undefined;
      },
      isMeetingLinkNotSenders: function isMeetingLinkNotSenders() {
        var _this$state3 = this.state,
            linkType = _this$state3.linkType,
            meetingsLinks = _this$state3.meetingsLinks,
            linkURL = _this$state3.linkURL;
        return linkType === LINK_TYPES.CUSTOM && linkURL !== null && meetingsLinks.find(function (link) {
          return link.get('link') === linkURL;
        }) === undefined;
      },
      handleTypeChange: function handleTypeChange(_ref2) {
        var target = _ref2.target;
        var value = target.value;
        this.setState({
          linkType: value
        });
      },
      handleTextChange: function handleTextChange(_ref3) {
        var target = _ref3.target;
        var value = target.value;
        this.setState({
          text: value
        });
      },
      handleConfirm: function handleConfirm() {
        var closePopover = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var _this$props = this.props,
            entityKey = _this$props.entityKey,
            decoratedText = _this$props.decoratedText;

        var _this$getEditorData2 = this.getEditorData(),
            editorState = _this$getEditorData2.editorState,
            onChange = _this$getEditorData2.onChange;

        var linkType = this.state.linkType;
        var text = this.state.text;
        var meetingURL = this.getSelectedMeetingURL();
        var meetingName = this.getSelectedMeetingName();

        if (linkType === LINK_TYPES.CUSTOM && text === '') {
          text = meetingName;
        }

        var updatedEditorState = insertMeetingLink(editorState, linkType, text, entityKey, decoratedText, meetingURL);
        onChange(updatedEditorState);
        callIfPossible(onInsertMeetingsLink);

        if (closePopover) {
          this.handleClose();
        }
      },
      handleRadioChange: function handleRadioChange(linkType) {
        var _this$state4 = this.state,
            text = _this$state4.text,
            linkURL = _this$state4.linkURL;
        var updatedText = text === linkURL ? '' : text;
        this.setState({
          linkType: linkType,
          text: updatedText
        });
      },
      handleClose: function handleClose() {
        var onClose = this.props.onClose;
        callIfPossible(onClose);
        this.setState(Object.assign({
          open: false
        }, this.getInitialFormState()));
      },
      handleEmptyStateOnConfirm: function handleEmptyStateOnConfirm() {
        window.open(getMeetingsUrl(), '_blank');
      },
      togglePopover: function togglePopover() {
        var isReadOnly = this.context.getReadOnly();
        this.setState(Object.assign({
          open: !isReadOnly && !this.state.open
        }, this.getInitialFormState()));
      },
      handleOpenChange: function handleOpenChange(e) {
        this.setState({
          open: e.target.value
        });
      },
      renderLinkSelectionRadio: function renderLinkSelectionRadio(selectedLink) {
        var _this2 = this;

        var linkType = this.state.linkType;
        var isSelected = linkType === LINK_TYPES.CUSTOM;
        return /*#__PURE__*/_jsxs(UIFlex, {
          align: "center",
          children: [/*#__PURE__*/_jsx(UIRadioInput, {
            name: MEETING_RADIO_NAME,
            checked: isSelected,
            onChange: function onChange() {
              return _this2.handleRadioChange(LINK_TYPES.CUSTOM);
            },
            children: toI18nText('custommeetingslink')
          }), /*#__PURE__*/_jsx(UILink, {
            href: selectedLink,
            external: true,
            className: "m-left-auto",
            disabled: !isSelected,
            children: toI18nText('previewBookingPage')
          })]
        });
      },
      renderLinkSelection: function renderLinkSelection() {
        var _this3 = this;

        var _this$state5 = this.state,
            meetingsLinks = _this$state5.meetingsLinks,
            meetingsLinkOptions = _this$state5.meetingsLinkOptions,
            text = _this$state5.text,
            linkURL = _this$state5.linkURL;
        var defaultMeeting = getDefaultMeetingsLink(meetingsLinks);
        var selectValue = linkURL || defaultMeeting.get('link');

        var handleMeetingLinkSelection = function handleMeetingLinkSelection(_ref4) {
          var value = _ref4.target.value;
          var _this3$state = _this3.state,
              linkType = _this3$state.linkType,
              linkName = _this3$state.linkName;
          var name = value.text;
          var url = value.value;
          var replaceText = (text === '' || text === linkName) && linkType === LINK_TYPES.CUSTOM;
          var updatedText = replaceText ? name : text;

          _this3.setState({
            text: updatedText,
            linkURL: url,
            linkName: name
          });
        };

        return /*#__PURE__*/_jsx(UIFormControl, {
          label: toI18nText('linkTo'),
          className: "m-bottom-3",
          children: /*#__PURE__*/_jsxs("div", {
            children: [this.renderLinkSelectionRadio(selectValue), /*#__PURE__*/_jsx(UISelect, {
              "data-test-id": "meetings-select",
              dropdownFooter: /*#__PURE__*/_jsx(UIButton, {
                href: getMeetingsUrl(),
                external: true,
                use: "link",
                children: toI18nText('manageLinks')
              }),
              onSelectedOptionChange: handleMeetingLinkSelection,
              options: meetingsLinkOptions,
              value: selectValue
            })]
          })
        });
      },
      renderPopoverContent: function renderPopoverContent() {
        var _this4 = this;

        var showHeader = this.props.showHeader;
        var _this$state6 = this.state,
            hasFetchedMeetings = _this$state6.hasFetchedMeetings,
            text = _this$state6.text,
            linkType = _this$state6.linkType;

        if (!hasFetchedMeetings) {
          return /*#__PURE__*/_jsx(UILoadingSpinner, {
            grow: true,
            minHeight: 350
          });
        }

        var isNew = this.isNew();
        var confirmText = isNew ? toI18nText('confirm') : toI18nText('confirmUpdate');
        var title = isNew ? toI18nText('popoverTitle') : toI18nText('popoverTitleEdit');
        return /*#__PURE__*/_jsxs("div", {
          className: "p-all-4",
          children: [showHeader && /*#__PURE__*/_jsx("h5", {
            children: title
          }), /*#__PURE__*/_jsx(UIFormControl, {
            label: toI18nText('textLabel'),
            children: /*#__PURE__*/_jsx(UITextInput, {
              onChange: this.handleTextChange,
              value: text,
              placeholder: toI18nText('textPlaceholder'),
              inputRef: this.inputRef
            })
          }), this.renderLinkSelection(), /*#__PURE__*/_jsx(UIRadioInput, {
            name: MEETING_RADIO_NAME,
            checked: linkType === LINK_TYPES.SENDER,
            onChange: function onChange() {
              return _this4.handleRadioChange(LINK_TYPES.SENDER);
            },
            children: toI18nText('sendermeetingslink')
          }), /*#__PURE__*/_jsxs(UIFormActions, {
            className: "m-top-3",
            children: [/*#__PURE__*/_jsx(UIButton, {
              "data-test-id": "apply-meeting-link",
              use: "tertiary",
              size: "small",
              onClick: this.handleConfirm,
              children: confirmText
            }), /*#__PURE__*/_jsx(UIButton, {
              use: "tertiary-light",
              size: "small",
              onClick: this.handleClose,
              children: toI18nText('cancel')
            })]
          })]
        });
      },
      renderMeetingsLinkPopover: function renderMeetingsLinkPopover() {
        var open = this.state.open;

        if (!Child) {
          return this.renderPopoverContent();
        }

        return /*#__PURE__*/_jsx(EventBoundaryPopover, {
          className: "meetings-link-select__popover",
          width: 400,
          onOpenChange: this.handleOpenChange,
          open: open,
          placement: "top",
          Content: this.renderPopoverContent,
          children: /*#__PURE__*/_jsx(Child, Object.assign({}, this.props, {
            togglePopover: this.togglePopover
          }))
        });
      },
      render: function render() {
        var _this$state7 = this.state,
            hasFetchedMeetings = _this$state7.hasFetchedMeetings,
            linkURL = _this$state7.linkURL,
            meetingsLinks = _this$state7.meetingsLinks;

        if (hasFetchedMeetings && this.isMeetingLinkNotSenders()) {
          return /*#__PURE__*/_jsx(NotMyMeetingsLink, Object.assign({}, this.props, {
            linkURL: linkURL
          }));
        }

        if (hasFetchedMeetings && meetingsLinks.isEmpty()) {
          return /*#__PURE__*/_jsx(MeetingsEmptyStatePopover, Object.assign({
            linkURL: this.state.linkURL,
            title: toI18nText('emptyStateTitle'),
            bodyText: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "draftPlugins.meetings.emptyStateBodyText"
            }),
            image: zeroStateImageUrl,
            confirmText: toI18nText('emptyStateConfirm'),
            cancelText: toI18nText('emptyStateCancel'),
            onConfirm: this.handleEmptyStateOnConfirm,
            onCancel: this.handleClose
          }, this.props));
        }

        return this.renderMeetingsLinkPopover();
      }
    });
  };
});