'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState, KeyBindingUtil, Modifier, RichUtils, SelectionState } from 'draft-js';
import { createPlugin, pluginUtils } from 'draft-extend';
import { createPluginStack } from '../createPluginStack';
import SmallToggleButton from '../../components/SmallToggleButton';
import { createTracker } from '../../tracking/usageTracker';
import isImageBlock from '../../utils/isImageBlock';
import LinkDecorator from './LinkDecorator';
import LinkPopoverDecorator from './LinkPopoverDecorator';
import getNormalizedLinkData from './getNormalizedLinkData';
import MutableEntityWithBoundaries from 'draft-plugins/plugins/MutableEntityWithBoundaries';
import createLinkEntityOptions from 'draft-plugins/utils/createLinkEntityOptions';
import removeEntitiesFromBlock from 'draft-plugins/utils/removeEntitiesFromBlock';
import { K } from 'draft-plugins/lib/keyCodes';
import { LINK_ENTITY_TYPE } from 'draft-plugins/lib/constants';
import UIButton from 'UIComponents/button/UIButton';
var entityStrategy = pluginUtils.entityStrategy,
    isEntityActive = pluginUtils.isEntityActive;
var Tracker;
var DEFAULT_OPTIONS = {
  Decorator: LinkDecorator,
  PopoverDecorator: LinkPopoverDecorator,
  entityOptionCreator: createLinkEntityOptions,
  showNoFollow: false,
  showTarget: true,
  hideTargetConfiguration: false,
  hideNoFollowConfiguration: false,
  onOpenPopover: function onOpenPopover() {},
  onClosePopover: function onClosePopover() {},
  onInsertLink: function onInsertLink() {},
  tooltipPlacement: 'bottom',
  useUnstyledButton: false
};

var selectionSplitsLink = function selectionSplitsLink(editorState) {
  var selection = editorState.getSelection();

  if (!selection.isCollapsed()) {
    return RichUtils.currentBlockContainsLink(editorState);
  }

  var anchorOffset = selection.getAnchorOffset();
  var focusOffset = selection.getFocusOffset();

  if (anchorOffset === 0 && focusOffset === 0) {
    // at the start of a line, don't need to split anything
    return false;
  }

  var contentState = editorState.getCurrentContent();
  var selectedBlockCharList = contentState.getBlockForKey(selection.getAnchorKey()).getCharacterList();
  var charBeforeCursor = selectedBlockCharList.get(anchorOffset - 1);
  var charAfterCursor = selectedBlockCharList.get(anchorOffset);
  var entityKeyBeforeCursor = charBeforeCursor && charBeforeCursor.getEntity();
  var entityKeyAfterCursor = charAfterCursor && charAfterCursor.getEntity();

  if (entityKeyBeforeCursor == null || entityKeyAfterCursor == null) {
    return false;
  }

  var entityBeforeCursor = contentState.getEntity(entityKeyBeforeCursor);
  var entityAfterCursor = contentState.getEntity(entityKeyAfterCursor);
  return !!entityBeforeCursor && !!entityAfterCursor && entityBeforeCursor.getType() === 'LINK' && entityAfterCursor.getType() === 'LINK';
};

