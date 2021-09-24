'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import DocumentLinkPreviewTable from './DocumentLinkPreviewTable';
import { DOCUMENT_CONSTANTS } from '../../lib/constants';
import hasSkipForm from '../../utils/hasSkipForm';
import * as DocumentLinkOutputTypes from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
var DOCUMENT_LINK_PREVIEW_CLASS = DOCUMENT_CONSTANTS.DOCUMENT_LINK_PREVIEW_CLASS;

var DocumentLinkPreviewTableContainer = function DocumentLinkPreviewTableContainer(_ref) {
  var data = _ref.data,
      block = _ref.block,
      outputType = _ref.outputType;
  var id = data.id,
      skipForm = data.skipForm,
      align = data.align,
      link = data.link;
  var selectedLink = id && hasSkipForm(skipForm) && outputType !== DocumentLinkOutputTypes.RENDERED ? "{{ custom.documentlink_id_" + id + "_skipform_" + skipForm + " }}" : link;

  if (block) {
    return /*#__PURE__*/_jsx(DocumentLinkPreviewTable, Object.assign({}, data, {
      block: block,
      selectedLink: selectedLink
    }));
  }

  return /*#__PURE__*/_jsx("figure", {
    className: DOCUMENT_LINK_PREVIEW_CLASS,
    style: {
      textAlign: align
    },
    children: /*#__PURE__*/_jsx("a", {
      href: selectedLink,
      target: "_blank",
      rel: "noreferrer noopener",
      style: {
        display: 'inline-block',
        textDecoration: 'none'
      },
      children: /*#__PURE__*/_jsx(DocumentLinkPreviewTable, Object.assign({}, data, {
        selectedLink: selectedLink
      }))
    })
  });
};

DocumentLinkPreviewTableContainer.propTypes = {
  data: PropTypes.object.isRequired,
  block: PropTypes.object,
  outputType: PropTypes.string
};
export default DocumentLinkPreviewTableContainer;