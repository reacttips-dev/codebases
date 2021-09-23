'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Map as ImmutableMap } from 'immutable';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import MissingMergeTag from 'sales-modal/components/enrollModal/MissingMergeTag';

var MissingMergeTagPluginComponent = function MissingMergeTagPluginComponent(_ref, _ref2) {
  var children = _ref.children,
      entityKey = _ref.entityKey;
  var getEditorState = _ref2.getEditorState,
      contact = _ref2.contact,
      user = _ref2.user,
      properties = _ref2.properties,
      flattenedProperties = _ref2.flattenedProperties,
      handleMissingMergeTags = _ref2.handleMissingMergeTags;

  var _useState = useState(function () {
    var contentState = getEditorState().getCurrentContent();

    var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
        type = _contentState$getEnti.type;

    return type;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      tagType = _useState2[0],
      setTagType = _useState2[1];

  useEffect(function () {
    var contentState = getEditorState().getCurrentContent();

    var _contentState$getEnti2 = contentState.getEntity(entityKey).getData(),
        type = _contentState$getEnti2.type;

    if (type !== tagType) {
      setTagType(type);
    }
  }, [entityKey, getEditorState, tagType]);
  return /*#__PURE__*/_jsx(MissingMergeTag, {
    tagType: tagType,
    properties: properties,
    flattenedProperties: flattenedProperties,
    contact: contact,
    user: user,
    handleMissingMergeTags: handleMissingMergeTags,
    children: children
  });
};

MissingMergeTagPluginComponent.propTypes = {
  children: PropTypes.any,
  entityKey: PropTypes.string.isRequired
};
MissingMergeTagPluginComponent.contextTypes = {
  getEditorState: PropTypes.func,
  contact: PropTypes.instanceOf(ContactRecord),
  user: PropTypes.object,
  properties: PropTypes.instanceOf(ImmutableMap),
  flattenedProperties: PropTypes.instanceOf(ImmutableMap),
  handleMissingMergeTags: PropTypes.func.isRequired
};
export default MissingMergeTagPluginComponent;