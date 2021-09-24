'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MergeTagDefaultOptions } from 'draft-plugins/lib/mergeTagConstants';
import { forEachNode } from 'rich-text-lib/utils/dom';
var MergeTagTokenWrapper = styled.span.withConfig({
  displayName: "MergeTagGroupDecorator__MergeTagTokenWrapper",
  componentId: "sc-16sdmbq-0"
})(["background-color:", ";border:solid 2px ", " !important;border-radius:2px;color:", ";cursor:default;display:inline-block;line-height:1;margin:0;padding:4px 8px;vertical-align:middle;user-select:text;width:auto;"], function (props) {
  return props.backgroundColor;
}, function (props) {
  return props.selected ? props.color : 'transparent';
}, function (props) {
  return props.color;
});

var diveToTextNode = function diveToTextNode(node) {
  if (node.nodeName === '#text' || node.nodeName === 'BR') {
    return node;
  }

  var child = node.firstChild;

  if (!child) {
    return null; // no text child found
  }

  return diveToTextNode(child);
};

var MergeTagGroupDecorator = function MergeTagGroupDecorator(_ref) {
  var contentState = _ref.contentState,
      children = _ref.children,
      offsetKey = _ref.offsetKey,
      entityKey = _ref.entityKey;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isSelected = _useState2[0],
      setIsSelected = _useState2[1];

  var token = useRef();
  useEffect(function () {
    var keydownHandler = document.addEventListener('keydown', function (evt) {
      var key = evt.key;

      if (key !== 'Backspace') {
        return;
      }

      var selection = document.getSelection();
      var anchorNode = selection.anchorNode,
          isCollapsed = selection.isCollapsed,
          rangeCount = selection.rangeCount;
      var range = selection.getRangeAt(0);

      if (!isCollapsed || rangeCount < 1) {
        return;
      }

      var tokenNode = token.current;
      var isSelectionInToken = tokenNode && (tokenNode.isEqualNode(anchorNode) || tokenNode.contains(anchorNode));
      var isSelectionAtStartOfNode = range.startOffset === 0;

      if (isSelectionInToken && isSelectionAtStartOfNode) {
        // move selection to end of preceding node
        var blockRoot = anchorNode.parentNode.closest('[data-block="true"]');
        var anchorSiblings = blockRoot.querySelector('[data-offset-key]').childNodes;
        var anchorIndex = 0;
        forEachNode(function (node, index) {
          if (node.isEqualNode(anchorNode) || node.contains(anchorNode)) {
            anchorIndex = index;
          }
        }, anchorSiblings);

        if (anchorIndex === 0) {
          // already at the start of the line
          // browser handling will deal with this
          return;
        }

        var indexToSelect = anchorIndex - 1;
        var nodeToSelect = diveToTextNode(anchorSiblings[indexToSelect]);
        var offset = nodeToSelect.length;
        range.setStart(nodeToSelect, offset);
        range.setEnd(nodeToSelect, offset);
        return;
      }
    });
    return function () {
      document.removeEventListener('keydown', keydownHandler);
    };
  });
  useEffect(function () {
    var selectionHandler = document.addEventListener('selectionchange', function () {
      var _document$getSelectio = document.getSelection(),
          anchorNode = _document$getSelectio.anchorNode;

      var tokenNode = token.current;

      if (tokenNode && (tokenNode.isEqualNode(anchorNode) || tokenNode.contains(anchorNode))) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    });
    return function () {
      document.removeEventListener('selectionchange', selectionHandler);
    };
  }, [setIsSelected, token]);

  var _contentState$getEnti = contentState.getEntity(entityKey),
      data = _contentState$getEnti.data;

  var prefix = data.prefix;
  var backgroundColor = MergeTagDefaultOptions.getIn([prefix, 'backgroundColor']);
  var color = MergeTagDefaultOptions.getIn([prefix, 'color']);
  return /*#__PURE__*/_jsx(MergeTagTokenWrapper, {
    backgroundColor: backgroundColor,
    color: color,
    className: "template-editor__merge-tag",
    contentEditable: false,
    "data-offset-key": offsetKey,
    ref: token,
    selected: isSelected,
    children: children
  });
};

MergeTagGroupDecorator.propTypes = {
  contentState: PropTypes.object,
  children: PropTypes.any,
  offsetKey: PropTypes.string,
  entityKey: PropTypes.string
};
export default MergeTagGroupDecorator;