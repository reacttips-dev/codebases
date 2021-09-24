'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { getId } from 'customer-data-objects/record/ObjectRecordAccessors';
import { useFetchAssociatedObjects } from '../associations/hooks/useFetchAssociatedObjects';
import get from 'transmute/get';
import EmptyState from '../Components/EmptyState';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingCell from './LoadingCell';
import PropTypes from 'prop-types';
import AssociatedObjectsPopover from '../associations/components/AssociatedObjectsPopover';
import UIButton from 'UIComponents/button/UIButton';
import { useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import AssociationLink from '../associations/components/AssociationLink';

var GenericAssociationCell = function GenericAssociationCell(_ref) {
  var column = _ref.column,
      original = _ref.original;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      popoverOpen = _useState2[0],
      setPopoverOpen = _useState2[1];

  var objectId = getId(original);
  var associationDefinition = get('associationDefinition', column);
  var associationLabel = get('Header', column);

  var _useFetchAssociatedOb = useFetchAssociatedObjects({
    associationDefinition: associationDefinition,
    objectId: objectId
  }),
      data = _useFetchAssociatedOb.data,
      error = _useFetchAssociatedOb.error,
      loading = _useFetchAssociatedOb.loading;

  if (loading) {
    return /*#__PURE__*/_jsx(LoadingCell, {});
  }

  if (error) {
    // TODO: Error state
    return /*#__PURE__*/_jsx(EmptyState, {});
  } // Sometimes the hook can update the loading state before it supplies the data
  // this catches that case or any case where the data is not defined for some
  // reason


  if (!data) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var hasMore = data.hasMore,
      results = data.results;

  if (results.length === 0) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  if (results.length === 1) {
    return /*#__PURE__*/_jsx(AssociationLink, {
      associationDefinition: associationDefinition,
      objectId: results[0]
    });
  }

  var cellContentKey = hasMore ? 'customerDataTable.associations.hasMoreAssociationsCellContent' : 'customerDataTable.associations.cellContent';
  return /*#__PURE__*/_jsx(AssociatedObjectsPopover, {
    associationDefinition: associationDefinition,
    associationLabel: associationLabel,
    objectIds: results,
    onOpenChange: function onOpenChange(evt) {
      return setPopoverOpen(evt.target.value);
    },
    open: popoverOpen,
    children: /*#__PURE__*/_jsx(UIButton, {
      className: "p-x-0",
      onClick: function onClick() {
        return setPopoverOpen(function (isOpen) {
          return !isOpen;
        });
      },
      use: "transparent",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: cellContentKey,
        options: {
          numberOfAssociations: results.length
        }
      })
    })
  });
};

GenericAssociationCell.propTypes = {
  column: PropTypes.shape({
    associationDefinition: PropTypes.object.isRequired
  }).isRequired,
  original: PropTypes.oneOfType([PropTypes.object, ImmutablePropTypes.map, ImmutablePropTypes.record]).isRequired
};
export default GenericAssociationCell;