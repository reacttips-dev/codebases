'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';
import { pluginUtils } from 'draft-extend';
import LinkForm from './LinkForm';
import EventBoundaryPopover from '../../components/EventBoundaryPopover';
import isImageBlock from '../../utils/isImageBlock';
import { encodeUrl, ensureUrlHasProtocol } from 'draft-plugins/lib/utils';
import { INSERT_LINK } from 'rich-text-lib/constants/usageTracking';
import { callIfPossible } from 'UIComponents/core/Functions';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import Controllable from 'UIComponents/decorators/Controllable';
import getNormalizedLinkData from './getNormalizedLinkData';
export default (function (Component) {
  return function (getEntityOptions, _ref) {
    var getPages = _ref.getPages,
        showNoFollow = _ref.showNoFollow,
        showTarget = _ref.showTarget,
        onOpenPopover = _ref.onOpenPopover,
        onClosePopover = _ref.onClosePopover,
        onInsertLink = _ref.onInsertLink,
        popoverPlacement = _ref.popoverPlacement,
        Tracker = _ref.Tracker,
        hideNoFollowConfiguration = _ref.hideNoFollowConfiguration,
        hideTargetConfiguration = _ref.hideTargetConfiguration;
    var LinkPopover = createReactClass({
      displayName: 'LinkPopoverDecorator',
      propTypes: {
        decoratedText: PropTypes.string,
        entityKey: PropTypes.string,
        editorState: PropTypes.object,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpenChange: PropTypes.func,
        open: PropTypes.bool,
        trackLinkOnInsertInteraction: PropTypes.func
      },
      contextTypes: {
        getEditorState: PropTypes.func,
        onChange: PropTypes.func
      },
      getDefaultProps: function getDefaultProps() {
        return {
          open: false
        };
      },
      getInitialState: function getInitialState() {
        return Object.assign({
          shouldRestoreFocus: false
        }, this.getInitialFormState());
      },
      UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.isNew()) {
          return;
        }

        var nextEntityKey = nextProps.entityKey;
        var currentEntityKey = this.props.entityKey;

        if (nextEntityKey !== currentEntityKey) {
          this.setState(this.getInitialFormState(nextProps));
        }
      },
      getInitialFormState: function getInitialFormState() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

        if (this.isImageSelected()) {
          var imageBlock = this.getSelectedBlock();
          var linkData = imageBlock.getData().get('link');

          if (linkData) {
            var _getNormalizedLinkDat = getNormalizedLinkData(linkData.toObject()),
                _isNoFollow = _getNormalizedLinkDat.isNoFollow,
                _isTargetBlank = _getNormalizedLinkDat.isTargetBlank,
                _url = _getNormalizedLinkDat.url;

            if (_url === null) {
              _url = '';
            }

            if (_isTargetBlank === null) {
              _isTargetBlank = true;
            }

            if (_isNoFollow === null) {
              _isNoFollow = false;
            }

            return {
              isNoFollow: _isNoFollow,
              isTargetBlank: _isTargetBlank,
              url: _url
            };
          }
        }

        if (this.isNew()) {
          var _this$getEditorData = this.getEditorData(),
              editorState = _this$getEditorData.editorState;

          var text = '';
          var selection = editorState.getSelection();

          if (selection.getStartKey() === selection.getEndKey()) {
            var block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
            text = block.getText().slice(selection.getStartOffset(), selection.getEndOffset());
          }

          return {
            isNoFollow: showNoFollow,
            isTargetBlank: showTarget,
            text: text,
            url: ''
          };
        }

        var decoratedText = props.decoratedText;

        var _getNormalizedLinkDat2 = getNormalizedLinkData(this.getEntity(props.entityKey).getData(), {
          showNoFollow: showNoFollow,
          showTarget: showTarget
        }),
            isNoFollow = _getNormalizedLinkDat2.isNoFollow,
            isTargetBlank = _getNormalizedLinkDat2.isTargetBlank,
            url = _getNormalizedLinkDat2.url;

        return {
          url: url,
          isNoFollow: isNoFollow,
          isTargetBlank: isTargetBlank,
          text: decoratedText
        };
      },
      isNew: function isNew() {
        var entityKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.entityKey;
        return entityKey === undefined;
      },
      isImageSelected: function isImageSelected() {
        var selectedBlock = this.getSelectedBlock();

        if (!selectedBlock) {
          return false;
        }

        return isImageBlock(selectedBlock);
      },
      getSelectedBlock: function getSelectedBlock() {
        var _this$getEditorData2 = this.getEditorData(),
            editorState = _this$getEditorData2.editorState;

        var currentSelection = editorState.getSelection();
        var currentBlockKey = currentSelection.getFocusKey();
        var currentContent = editorState.getCurrentContent();
        return currentContent.getBlockForKey(currentBlockKey);
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
        var entityKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.entityKey;

        if (this.isNew(entityKey)) {
          return null;
        }

        var contentState = this.getEditorData().editorState.getCurrentContent();
        return contentState.getEntity(entityKey);
      },
      togglePopover: function togglePopover() {
        var _this$props = this.props,
            onOpenChange = _this$props.onOpenChange,
            open = _this$props.open;
        onOpenChange(SyntheticEvent(!open));
        var shouldRestoreFocus = false;

        if (open === false) {
          onOpenPopover();
          var selection = this.getEditorData().editorState.getSelection();
          shouldRestoreFocus = selection.getHasFocus();
        } else {
          onClosePopover();
        }

        this.setState(Object.assign({
          shouldRestoreFocus: shouldRestoreFocus
        }, this.getInitialFormState()));
      },
      setImageLinkData: function setImageLinkData() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var isTargetBlank = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var _this$getEditorData3 = this.getEditorData(),
            editorState = _this$getEditorData3.editorState,
            onChange = _this$getEditorData3.onChange;

        if (this.isImageSelected()) {
          var selectedBlock = this.getSelectedBlock();
          var oldData = selectedBlock.getData();
          var newData = oldData.update('link', function (link) {
            return link.merge({
              url: url,
              isTargetBlank: isTargetBlank
            });
          });
          var blockSelection = SelectionState.createEmpty(selectedBlock.getKey());
          var contentStateWithImageLink = Modifier.mergeBlockData(editorState.getCurrentContent(), blockSelection, newData);
          var editorStateWithImageLink = EditorState.push(editorState, contentStateWithImageLink, 'change-block-data');
          onChange(editorStateWithImageLink);
          return editorStateWithImageLink;
        }

        return editorState;
      },
      handleClose: function handleClose() {
        var targetEditorState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var _this$props2 = this.props,
            onClose = _this$props2.onClose,
            onOpenChange = _this$props2.onOpenChange;
        var _this$state = this.state,
            shouldRestoreFocus = _this$state.shouldRestoreFocus,
            url = _this$state.url;

        if (!this.isNew() && (!url || url.trim().length === 0)) {
          this.handleRemove();
        }

        if (shouldRestoreFocus) {
          var _this$getEditorData4 = this.getEditorData(),
              editorState = _this$getEditorData4.editorState,
              onChange = _this$getEditorData4.onChange;

          var finalEditorState = targetEditorState || editorState;
          onChange(EditorState.forceSelection(finalEditorState, finalEditorState.getSelection()));
        }

        callIfPossible(onClose);
        onOpenChange(SyntheticEvent(false));
        onClosePopover();
        this.setState(this.getInitialState());
      },
      handleRemove: function handleRemove() {
        if (this.isImageSelected()) {
          this.setImageLinkData();
          this.setState({
            url: '',
            isTargetBlank: true
          });
        } else if (!this.isNew()) {
          var entityKey = this.props.entityKey;

          var _this$getEditorData5 = this.getEditorData(),
              editorState = _this$getEditorData5.editorState,
              onChange = _this$getEditorData5.onChange;

          var selection = pluginUtils.getEntitySelection(editorState, entityKey);
          onChange(RichUtils.toggleLink(editorState, selection, null));
        }

        onClosePopover();
      },
      handleConfirm: function handleConfirm() {
        var _this$props3 = this.props,
            decoratedText = _this$props3.decoratedText,
            trackLinkOnInsertInteraction = _this$props3.trackLinkOnInsertInteraction;

        var _this$getEditorData6 = this.getEditorData(),
            editorState = _this$getEditorData6.editorState,
            onChange = _this$getEditorData6.onChange;

        var _this$state2 = this.state,
            isNoFollow = _this$state2.isNoFollow,
            isTargetBlank = _this$state2.isTargetBlank,
            text = _this$state2.text,
            url = _this$state2.url;
        var urlWithProtocol = ensureUrlHasProtocol(url); // LI-197

        var encodedUrl = encodeUrl(urlWithProtocol);
        var selection = editorState.getSelection();
        var updatedEditorState = editorState;

        if (this.isImageSelected()) {
          updatedEditorState = this.setImageLinkData(url, isTargetBlank);
        } else if (this.isNew()) {
          var _editorState$getCurre;

          var contentStateWithEntity = editorState.getCurrentContent();
          contentStateWithEntity = (_editorState$getCurre = editorState.getCurrentContent()).createEntity.apply(_editorState$getCurre, _toConsumableArray(getEntityOptions(encodedUrl, isTargetBlank, isNoFollow)));
          var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          var linkStyles = editorState.getCurrentInlineStyle().filter(function (style) {
            // remove all non-text-color styles (but leave 'background-color', which
            // unfortunately is a superstring of 'color')
            return style.includes('background-color') || !style.includes('color');
          });
          var modifierMethod = selection.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
          updatedEditorState = EditorState.push(editorState, modifierMethod(contentStateWithEntity, selection, text, linkStyles, entityKey), 'insert-characters');
          updatedEditorState = EditorState.forceSelection(updatedEditorState, updatedEditorState.getCurrentContent().getSelectionAfter());
          updatedEditorState = EditorState.setInlineStyleOverride(updatedEditorState, editorState.getCurrentInlineStyle());
          onChange(updatedEditorState);
        } else {
          var _entityKey = this.props.entityKey;
          var entitySelection = pluginUtils.getEntitySelection(editorState, _entityKey);
          var contentState = editorState.getCurrentContent();
          contentState = contentState.mergeEntityData(_entityKey, {
            isNoFollow: isNoFollow,
            isTargetBlank: isTargetBlank,
            url: encodedUrl
          });
          updatedEditorState = EditorState.push(editorState, Modifier.applyEntity(contentState, editorState.getSelection(), _entityKey), 'update-entity');

          if (text !== decoratedText) {
            var entityStyles = pluginUtils.getSelectedInlineStyles(EditorState.forceSelection(updatedEditorState, entitySelection));
            updatedEditorState = EditorState.push(updatedEditorState, Modifier.replaceText(updatedEditorState.getCurrentContent(), entitySelection, text, entityStyles, _entityKey), 'update-entity');
            onChange(updatedEditorState);
          } else {
            onChange(updatedEditorState);
          }
        }

        Tracker.track('draftLink', {
          action: INSERT_LINK,
          noFollow: isNoFollow,
          externalLink: isTargetBlank,
          isImage: this.isImageSelected()
        });

        if (trackLinkOnInsertInteraction) {
          trackLinkOnInsertInteraction();
        }

        callIfPossible(onInsertLink);
        this.setState(this.getInitialState());
        this.handleClose(updatedEditorState);
      },
      handleChange: function handleChange(state) {
        this.setState(state);
      },
      onOpenChange: function onOpenChange() {
        var onOpenChange = this.props.onOpenChange;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        onOpenChange.apply(void 0, args);

        if (args && args[0] && args[0].target && !args[0].target.value) {
          onClosePopover();
        }
      },
      renderPopoverContent: function renderPopoverContent() {
        var isNew = this.isNew();
        var _this$state3 = this.state,
            isNoFollow = _this$state3.isNoFollow,
            isTargetBlank = _this$state3.isTargetBlank,
            text = _this$state3.text,
            url = _this$state3.url;
        var linkFormProps = {};
        var isImageSelected = this.isImageSelected();

        if (isImageSelected) {
          linkFormProps.headerText = I18n.text('draftPlugins.linkPlugin.imageLink');
        }

        var pages = getPages ? getPages() : [];
        return /*#__PURE__*/_jsx(LinkForm, Object.assign({
          isNew: isNew && !isImageSelected,
          showText: !isImageSelected,
          text: text,
          url: url,
          isTargetBlank: isTargetBlank,
          isNoFollow: isNoFollow,
          hideNoFollowConfiguration: hideNoFollowConfiguration,
          hideTargetConfiguration: hideTargetConfiguration,
          onChange: this.handleChange,
          onConfirm: this.handleConfirm,
          onCancel: this.handleClose,
          onRemove: this.handleRemove,
          pages: pages
        }, linkFormProps));
      },
      render: function render() {
        var open = this.props.open;

        if (!Component) {
          // not wrapping a button so we're already in a popover
          return this.renderPopoverContent();
        }

        return /*#__PURE__*/_jsx(EventBoundaryPopover, {
          closeOnOutsideClick: true,
          className: "richtext-link",
          open: open,
          onOpenChange: this.onOpenChange,
          Content: this.renderPopoverContent,
          pinToConstraint: true,
          animateOnToggle: false,
          placement: popoverPlacement,
          children: /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {
            togglePopover: this.togglePopover
          }))
        });
      }
    });
    return Controllable(LinkPopover, ['open']);
  };
});