'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { List, Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { Modifier, EditorState, SelectionState } from 'draft-js';
import createDocumentLinkMetadata from 'draft-plugins/utils/createDocumentLinkMetadata';
import createLinkEntityOptions from 'draft-plugins/utils/createLinkEntityOptions';
import { INSERTED_DOCUMENT, INCLUDE_LINK_PREVIEW } from 'draft-plugins/tracking/Actions';
import { getDocumentsUrl } from 'draft-plugins/lib/links';
import insertAtomicBlockWithData from 'draft-plugins/utils/insertAtomicBlockWithData';
import isSelectionAtomic from 'draft-plugins/utils/isSelectionAtomic';
import * as DocumentLinkOutputTypes from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
import { createDeckLink, fetchDeck } from 'draft-plugins/api/DeckApi';
import EmptyStatePopover from 'draft-plugins/components/EmptyStatePopover';
import { callIfPossible } from 'UIComponents/core/Functions';
import UITextInput from 'UIComponents/input/UITextInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import createDocumentLinkEntityOptions from '../../utils/createDocumentLinkEntityOptions';
import DeckSelectPopoverForm from './DeckSelectPopoverForm';
import { DOCUMENT_CONSTANTS } from '../../lib/constants';
import documentsZeroStateImage from 'bender-url!../../../images/pql-documents.png';
var DOCUMENT_ATOMIC_TYPE = DOCUMENT_CONSTANTS.DOCUMENT_ATOMIC_TYPE;

var _memoizedSelectData = ImmutableMap();

function _buildSelectData(decks) {
  return decks.reduce(function (deckList, deck) {
    return deckList.push(ImmutableMap({
      value: "" + deck.get('id'),
      text: deck.get('title')
    }));
  }, List()).sortBy(function (deck) {
    return deck.get('text');
  }).toJS();
}

