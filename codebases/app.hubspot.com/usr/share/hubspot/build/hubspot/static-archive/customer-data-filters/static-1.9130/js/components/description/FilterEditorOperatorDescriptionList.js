'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import * as FilterQueryFormat from 'customer-data-filters/filterQueryFormat/FilterQueryFormat';
import FilterEditorOperatorDescriptionGroup from './FilterEditorOperatorDescriptionGroup';
import FilterType from '../propTypes/FilterType';
import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import UIList from 'UIComponents/list/UIList';
import memoize from 'transmute/memoize';
var groupFilterFamilies = memoize(function (baseFilterFamily, descriptions) {
  return descriptions.groupBy(function (description) {
    return description.filterFamily;
  }).sort(function (a, b) {
    if (a.first().filterFamily === baseFilterFamily) {
      return -1;
    } else if (b.first().filterFamily === baseFilterFamily) {
      return 1;
    }

    return 0;
  });
});

var FilterEditorOperatorDescriptionList = function FilterEditorOperatorDescriptionList(props) {
  var DescriptionListComponent = props.DescriptionListComponent,
      baseFilterFamily = props.baseFilterFamily,
      className = props.className,
      style = props.style,
      value = props.value,
      rest = _objectWithoutProperties(props, ["DescriptionListComponent", "baseFilterFamily", "className", "style", "value"]);

  var dataAttributes = Object.keys(rest).filter(function (key) {
    return key.startsWith('data-');
  }).reduce(function (acc, key) {
    acc[key] = rest[key];
    return acc;
  }, {});
  var operatorDescriptions = useMemo(function () {
    return FilterQueryFormat.getFilterDescription(value, baseFilterFamily);
  }, [baseFilterFamily, value]);
  var filterFamilyGroups = groupFilterFamilies(baseFilterFamily, operatorDescriptions);
  var listComponentProps = DescriptionListComponent === UIList ? {} : {
    descriptions: operatorDescriptions
  };
  return /*#__PURE__*/_jsx("div", Object.assign({}, dataAttributes, {
    className: className,
    "data-selenium-test": "XOFilterEditor-operator-descriptionList",
    style: style,
    children: /*#__PURE__*/_jsx(DescriptionListComponent, Object.assign({}, listComponentProps, {
      children: filterFamilyGroups.reduce(function (acc, descriptions, filterFamily) {
        var descriptionGroup = /*#__PURE__*/_jsx(FilterEditorOperatorDescriptionGroup, Object.assign({
          baseFilterFamily: baseFilterFamily,
          descriptions: descriptions,
          filterFamily: filterFamily
        }, rest), filterFamily);

        acc.push(descriptionGroup);
        return acc;
      }, [])
    }))
  }));
};

FilterEditorOperatorDescriptionList.propTypes = {
  DescriptionListComponent: PropTypes.elementType.isRequired,
  baseFilterFamily: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  value: FilterType.isRequired
};
export default /*#__PURE__*/memo(FilterEditorOperatorDescriptionList);