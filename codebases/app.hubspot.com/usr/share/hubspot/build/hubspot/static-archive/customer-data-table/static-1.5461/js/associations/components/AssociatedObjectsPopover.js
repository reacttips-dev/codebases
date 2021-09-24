'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIList from 'UIComponents/list/UIList';
import AssociationLink from './AssociationLink';
import H4 from 'UIComponents/elements/headings/H4';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import { useCallback, useState } from 'react';
import UIPaginator from 'UIComponents/paginator/UIPaginator';
import UIPopoverFooter from 'UIComponents/tooltip/UIPopoverFooter';
import { AssociationDefinitionType } from '../propTypes/AssociationDefinitionType';
import styled from 'styled-components';
var LinkWrapper = styled.div.withConfig({
  displayName: "AssociatedObjectsPopover__LinkWrapper",
  componentId: "sc-1fh6f3l-0"
})(["line-height:normal;"]);

var AssociatedObjectsPopover = function AssociatedObjectsPopover(_ref) {
  var associationDefinition = _ref.associationDefinition,
      associationLabel = _ref.associationLabel,
      children = _ref.children,
      objectIds = _ref.objectIds,
      onOpenChange = _ref.onOpenChange,
      open = _ref.open,
      pageSize = _ref.pageSize;

  var _useState = useState(1),
      _useState2 = _slicedToArray(_useState, 2),
      pageNumber = _useState2[0],
      setPageNumber = _useState2[1];

  var renderContent = useCallback(function () {
    var numberOfPages = Math.ceil(objectIds.length / pageSize);
    var offset = (pageNumber - 1) * pageSize;
    var objectsIdsOnPage = objectIds.slice(offset, offset + pageSize);
    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(UIPopoverHeader, {
        children: /*#__PURE__*/_jsx(H4, {
          children: associationLabel
        })
      }), /*#__PURE__*/_jsx(UIPopoverBody, {
        children: /*#__PURE__*/_jsx(UIList, {
          children: objectsIdsOnPage.map(function (objectId, index) {
            return /*#__PURE__*/_jsx(LinkWrapper, {
              className: index === 0 ? undefined : 'm-top-1',
              children: /*#__PURE__*/_jsx(AssociationLink, {
                associationDefinition: associationDefinition,
                objectId: objectId
              })
            }, objectId);
          })
        })
      }), /*#__PURE__*/_jsx(UIPopoverFooter, {
        children: numberOfPages > 1 && /*#__PURE__*/_jsx(UIPaginator, {
          maxVisiblePageButtons: 0,
          onPageChange: function onPageChange(_ref2) {
            var value = _ref2.target.value;
            return setPageNumber(value);
          },
          pageCount: numberOfPages
        })
      })]
    });
  }, [associationDefinition, associationLabel, objectIds, pageNumber, pageSize]);
  return /*#__PURE__*/_jsx(UIPopover, {
    onOpenChange: onOpenChange,
    open: open,
    placement: "right",
    renderContent: renderContent,
    showCloseButton: true,
    width: 300,
    children: children
  });
};

AssociatedObjectsPopover.propTypes = {
  associationDefinition: AssociationDefinitionType.isRequired,
  associationLabel: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  objectIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  onOpenChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  pageSize: PropTypes.number
};
AssociatedObjectsPopover.defaultProps = {
  pageSize: 10
};
export default AssociatedObjectsPopover;