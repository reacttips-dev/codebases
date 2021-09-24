'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_COLUMN_WIDTH } from 'customer-data-table/constants/ColumnConstants';
import ColumnRecord from './ColumnRecord';
import invariant from 'react-utils/invariant';
import GenericAssociationCell from '../cells/GenericAssociationCell';
import isString from 'transmute/isString';
import { isGenericAssociation } from '../associations/utils/isGenericAssociation';

var genericAssociationColumn = function genericAssociationColumn(params) {
  var associationDefinition = params.associationDefinition,
      label = params.label,
      name = params.name,
      _params$UNSAFE_flexWi = params.UNSAFE_flexWidth,
      UNSAFE_flexWidth = _params$UNSAFE_flexWi === void 0 ? false : _params$UNSAFE_flexWi,
      _params$order = params.order,
      order = _params$order === void 0 ? 0 : _params$order,
      _params$sortable = params.sortable,
      sortable = _params$sortable === void 0 ? false : _params$sortable,
      _params$width = params.width,
      width = _params$width === void 0 ? DEFAULT_COLUMN_WIDTH : _params$width,
      rest = _objectWithoutProperties(params, ["associationDefinition", "label", "name", "UNSAFE_flexWidth", "order", "sortable", "width"]);

  invariant(associationDefinition, 'generic association columns require an association definition');
  invariant(isString(label), 'generic association columns require a label');
  invariant(isGenericAssociation(name), 'generic association columns must have a name with the format "associations.<associationCategory>-<associationTypeId>"');
  return ColumnRecord(Object.assign({}, rest, {
    associationDefinition: associationDefinition,
    Header: /*#__PURE__*/_jsx("span", {
      children: label
    }),
    id: name,
    order: order,
    sortable: sortable,
    width: UNSAFE_flexWidth ? undefined : width,
    Cell: GenericAssociationCell
  }));
};

export default genericAssociationColumn;