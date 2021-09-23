'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { List } from 'immutable';
import { SequenceSearchFilter } from 'SequencesUI/records/SequenceSearchQuery';
import getDefaultUserOptions from 'SequencesUI/lib/hubspot-user-options/getDefaultUserOptions';
import searchUserOptions from 'SequencesUI/lib/hubspot-user-options/searchUserOptions';
import getUniqueOptions from 'SequencesUI/lib/hubspot-user-options/getUniqueOptions';
import FilterWithClearButton from './FilterWithClearButton';
import UISelect from 'UIComponents/input/UISelect';
import UserContainer from '../../data/UserContainer';
import EnrolledByAll from 'SequencesUI/constants/EnrolledByAll';

var idsToFilter = function idsToFilter(ids) {
  return new SequenceSearchFilter({
    property: 'hs_enrolled_by',
    values: _toConsumableArray(ids)
  });
};

var getEnrolledByValueFromQueryParam = function getEnrolledByValueFromQueryParam(enrolledByParam) {
  if (!enrolledByParam) {
    return [UserContainer.get().user_id.toString()];
  } else if (enrolledByParam === EnrolledByAll) {
    return null;
  }

  return Array.isArray(enrolledByParam) ? enrolledByParam : [enrolledByParam];
};

var EnrolledByFilterV2 = function EnrolledByFilterV2(_ref) {
  var onChange = _ref.onChange,
      location = _ref.location,
      router = _ref.router,
      filterGroups = _ref.filterGroups,
      placement = _ref.placement;

  var _useState = useState(getEnrolledByValueFromQueryParam(location.query.enrolledBy) || []),
      _useState2 = _slicedToArray(_useState, 2),
      values = _useState2[0],
      setValues = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      enrolledByIsReady = _useState4[0],
      setEnrolledByIsReady = _useState4[1];

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      fetchedOptions = _useState6[0],
      setFetchedOptions = _useState6[1];

  useEffect(function () {
    if (values.length && !enrolledByIsReady) {
      getDefaultUserOptions(values, true).then(function (options) {
        setFetchedOptions(options);
        setEnrolledByIsReady(true);
      });
    } else {
      setEnrolledByIsReady(true);
    }
  }, [values, enrolledByIsReady]);
  var handleChange = useCallback(function (value) {
    router.push(Object.assign({}, location, {
      query: Object.assign({}, location.query, {
        enrolledBy: value.length ? value : EnrolledByAll
      })
    }));
    var updatedFilterGroups = filterGroups.map(function (filterGroup) {
      return filterGroup.update('filters', function (filters) {
        var otherFilters = filters.filterNot(function (filter) {
          return filter.property === 'hs_enrolled_by';
        });

        if (!value.length) {
          return otherFilters;
        }

        return otherFilters.push(idsToFilter(value));
      });
    });
    setValues(value);
    onChange(updatedFilterGroups);
  }, [filterGroups, location, onChange, router]);

  var handleLoadOptions = function handleLoadOptions(input, callback) {
    var pagination = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      offset: null
    };
    return searchUserOptions({
      searchQuery: input || '',
      offset: pagination.offset
    }).then(function (results) {
      var newOptions = getUniqueOptions(fetchedOptions.concat(results.options));
      setFetchedOptions(newOptions);
      callback(null, {
        options: newOptions,
        pagination: results.pagination
      });
    });
  };

  var renderButtonContent = function renderButtonContent() {
    var label = I18n.text('sequencesui.analyze.filters.enrolledBy.label');
    return /*#__PURE__*/_jsx("div", {
      children: values.length > 0 ? I18n.text('sequencesui.analyze.filters.activeDisplayWithCount', {
        label: label,
        value: values.length
      }) : label
    });
  };

  return /*#__PURE__*/_jsx(FilterWithClearButton, {
    isActive: values.length > 0,
    onRemoveClick: function onRemoveClick() {
      handleChange([]);
    },
    children: enrolledByIsReady ? /*#__PURE__*/_jsx(UISelect, {
      className: "p-left-0",
      menuWidth: 400,
      buttonUse: "transparent",
      multi: true,
      anchorType: "button",
      placement: placement,
      onChange: function onChange(_ref2) {
        var value = _ref2.target.value;
        handleChange(value);
      },
      loadOptions: handleLoadOptions,
      options: fetchedOptions,
      value: values,
      _forcePlaceholder: true,
      ButtonContent: renderButtonContent
    }) : /*#__PURE__*/_jsx("span", {})
  });
};

EnrolledByFilterV2.propTypes = {
  filterGroups: PropTypes.instanceOf(List).isRequired,
  onChange: PropTypes.func.isRequired,
  location: PropTypes.object,
  placement: PropTypes.string,
  router: PropTypes.object
};
export default withRouter(EnrolledByFilterV2);