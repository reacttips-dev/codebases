'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { INSERT_PERSONALIZATION_TOKEN } from 'rich-text-lib/constants/usageTracking';
import { callIfPossible } from 'UIComponents/core/Functions';
import Controllable from 'UIComponents/decorators/Controllable';
import { FOCUS_TARGETS } from '../../lib/constants';
import { MergeTagTypes, MergeTagDefaultOptions } from '../../lib/mergeTagConstants';
import { insertedToken } from '../../tracking/Actions';
import getMemoizedPropertyOptions from '../../utils/getMemoizedPropertyOptions';
import getPropertiesWithDefaults from '../../utils/getPropertiesWithDefaults';
import getTagName from '../../utils/getTagName';
import isSelectionAtomic from '../../utils/isSelectionAtomic';
import isSelectionAtEndOfLine from '../../utils/isSelectionAtEndOfLine';
import { escapePlaceholderProperty, cleanPlaceholderProperty } from '../../utils/propertyUtils';
import MergeTagSelectPopoverHeader from './MergeTagSelectPopoverHeader';
import MergeTagSelectPopoverBody from './MergeTagSelectPopoverBody';
import MergeTagSelectPopoverFooter from './MergeTagSelectPopoverFooter';
export default (function (_ref) {
  var _MergeTagSelectPopove;

  var mergeTags = _ref.mergeTags,
      createEntityOptions = _ref.createEntityOptions,
      _ref$dataProp = _ref.dataProp,
      dataProp = _ref$dataProp === void 0 ? 'properties' : _ref$dataProp,
      tracker = _ref.tracker,
      onInsertToken = _ref.onInsertToken,
      Tracker = _ref.Tracker;

  var MergeTagSelectPopoverContent = /*#__PURE__*/function (_Component) {
    _inherits(MergeTagSelectPopoverContent, _Component);

    function MergeTagSelectPopoverContent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, MergeTagSelectPopoverContent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MergeTagSelectPopoverContent)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.state = {
        placeholderToken: ''
      };

      _this.handleChangeType = function (e) {
        var onSelectedTypeChange = _this.props.onSelectedTypeChange;
        onSelectedTypeChange(e);
      };

      _this.handleSelectToken = function (property) {
        var _stateToUse$getCurren;

        var _this$props = _this.props,
            currentFocus = _this$props.currentFocus,
            editorState = _this$props.editorState,
            onChange = _this$props.onChange,
            onClose = _this$props.onClose,
            selectedType = _this$props.selectedType,
            subjectState = _this$props.subjectState,
            subjectChange = _this$props.subjectChange;
        var selection = editorState.getSelection();
        var subjectSelection = subjectState && subjectState.getSelection();
        var selectedOptions = MergeTagDefaultOptions.get(selectedType);
        var prefix = selectedOptions.get('prefix');
        var formattedProperty = selectedType === MergeTagTypes.PLACEHOLDER ? escapePlaceholderProperty(property) : property;
        var properties = getPropertiesWithDefaults(_this.props[dataProp]);
        var entityData = Object.assign({}, selectedOptions.toJS(), {
          property: formattedProperty
        });
        var stateToUse = editorState;
        var selectionToUse = selection;
        var onChangeToUse = onChange;
        var currentContent = editorState.getCurrentContent();
        var currentBlockKey = selection.get('anchorKey');

        if (isSelectionAtomic(editorState)) {
          var nextBlockKey = currentContent.getKeyAfter(currentBlockKey);

          if (nextBlockKey === undefined) {
            return;
          }

          selectionToUse = SelectionState.createEmpty(nextBlockKey);
        }

        if (currentFocus === FOCUS_TARGETS.SUBJECT) {
          stateToUse = subjectState;
          selectionToUse = subjectSelection;
          onChangeToUse = subjectChange;
        }

        var inserter = selectionToUse.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
        var currentStyles = EditorState.forceSelection(stateToUse, selectionToUse).getCurrentInlineStyle();
        var tagName = getTagName(prefix, formattedProperty, properties);

        var contentStateWithEntity = (_stateToUse$getCurren = stateToUse.getCurrentContent()).createEntity.apply(_stateToUse$getCurren, _toConsumableArray(createEntityOptions(entityData)));

        var entityKey = contentStateWithEntity.getLastCreatedEntityKey(); // Add trailing zero-width space for typing with IME after merge tag
        // (only needed because MergeTagGroupDecorator has `contentEditable={false}`)
        // https://issues.hubspotcentral.com/browse/SCONTENT-2596

        var addTrailingZeroWidthSpace = isSelectionAtEndOfLine(editorState);

        if (addTrailingZeroWidthSpace) {
          contentStateWithEntity = Modifier.insertText(contentStateWithEntity, selectionToUse.merge({
            anchorOffset: selectionToUse.getEndOffset(),
            focusOffset: selectionToUse.getEndOffset()
          }), "\u200B");
        }

        var updatedContentState = inserter(contentStateWithEntity, selectionToUse, tagName, currentStyles, entityKey);
        var newEditorState = EditorState.push(stateToUse, updatedContentState, 'insert-characters');
        Tracker.track('draftToken', {
          action: INSERT_PERSONALIZATION_TOKEN,
          method: 'toolbar',
          tokenCategory: selectedType.toLowerCase(),
          // match TinyMCE
          tokenName: property
        });
        var selectionAfterEntity = updatedContentState.getSelectionAfter();

        if (addTrailingZeroWidthSpace) {
          var selectionOffset = selectionAfterEntity.getAnchorOffset();
          selectionAfterEntity = selectionAfterEntity.merge({
            anchorOffset: selectionOffset + 1,
            focusOffset: selectionOffset + 1,
            isBackward: false,
            hasFocus: true
          });
        }

        onChangeToUse(EditorState.forceSelection(newEditorState, selectionAfterEntity));

        _this.setState({
          placeholderToken: ''
        });

        if (tracker) {
          tracker(insertedToken(prefix));
        }

        onInsertToken(prefix);
        callIfPossible(onClose);
      };

      _this.handlePlaceholderTokenChange = function (e) {
        var token = e.target.value;

        _this.setState({
          placeholderToken: cleanPlaceholderProperty(token)
        });
      };

      return _this;
    }

    _createClass(MergeTagSelectPopoverContent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this._typeaheadContainer) {
          this._typeaheadContainer.focus();
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props2 = this.props,
            onClose = _this$props2.onClose,
            selectedType = _this$props2.selectedType;
        var placeholderToken = this.state.placeholderToken;
        var propertyOptions = getMemoizedPropertyOptions(selectedType, this.props[dataProp]);
        var content = [/*#__PURE__*/_jsx(MergeTagSelectPopoverHeader, {
          selectedType: selectedType,
          mergeTags: mergeTags,
          onChange: this.handleChangeType
        }, "header"), /*#__PURE__*/_jsx(MergeTagSelectPopoverBody, {
          ref: function ref(body) {
            _this2._typeaheadContainer = body;
          },
          selectedType: selectedType,
          tokens: propertyOptions,
          onChange: this.handleSelectToken,
          placeholderToken: placeholderToken,
          onPlaceholderTokenChange: this.handlePlaceholderTokenChange
        }, "body")];

        if (selectedType === MergeTagTypes.PLACEHOLDER) {
          content.push( /*#__PURE__*/_jsx(MergeTagSelectPopoverFooter, {
            placeholderToken: placeholderToken,
            onInsert: this.handleSelectToken,
            onCancel: onClose
          }, "footer"));
        }

        return /*#__PURE__*/_jsx("span", {
          children: content
        });
      }
    }]);

    return MergeTagSelectPopoverContent;
  }(Component);

  MergeTagSelectPopoverContent.propTypes = (_MergeTagSelectPopove = {
    currentFocus: PropTypes.oneOf(Object.keys(FOCUS_TARGETS).map(function (key) {
      return FOCUS_TARGETS[key];
    })).isRequired,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectedTypeChange: PropTypes.func.isRequired,
    selectedType: PropTypes.string.isRequired,
    subjectState: PropTypes.instanceOf(EditorState),
    subjectChange: PropTypes.func
  }, _defineProperty(_MergeTagSelectPopove, dataProp, PropTypes.instanceOf(ImmutableMap)), _defineProperty(_MergeTagSelectPopove, "onClose", PropTypes.func), _MergeTagSelectPopove);
  MergeTagSelectPopoverContent.defaultProps = {
    selectedType: MergeTagTypes.CONTACT
  };
  return Controllable(MergeTagSelectPopoverContent, ['selectedType']);
});