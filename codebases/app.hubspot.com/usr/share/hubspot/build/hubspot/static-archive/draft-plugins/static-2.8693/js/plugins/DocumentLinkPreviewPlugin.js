'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOMServer from 'react-dom/server';
import { createPlugin } from 'draft-extend';
import { DOCUMENT_CONSTANTS } from 'draft-plugins/lib/constants';
import hasSkipForm from 'draft-plugins/utils/hasSkipForm';
import createCustomDocumentLinkRegex from 'draft-plugins/lib/createCustomDocumentLinkRegex';
import createDocumentLinkMetadata from 'draft-plugins/utils/createDocumentLinkMetadata';
import { createPluginStack } from './createPluginStack';
import DocumentLinkPreviewPluginWrapper from 'draft-plugins/components/documents/DocumentLinkPreviewPluginWrapper';
import DocumentLinkPreviewTableContainer from 'draft-plugins/components/documents/DocumentLinkPreviewTableContainer';
import DocumentLinkPreview from 'draft-plugins/components/documents/DocumentLinkPreview';
import DocumentLinkPreviewMissing from 'draft-plugins/components/documents/DocumentLinkPreviewMissing';
var DOCUMENT_LINK_PREVIEW_CLASS = DOCUMENT_CONSTANTS.DOCUMENT_LINK_PREVIEW_CLASS,
    DOCUMENT_ATOMIC_TYPE = DOCUMENT_CONSTANTS.DOCUMENT_ATOMIC_TYPE;
var BLOCK_TYPE = 'atomic';
import * as DocumentLinkOutputTypes from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
export default (function (_ref) {
  var outputType = _ref.outputType;

  var createDocumentLinkPreviewBlock = function createDocumentLinkPreviewBlock(_ref2) {
    var name = _ref2.name,
        id = _ref2.id,
        description = _ref2.description,
        thumbnail = _ref2.thumbnail,
        link = _ref2.link,
        align = _ref2.align,
        imgWidth = _ref2.imgWidth,
        imgHeight = _ref2.imgHeight,
        skipForm = _ref2.skipForm;
    return {
      type: BLOCK_TYPE,
      data: createDocumentLinkMetadata({
        name: name,
        description: description,
        id: id,
        thumbnail: thumbnail,
        link: link,
        align: align,
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        skipForm: skipForm
      }).toObject()
    };
  };

  var blockRendererFn = function blockRendererFn(block) {
    var type = block.getType();
    var atomicType = block.getData().get('atomicType');

    if (type === BLOCK_TYPE && atomicType === DOCUMENT_ATOMIC_TYPE) {
      var hasMissingLink = block.getData().get('link').indexOf('missing.custom.documentlink') !== -1;

      if (hasMissingLink) {
        return {
          component: DocumentLinkPreviewMissing,
          editable: false
        };
      }

      return {
        component: DocumentLinkPreview,
        editable: false
      };
    }

    return undefined;
  };

  var htmlToBlock = function htmlToBlock(nodeName, node) {
    if (nodeName === 'figure' && node.className === DOCUMENT_LINK_PREVIEW_CLASS) {
      var tableNode = node.getElementsByClassName('document-link-preview-table')[0];
      var nameNode = node.getElementsByClassName('document-link-preview-name')[0];
      var descriptionNode = node.getElementsByClassName('document-link-preview-description')[0];
      var thumbnailNode = node.getElementsByClassName('document-link-preview-image')[0];
      var linkNode = node.getElementsByClassName('document-link-preview-link')[0];
      var link = linkNode && linkNode.innerText;
      var align = node.style.textAlign;
      var name = nameNode && nameNode.innerText;
      var description = descriptionNode && descriptionNode.innerText;
      var thumbnail = thumbnailNode && thumbnailNode.src;
      var imgWidth = thumbnailNode && "" + thumbnailNode.width;
      var imgHeight = thumbnailNode && "" + thumbnailNode.height;
      var result = createCustomDocumentLinkRegex().exec(link);

      if (result !== null) {
        // eslint-disable-next-line no-unused-vars
        var _result = _slicedToArray(result, 4),
            __match = _result[0],
            __baretag = _result[1],
            _id = _result[2],
            skipForm = _result[3];

        return createDocumentLinkPreviewBlock({
          align: align,
          link: link,
          id: _id,
          name: name,
          description: description,
          thumbnail: thumbnail,
          imgWidth: imgWidth,
          imgHeight: imgHeight,
          skipForm: skipForm
        });
      }

      var id = tableNode && tableNode.getAttribute('data-hs-document-link-preview-id');
      return createDocumentLinkPreviewBlock({
        align: align,
        link: link,
        id: id,
        name: name,
        description: description,
        thumbnail: thumbnail,
        imgWidth: imgWidth,
        imgHeight: imgHeight
      });
    }

    return undefined;
  }; // eslint-disable-next-line react/prop-types


  var blockToHTML = function blockToHTML(_ref3) {
    var type = _ref3.type,
        data = _ref3.data;

    if (!(type === BLOCK_TYPE && data.atomicType === DOCUMENT_ATOMIC_TYPE)) {
      return undefined;
    }

    var id = data.id,
        skipForm = data.skipForm;
    var table = ReactDOMServer.renderToStaticMarkup( /*#__PURE__*/_jsx("span", {
      children: /*#__PURE__*/_jsx(DocumentLinkPreviewTableContainer, {
        data: data,
        isPreview: false,
        outputType: outputType
      })
    }));

    if (id && hasSkipForm(skipForm) && outputType !== DocumentLinkOutputTypes.RENDERED) {
      return "{{ if custom.documentexists_" + id + " }}" + table + "{{ end }}";
    }

    return table;
  };

  var DocumentLinkPreviewPlugin = createPlugin({
    displayName: 'DocumentLinkPreviewPlugin',
    blockRendererFn: blockRendererFn,
    blockToHTML: blockToHTML,
    htmlToBlock: htmlToBlock
  });
  return createPluginStack(DocumentLinkPreviewPluginWrapper, DocumentLinkPreviewPlugin);
});