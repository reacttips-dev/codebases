'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from '../Components/EmptyState';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PreviewClickButton from 'customer-data-table/Components/PreviewClickButton';
import PropTypes from 'prop-types';
import { memo } from 'react';
import UILink from 'UIComponents/link/UILink';
import { ENUMERATION, DATE_TIME, DATE, STRING } from 'customer-data-objects/property/PropertyTypes';
import { HTML } from 'customer-data-objects/property/PropertyFieldTypes';
import EnumCell from './EnumCell';
import DateTimeCell from './DateTimeCell';
import HtmlCell from './HtmlCell';
import { createLinkFromIdAndObjectType, getIdFromRecordOrValue, getTicketSubject, hasDealSplit } from 'customer-data-table/tableFunctions';
import get from 'transmute/get';
import TimezoneTypes from 'I18n/constants/TimezoneTypes';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import DealSplitIcon from '../Components/DealSplitIcon';
import identity from 'transmute/identity';
export var getContent = function getContent(value) {
  var type = get('type', value);
  var fieldType = get('fieldType', value);
  var cellValue = get('value', value); // HACK: These cases are meant to be a temporary fix to tide us over until table v2, when we can
  // replace all our custom property rendering logic with FormattedPropertyValue.

  if (type === ENUMERATION) {
    return /*#__PURE__*/_jsx(EnumCell, {
      isHubspotDefined: get('isHubspotDefined', value),
      options: get('options', value),
      value: cellValue
    });
  }

  if (type === DATE_TIME) {
    return /*#__PURE__*/_jsx(DateTimeCell, {
      i18nTimezoneType: TimezoneTypes.USER,
      value: cellValue
    });
  }

  if (type === DATE) {
    return /*#__PURE__*/_jsx(DateTimeCell, {
      i18nTimezoneType: TimezoneTypes.UTC,
      showTime: false,
      value: cellValue
    });
  }

  if (type === STRING && fieldType === HTML) {
    return /*#__PURE__*/_jsx(HtmlCell, {
      value: cellValue
    });
  }

  return getTicketSubject(value) || get('name', value) || /*#__PURE__*/_jsx(EmptyState, {});
};
export var getIcons = function getIcons(property, objectType, original) {
  var icons = [];
  var propertyName = get('name', property);

  if (objectType === DEAL && propertyName === 'dealname' && hasDealSplit(original)) {
    icons.push( /*#__PURE__*/_jsx(DealSplitIcon, {
      original: original
    }, "deal-split-icon"));
  }

  return icons.map(identity);
};

var ProfileLinkCell = function ProfileLinkCell(_ref) {
  var external = _ref.external,
      value = _ref.value,
      original = _ref.original,
      property = _ref.property,
      onPreviewClick = _ref.onPreviewClick,
      showPreviewButton = _ref.showPreviewButton,
      onCellClick = _ref.onCellClick,
      propsObjectType = _ref.objectType;
  if (!value) return /*#__PURE__*/_jsx(EmptyState, {});
  var id = getIdFromRecordOrValue(value);
  var objectType = get('objectType', value) || propsObjectType;
  var url = createLinkFromIdAndObjectType(id, objectType);
  var content = getContent(value);
  var renderedIcons = getIcons(property, objectType, original); // TODO: preview panel still has some rough edges so it's gated,
  // remove this once Cobject-Grid-Preview-Panel is ungated to all

  var renderedPreviewButton = onPreviewClick && showPreviewButton ? /*#__PURE__*/_jsx(PreviewClickButton, {
    id: id,
    onPreviewClick: onPreviewClick
  }) : null;
  return /*#__PURE__*/_jsxs("span", {
    className: "flex-row align-center truncate-text",
    children: [/*#__PURE__*/_jsxs(UILink, {
      className: "domain-name text-left truncate-text",
      external: external,
      href: !onCellClick && url,
      onClick: onCellClick && function () {
        return onCellClick(id);
      },
      children: [content || /*#__PURE__*/_jsx(EmptyState, {}), renderedIcons]
    }), renderedPreviewButton]
  });
};

ProfileLinkCell.propTypes = {
  external: PropTypes.bool,
  objectType: PropTypes.string,
  onCellClick: PropTypes.func,
  onPreviewClick: PropTypes.func,
  original: PropTypes.oneOfType([PropTypes.object, ImmutablePropTypes.map, ImmutablePropTypes.record]),
  property: PropTypes.object,
  showPreviewButton: PropTypes.bool,
  value: PropTypes.oneOfType([ImmutablePropTypes.map, ImmutablePropTypes.record])
};
ProfileLinkCell.defaultProps = {
  external: false,
  showPreviewButton: true
};
export default /*#__PURE__*/memo(ProfileLinkCell);