export default (function (Child, _ref) {
  var track = _ref.track,
      outputType = _ref.outputType,
      onInsertDocument = _ref.onInsertDocument,
      onIncludeLinkPreview = _ref.onIncludeLinkPreview;
  var DeckSelectEmptyStatePopover = EmptyStatePopover(Child);
  return createReactClass({
    displayName: Child ? "DeckSelectPopoverWrapper(" + Child.displayName + ")" : 'DeckSelectPopoverWrapper',
    propTypes: {
      decks: PropTypes.instanceOf(ImmutableMap),
      editorState: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      onClose: PropTypes.func,
      contactEmail: PropTypes.string,
      getDeck: PropTypes.func
    },
    getDefaultProps: function getDefaultProps() {
      return {
        getDeck: fetchDeck
      };
    },
    getInitialState: function getInitialState() {
      return {
        deckId: null,
        requireEmail: true,
        linkText: this.getCurrentlySelectedText(),
        open: false,
        includeLinkPreview: false
      };
    },
    UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
      var open = this.state.open;

      if (!open) {
        this.setState({
          linkText: this.getCurrentlySelectedText(nextProps)
        });
      }
    },
    getCurrentlySelectedText: function getCurrentlySelectedText() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var editorState = props.editorState;
      var selection = editorState.getSelection();

      if (selection.getStartKey() === selection.getEndKey()) {
        var block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());

        if (block) {
          return block.getText().slice(selection.getStartOffset(), selection.getEndOffset());
        }
      }

      return '';
    },
    getIsDocumentLinkPreviewCurrentlySelected: function getIsDocumentLinkPreviewCurrentlySelected() {
      var editorState = this.props.editorState;
      var selection = editorState.getSelection();

      if (!selection.isCollapsed() || !isSelectionAtomic(editorState)) {
        return false;
      }

      var content = editorState.getCurrentContent();
      var selectedBlock = content.getBlockForKey(selection.getStartKey());
      return selectedBlock.getData().get('atomicType') === DOCUMENT_ATOMIC_TYPE;
    },
    insertEntity: function insertEntity(text, entityOptions, previewData) {
      var _editorState$getCurre;

      var _this$props = this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange,
          onClose = _this$props.onClose;
      var includeLinkPreview = this.state.includeLinkPreview;
      var selection = editorState.getSelection();
      var currentContent = editorState.getCurrentContent();
      var currentBlockKey = selection.get('anchorKey');

      if (isSelectionAtomic(editorState)) {
        var nextBlockKey = currentContent.getKeyAfter(currentBlockKey);

        if (nextBlockKey === undefined) {
          return;
        }

        selection = SelectionState.createEmpty(nextBlockKey);
      }

      var modifierMethod = selection.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
      var contentStateWithEntity = editorState.getCurrentContent();
      contentStateWithEntity = (_editorState$getCurre = editorState.getCurrentContent()).createEntity.apply(_editorState$getCurre, _toConsumableArray(entityOptions));
      var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      var updatedEditorState = EditorState.push(editorState, modifierMethod(contentStateWithEntity, selection, text, editorState.getCurrentInlineStyle(), entityKey), 'insert-characters');

      if (includeLinkPreview) {
        updatedEditorState = insertAtomicBlockWithData(updatedEditorState, previewData, false, true);
      }

      onChange(EditorState.forceSelection(updatedEditorState, updatedEditorState.getCurrentContent().getSelectionAfter()));
      callIfPossible(onClose);
      this.setState({
        open: false
      });
    },
    handleOpenChange: function handleOpenChange(e) {
      this.setState({
        open: e.target.value
      });
    },
    handleCancel: function handleCancel() {
      var onClose = this.props.onClose;
      callIfPossible(onClose);
      this.setState({
        open: false
      });
    },
    onClick: function onClick() {
      this.setState({
        open: !this.state.open
      });
    },
    handleDeckSelect: function handleDeckSelect(e) {
      var _this$state = this.state,
          deckId = _this$state.deckId,
          linkText = _this$state.linkText;
      var decks = this.props.decks;
      var newId = parseInt(e.target.value, 10);

      if (newId !== deckId) {
        var newState = {
          deckId: newId
        };
        var oldDeck = decks.get(deckId);
        var newDeck = decks.get(newId);
        var textIsTitle = oldDeck !== undefined && linkText === oldDeck.get('title');

        if (linkText === null || textIsTitle) {
          newState.linkText = newDeck.get('title');
        }

        this.setState(newState);
      }
    },
    toggleRequireEmail: function toggleRequireEmail() {
      this.setState(function (_ref2) {
        var requireEmail = _ref2.requireEmail;
        return {
          requireEmail: !requireEmail
        };
      });
    },
    toggleLinkPreview: function toggleLinkPreview() {
      this.setState(function (_ref3) {
        var includeLinkPreview = _ref3.includeLinkPreview;
        return {
          includeLinkPreview: !includeLinkPreview
        };
      });
    },
    handleTextChange: function handleTextChange(e) {
      var linkText = this.state.linkText;
      var newText = e.target.value;

      if (linkText !== newText && newText.length < 300) {
        this.setState({
          linkText: newText
        });
      }
    },
    handleConfirm: function handleConfirm() {
      var _this = this;

      var _this$props2 = this.props,
          contactEmail = _this$props2.contactEmail,
          getDeck = _this$props2.getDeck;
      var _this$state2 = this.state,
          deckId = _this$state2.deckId,
          requireEmail = _this$state2.requireEmail,
          includeLinkPreview = _this$state2.includeLinkPreview,
          linkText = _this$state2.linkText;
      var skipForm = !requireEmail;

      if (track) {
        track(INSERTED_DOCUMENT);
      }

      onInsertDocument();

      if (includeLinkPreview) {
        if (track) {
          track(INCLUDE_LINK_PREVIEW);
        }

        callIfPossible(onIncludeLinkPreview);
      }

      var isCustomText = linkText === undefined || linkText.trim().length > 0;

      if (outputType === DocumentLinkOutputTypes.RENDERED) {
        return createDeckLink(deckId, skipForm, contactEmail).then(function (presentation) {
          var slides = presentation.get('slides');

          _this.insertEntity(isCustomText ? linkText : presentation.get('name'), createLinkEntityOptions(presentation.get('shortLink'), true, false), createDocumentLinkMetadata({
            name: presentation.get('name'),
            id: deckId,
            skipForm: skipForm,
            link: presentation.get('shortLink'),
            thumbnail: slides.isEmpty() ? null : slides.first().get('thumbnailUrl')
          }));
        });
      }

      return getDeck(deckId).then(function (deck) {
        var slides = deck.get('slides');
        return _this.insertEntity(isCustomText ? linkText : deck.get('title'), createDocumentLinkEntityOptions({
          id: deckId,
          skipForm: skipForm,
          customText: isCustomText
        }), createDocumentLinkMetadata({
          name: deck.get('title'),
          id: deckId,
          skipForm: skipForm,
          link: '',
          thumbnail: slides.isEmpty() ? null : slides.first().get('thumbnailUrl')
        }));
      });
    },
    handleEmptyStateOnConfirm: function handleEmptyStateOnConfirm() {
      window.open(getDocumentsUrl(), '_blank');
    },
    buildSelectData: function buildSelectData() {
      var decks = this.props.decks;

      if (decks === null) {
        return [];
      }

      if (_memoizedSelectData.has(decks)) {
        return _memoizedSelectData.get(decks);
      }

      var result = _buildSelectData(decks);

      _memoizedSelectData = _memoizedSelectData.set(decks, result);
      return result;
    },
    renderDisplayText: function renderDisplayText() {
      var linkText = this.state.linkText;
      var label = I18n.text('draftPlugins.documents.decksModal.linkTextLabel');
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: label,
        children: /*#__PURE__*/_jsx(UITextInput, {
          "data-test-id": "display-text",
          onChange: this.handleTextChange,
          value: linkText
        })
      });
    },
    renderDeckSelectPopoverForm: function renderDeckSelectPopoverForm() {
      var _this$state3 = this.state,
          requireEmail = _this$state3.requireEmail,
          includeLinkPreview = _this$state3.includeLinkPreview,
          deckId = _this$state3.deckId;
      var deckOptions = this.buildSelectData();
      var displayText = this.renderDisplayText();
      return /*#__PURE__*/_jsx(DeckSelectPopoverForm, {
        selectedDeckId: deckId,
        requireEmail: requireEmail,
        deckOptions: deckOptions,
        displayText: displayText,
        includeLinkPreview: includeLinkPreview,
        toggleLinkPreview: this.toggleLinkPreview,
        handleDeckSelect: this.handleDeckSelect,
        toggleRequireEmail: this.toggleRequireEmail,
        handleConfirm: this.handleConfirm,
        handleCancel: this.handleCancel
      });
    },
    renderDeckPopover: function renderDeckPopover() {
      var open = this.state.open;

      if (!Child) {
        return this.renderDeckSelectPopoverForm();
      }

      return /*#__PURE__*/_jsx(UIPopover, {
        className: "deck-select__popover",
        "data-test-id": "deck-select-popover",
        onOpenChange: this.handleOpenChange,
        open: open,
        Content: this.renderDeckSelectPopoverForm,
        children: /*#__PURE__*/_jsx(Child, Object.assign({}, this.props, {
          active: this.getIsDocumentLinkPreviewCurrentlySelected(),
          togglePopover: this.onClick
        }))
      });
    },
    renderDeckEmptyState: function renderDeckEmptyState() {
      var title = I18n.text('draftPlugins.documents.emptyStateTitle');

      var bodyText = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "draftPlugins.documents.emptyStateBodyText"
      });

      var confirmText = I18n.text('draftPlugins.documents.emptyStateConfirm');
      var cancelText = I18n.text('draftPlugins.documents.emptyStateCancel');
      return /*#__PURE__*/_jsx(DeckSelectEmptyStatePopover, {
        title: title,
        bodyText: bodyText,
        image: documentsZeroStateImage,
        confirmText: confirmText,
        cancelText: cancelText,
        onCancel: this.handleCancel,
        onConfirm: this.handleEmptyStateOnConfirm
      });
    },
    render: function render() {
      var decks = this.props.decks;

      if (!decks || decks.isEmpty()) {
        return this.renderDeckEmptyState();
      }

      return this.renderDeckPopover();
    }
  });
});