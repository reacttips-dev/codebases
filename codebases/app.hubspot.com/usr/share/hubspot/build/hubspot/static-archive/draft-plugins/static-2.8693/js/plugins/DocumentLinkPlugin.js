'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import identity from 'transmute/identity';
import { createPlugin, pluginUtils } from 'draft-extend';
import { createPluginStack } from './createPluginStack';
import TransformText from 'draft-plugins/plugins/TransformText';
import createCustomDocumentLinkRegex from 'draft-plugins/lib/createCustomDocumentLinkRegex';
import DeckSelectPopoverWrapper from 'draft-plugins/components/documents/DeckSelectPopoverWrapper';
import DocumentLinkToken from 'draft-plugins/components/documents/DocumentLinkToken';
import createEntityOptions from '../utils/createDocumentLinkEntityOptions';
import * as DocumentLinkOutputTypes from './documents/DocumentLinkOutputTypes';
import DocumentsButton from './documents/DocumentsButton';
import { DOCUMENT_CONSTANTS } from '../lib/constants';
var DOCUMENTS_LINK_ENTITY_TYPE = DOCUMENT_CONSTANTS.DOCUMENTS_LINK_ENTITY_TYPE;
export default (function (_ref) {
  var fetch = _ref.fetch,
      track = _ref.track,
      _ref$onIncludeLinkPre = _ref.onIncludeLinkPreview,
      onIncludeLinkPreview = _ref$onIncludeLinkPre === void 0 ? identity : _ref$onIncludeLinkPre,
      _ref$onInsertDocument = _ref.onInsertDocument,
      onInsertDocument = _ref$onInsertDocument === void 0 ? identity : _ref$onInsertDocument,
      _ref$outputType = _ref.outputType,
      outputType = _ref$outputType === void 0 ? DocumentLinkOutputTypes.EDITABLE : _ref$outputType,
      _ref$Button = _ref.Button,
      Button = _ref$Button === void 0 ? DocumentsButton : _ref$Button,
      page = _ref.page;

  var entityToHTML = function entityToHTML(entity, originalText) {
    if (entity.type === DOCUMENTS_LINK_ENTITY_TYPE) {
      var _entity$data = entity.data,
          id = _entity$data.id,
          skipForm = _entity$data.skipForm,
          customText = _entity$data.customText;
      var bareTag = "custom.documentlink_id_" + id + "_skipform_" + skipForm;

      if (customText) {
        return "{{ if custom.documentexists_" + id + " }}<a href=\"{{ " + bareTag + " }}\">" + originalText + "</a>{{ end }}";
      }

      return "{{ " + bareTag + " }}";
    }

    return originalText;
  };

  var textToEntity = function textToEntity(text, createEntity) {
    var results = [];
    text.replace(/\{\{\s?if custom\.document(?:link|exists)_(?:id_)?(\d+)(?:_skipform_(true|false))?\s?\}\}|\{\{\s?end\s?\}\}/gi, function (match, id, skipform, offset) {
      results.push({
        offset: offset,
        length: match.length,
        result: ''
      });
    }).replace(createCustomDocumentLinkRegex(), function (match, bareTag, id, skipForm, offset) {
      results.push({
        offset: offset,
        length: match.length,
        result: match,
        entity: createEntity.apply(void 0, _toConsumableArray(createEntityOptions({
          id: id,
          skipForm: skipForm,
          customText: false
        })))
      });
    });
    return results;
  };

  var htmlToEntity = function htmlToEntity(nodeName, node, createEntity) {
    if (nodeName === 'a' && node.hasAttribute('href')) {
      var result = createCustomDocumentLinkRegex().exec(node.getAttribute('href'));

      if (result !== null) {
        // eslint-disable-next-line no-unused-vars
        var _result = _slicedToArray(result, 4),
            __match = _result[0],
            __bareTag = _result[1],
            id = _result[2],
            skipForm = _result[3];

        return createEntity.apply(void 0, _toConsumableArray(createEntityOptions({
          id: id,
          skipForm: skipForm,
          customText: true
        })));
      }
    }

    return null;
  };

  var DeckSelectPopover = DeckSelectPopoverWrapper(Button, {
    fetch: fetch,
    track: track,
    outputType: outputType,
    onIncludeLinkPreview: onIncludeLinkPreview,
    onInsertDocument: onInsertDocument,
    page: page
  });
  var DocumentLinkPlugin = createPlugin({
    displayName: 'DocumentLinkPlugin',
    buttons: DeckSelectPopover,
    decorators: {
      strategy: pluginUtils.entityStrategy(DOCUMENTS_LINK_ENTITY_TYPE),
      component: DocumentLinkToken
    },
    entityToHTML: entityToHTML,
    htmlToEntity: htmlToEntity,
    textToEntity: textToEntity
  });
  var transformOptions = {
    dataProp: 'decks',
    entityType: DOCUMENTS_LINK_ENTITY_TYPE,
    dataFind: function dataFind(decks, entity) {
      var _entity$getData = entity.getData(),
          id = _entity$getData.id,
          customText = _entity$getData.customText;

      var deck = decks.find(function (d) {
        return d.get('id') === parseInt(id, 10);
      });

      if (customText) {
        return deck ? null : {
          text: I18n.text('draftPlugins.documentLinkPlugin.unknownDeck')
        };
      }

      return {
        text: deck ? deck.get('title') : I18n.text('draftPlugins.documentLinkPlugin.unknownDeck')
      };
    }
  };
  return createPluginStack(TransformText(transformOptions), DocumentLinkPlugin);
});