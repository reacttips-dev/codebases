'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import AtomicFocus from '../AtomicFocus';
import UIFlex from 'UIComponents/layout/UIFlex';
import DocumentLinkPreviewPopover from './DocumentLinkPreviewPopover';
import DocumentLinkPreviewTableContainer from './DocumentLinkPreviewTableContainer';
import { DOCUMENT_CONSTANTS } from '../../lib/constants';
import createCustomDocumentLinkRegex from '../../lib/createCustomDocumentLinkRegex';
var DOCUMENT_LINK_PREVIEW_CONTAINER_CLASS = DOCUMENT_CONSTANTS.DOCUMENT_LINK_PREVIEW_CONTAINER_CLASS,
    DOCUMENT_LINK_PREVIEW_POPOVER_CLASS = DOCUMENT_CONSTANTS.DOCUMENT_LINK_PREVIEW_POPOVER_CLASS,
    DOCUMENT_ATOMIC_TYPE = DOCUMENT_CONSTANTS.DOCUMENT_ATOMIC_TYPE;

var getUnknownDeckBlockData = function getUnknownDeckBlockData() {
  return {
    align: '',
    atomicType: DOCUMENT_ATOMIC_TYPE,
    description: null,
    link: null,
    name: I18n.text('draftPlugins.documentLinkPlugin.unknownDeck'),
    skipForm: null,
    thumbnail: null
  };
};

var DocumentLinkPlugin = createReactClass({
  displayName: "DocumentLinkPlugin",
  propTypes: {
    block: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
    overrideKeyDown: PropTypes.func.isRequired,
    restoreKeyDown: PropTypes.func.isRequired
  },
  contextTypes: {
    decks: PropTypes.instanceOf(ImmutableMap),
    getReadOnly: PropTypes.func.isRequired
  },
  getJustify: function getJustify() {
    var align = this.props.block.getData().get('align');

    if (align === 'center') {
      return 'center';
    }

    if (align === 'right') {
      return 'end';
    }

    return 'start';
  },
  getPreviewLinkData: function getPreviewLinkData(deckUnknown) {
    return deckUnknown ? getUnknownDeckBlockData() : this.props.block.getData().toJS();
  },
  handleClick: function handleClick() {
    if (!this.context.getReadOnly()) {
      this.props.onFocus();
    }
  },
  renderButton: function renderButton(deckUnknown) {
    if (!this.props.selected || deckUnknown) {
      return null;
    }

    return /*#__PURE__*/_jsx(DocumentLinkPreviewPopover, {
      block: this.props.block,
      previewLinkData: this.getPreviewLinkData(deckUnknown),
      overrideKeyDown: this.props.overrideKeyDown,
      restoreKeyDown: this.props.restoreKeyDown
    });
  },
  render: function render() {
    var deckId = parseInt(this.props.block.getData().get('id'), 10);
    var hasDeck = this.context.decks && this.context.decks.has(deckId);
    var link = this.props.block.getData().get('link');
    var isPlaceholderLink = createCustomDocumentLinkRegex().test(link);
    var isPlaceholderLinkMissingDeck = isPlaceholderLink && !hasDeck;
    var isMissingLink = link.indexOf('missing.custom.documentlink') !== -1 && !isPlaceholderLink;
    var deckUnknown = isPlaceholderLinkMissingDeck || isMissingLink;
    var className = 'document-link-preview' + (this.props.selected ? " selected" : "");
    return /*#__PURE__*/_jsx(UIFlex, {
      justify: this.getJustify(),
      children: /*#__PURE__*/_jsx("div", {
        className: DOCUMENT_LINK_PREVIEW_CONTAINER_CLASS,
        children: /*#__PURE__*/_jsxs("div", {
          className: className,
          onClick: this.handleClick,
          children: [/*#__PURE__*/_jsx(DocumentLinkPreviewTableContainer, {
            block: this.props.block,
            data: this.getPreviewLinkData(deckUnknown)
          }), this.renderButton(deckUnknown)]
        })
      })
    });
  }
});
export default AtomicFocus([DOCUMENT_LINK_PREVIEW_CONTAINER_CLASS, DOCUMENT_LINK_PREVIEW_POPOVER_CLASS])(DocumentLinkPlugin);