export default (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!Tracker) {
    Tracker = createTracker();
  }

  var optionsWithDefaults = Object.assign({}, DEFAULT_OPTIONS, {}, options, {
    Tracker: Tracker
  });
  var Decorator = optionsWithDefaults.Decorator,
      PopoverDecorator = optionsWithDefaults.PopoverDecorator,
      entityOptionCreator = optionsWithDefaults.entityOptionCreator,
      useUnstyledButton = optionsWithDefaults.useUnstyledButton,
      tooltipPlacement = optionsWithDefaults.tooltipPlacement;

  var htmlToEntity = function htmlToEntity(nodeName, node, createEntity) {
    if (nodeName === 'a' && node.parentNode.nodeName !== 'FIGURE') {
      var url = node.getAttribute('href');
      var isNoFollow = node.getAttribute('rel') === 'nofollow';
      var isTargetBlank = node.getAttribute('target') === '_blank';
      return createEntity.apply(void 0, _toConsumableArray(entityOptionCreator(url, isTargetBlank, isNoFollow)));
    }

    return undefined;
  };

  var entityToHTML = function entityToHTML(entity, originalText) {
    var data = entity.data;

    if (entity.type === LINK_ENTITY_TYPE) {
      var showNoFollow = optionsWithDefaults.showNoFollow,
          showTarget = optionsWithDefaults.showTarget;

      var _getNormalizedLinkDat = getNormalizedLinkData(data, {
        showNoFollow: showNoFollow,
        showTarget: showTarget
      }),
          url = _getNormalizedLinkDat.url,
          isNoFollow = _getNormalizedLinkDat.isNoFollow,
          isTargetBlank = _getNormalizedLinkDat.isTargetBlank;

      var attrs = {
        href: url
      };

      if (isNoFollow) {
        attrs.rel = 'nofollow';
      }

      if (isTargetBlank) {
        attrs.target = '_blank';
      } else {
        // explicitly add self target for copy & paste use case
        attrs.target = '_self';
      }

      return /*#__PURE__*/_jsx("a", Object.assign({}, attrs));
    }

    return originalText;
  };

  var keyBindingFn = function keyBindingFn(e) {
    if (e.keyCode === K && KeyBindingUtil.hasCommandModifier(e)) {
      return 'toggle-link';
    }

    return undefined;
  };

  var tooltip = /*#__PURE__*/_jsx(FormattedMessage, {
    message: "draftPlugins.linkPlugin.tooltip"
  });

  var LinkButton = createReactClass({
    displayName: "LinkButton",
    propTypes: {
      addKeyCommandListener: PropTypes.func.isRequired,
      editorState: PropTypes.object.isRequired,
      disabled: PropTypes.bool,
      open: PropTypes.bool,
      removeKeyCommandListener: PropTypes.func.isRequired,
      togglePopover: PropTypes.func.isRequired,
      trackLinkOnClickInteraction: PropTypes.func
    },
    getDefaultProps: function getDefaultProps() {
      return {
        disabled: false
      };
    },
    componentDidMount: function componentDidMount() {
      this.props.addKeyCommandListener(this.handleKeyCommand);
    },
    componentWillUnmount: function componentWillUnmount() {
      this.props.removeKeyCommandListener(this.handleKeyCommand);
    },
    isLinkSelected: function isLinkSelected() {
      var editorState = this.props.editorState;
      var isTextLink = isEntityActive(editorState, LINK_ENTITY_TYPE);

      if (isTextLink) {
        return true;
      }

      var currentSelection = editorState.getSelection();
      var currentBlockKey = currentSelection.getFocusKey();
      var currentContent = editorState.getCurrentContent();
      var currentBlock = currentContent.getBlockForKey(currentBlockKey);

      if (!currentBlock) {
        return false;
      }

      var isImageSelected = isImageBlock(currentBlock);

      if (!isImageSelected) {
        return false;
      }

      var imageBlockData = currentBlock.getData();
      return Boolean(imageBlockData.getIn(['link', 'url'], false));
    },
    handleKeyCommand: function handleKeyCommand(editorState, command) {
      if (command === 'toggle-link') {
        this.props.togglePopover();
      }

      if (command === 'split-block' && selectionSplitsLink(editorState)) {
        var splitContent = Modifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
        var targetBlockKey = splitContent.getSelectionAfter().getAnchorKey();
        var blockAfterContent = splitContent.getBlockForKey(targetBlockKey);
        var contentWithoutTrailingEntity = removeEntitiesFromBlock(blockAfterContent, splitContent);
        var editorStateWithUpdatedContent = EditorState.push(editorState, contentWithoutTrailingEntity, 'split-block');
        return EditorState.forceSelection(editorStateWithUpdatedContent, SelectionState.createEmpty(targetBlockKey));
      }

      return undefined;
    },
    handleOnClick: function handleOnClick() {
      var _this$props = this.props,
          togglePopover = _this$props.togglePopover,
          trackLinkOnClickInteraction = _this$props.trackLinkOnClickInteraction,
          isPopoverOpen = _this$props.open;
      togglePopover();

      if (trackLinkOnClickInteraction && !isPopoverOpen) {
        trackLinkOnClickInteraction();
      }
    },
    render: function render() {
      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          isPopoverOpen = _this$props2.open;
      var isActive = this.isLinkSelected();

      if (useUnstyledButton) {
        var className = 'link-plugin-unstyled-button' + (isActive ? " private-hovered" : "");

        var buttonText = /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.linkPlugin.unstyledButtonText"
        });

        return /*#__PURE__*/_jsx(UIButton, {
          className: className,
          onClick: this.handleOnClick,
          children: buttonText
        }, LINK_ENTITY_TYPE);
      }

      var isLinkSelected = isPopoverOpen || isActive;
      var isButtonActive = !disabled && isLinkSelected;
      return /*#__PURE__*/_jsx(SmallToggleButton, {
        active: isButtonActive,
        icon: "link",
        className: "link-plugin-icon",
        disabled: disabled,
        onClick: this.handleOnClick,
        tooltip: tooltip,
        tooltipPlacement: tooltipPlacement
      }, LINK_ENTITY_TYPE);
    }
  });
  var DecoratedLinkButton = PopoverDecorator(LinkButton);
  return createPluginStack(MutableEntityWithBoundaries(LINK_ENTITY_TYPE), createPlugin({
    displayName: 'LinkPlugin',
    buttons: DecoratedLinkButton(entityOptionCreator, optionsWithDefaults),
    decorators: {
      strategy: entityStrategy(LINK_ENTITY_TYPE),
      component: Decorator(entityOptionCreator, optionsWithDefaults),
      props: optionsWithDefaults
    },
    keyBindingFn: keyBindingFn,
    htmlToEntity: htmlToEntity,
    entityToHTML: entityToHTML
  }));
});