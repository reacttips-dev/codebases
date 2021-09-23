'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { DEFAULT, getGroupOptions, getGroupAsOption, getTypeOptions, getGroupIdFromType, getTypeById } from '../utils/subscriptionSelectUtils';
import emptyFunction from 'react-utils/emptyFunction';
import withFetchedSubscriptionGroups from '../hoc/withFetchedSubscriptionGroups';
import { defaultRenderTypeSelect, defaultRenderGroupSelect } from './subscriptionTypeDefaultControls';

var SubscriptionSelect = function SubscriptionSelect(props) {
  var value = props.value,
      onChange = props.onChange,
      defaultTypesText = props.defaultTypesText,
      isLoading = props.isLoading,
      _props$formControlsPr = props.formControlsProps,
      formControlsProps = _props$formControlsPr === void 0 ? {} : _props$formControlsPr,
      _props$groupFormContr = props.groupFormControlsProps,
      groupFormControlsProps = _props$groupFormContr === void 0 ? {} : _props$groupFormContr,
      _props$groupSelectPro = props.groupSelectProps,
      groupSelectProps = _props$groupSelectPro === void 0 ? {} : _props$groupSelectPro,
      _props$renderTypeSele = props.renderTypeSelect,
      renderTypeSelect = _props$renderTypeSele === void 0 ? defaultRenderTypeSelect : _props$renderTypeSele,
      _props$renderGroupSel = props.renderGroupSelect,
      renderGroupSelect = _props$renderGroupSel === void 0 ? defaultRenderGroupSelect : _props$renderGroupSel,
      _props$hideIds = props.hideIds,
      hideIds = _props$hideIds === void 0 ? [] : _props$hideIds,
      _props$userAccessible = props.userAccessibleGroups,
      userAccessibleGroups = _props$userAccessible === void 0 ? [] : _props$userAccessible,
      _props$onGroupChange = props.onGroupChange,
      onGroupChangeProp = _props$onGroupChange === void 0 ? emptyFunction : _props$onGroupChange,
      _props$groups = props.groups,
      groups = _props$groups === void 0 ? [] : _props$groups,
      _props$required = props.required,
      required = _props$required === void 0 ? false : _props$required,
      _props$canBeEmpty = props.canBeEmpty,
      canBeEmpty = _props$canBeEmpty === void 0 ? false : _props$canBeEmpty,
      _props$disableNonMark = props.disableNonMarketingTypes,
      disableNonMarketingTypes = _props$disableNonMark === void 0 ? false : _props$disableNonMark,
      _props$withUserAccess = props.withUserAccessibleGroups,
      withUserAccessibleGroups = _props$withUserAccess === void 0 ? true : _props$withUserAccess,
      _props$useGDPRFormatt = props.useGDPRFormattedTypes,
      useGDPRFormattedTypes = _props$useGDPRFormatt === void 0 ? true : _props$useGDPRFormatt,
      _props$includeInterna = props.includeInternal,
      includeInternal = _props$includeInterna === void 0 ? true : _props$includeInterna,
      otherProps = _objectWithoutProperties(props, ["value", "onChange", "defaultTypesText", "isLoading", "formControlsProps", "groupFormControlsProps", "groupSelectProps", "renderTypeSelect", "renderGroupSelect", "hideIds", "userAccessibleGroups", "onGroupChange", "groups", "required", "canBeEmpty", "disableNonMarketingTypes", "withUserAccessibleGroups", "useGDPRFormattedTypes", "includeInternal"]);

  var initialValueRef = useRef(value);

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      groupId = _useState2[0],
      setGroupId = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      showPlaceholder = _useState4[0],
      setShowPlaceholder = _useState4[1];

  var onGroupChange = useCallback(function (id) {
    onGroupChangeProp({
      target: {
        value: id === DEFAULT ? null : id
      }
    });
    setGroupId(id);
  }, [onGroupChangeProp]);
  useEffect(function () {
    // Try to initialize selected group from selected type
    if (initialValueRef.current && groups.length) {
      var typeGroupId = getGroupIdFromType(groups, initialValueRef.current);
      onGroupChange(typeGroupId);
    }
  }, [groups, initialValueRef, onGroupChange]);
  var groupOptions = useMemo(function () {
    return getGroupOptions(groups, withUserAccessibleGroups, userAccessibleGroups, defaultTypesText);
  }, [groups, withUserAccessibleGroups, userAccessibleGroups, defaultTypesText]);
  var groupOptionsIncludingCurrentValue = useMemo(function () {
    if (!groupId || groupId === DEFAULT || !withUserAccessibleGroups || userAccessibleGroups.includes(groupId)) {
      return groupOptions;
    }

    return [].concat(_toConsumableArray(groupOptions), [getGroupAsOption(groups.find(function (g) {
      return g.preferencesGroup.id === groupId;
    }))]);
  }, [groupOptions, withUserAccessibleGroups, userAccessibleGroups, groupId, groups]);
  var typeOptions = useMemo(function () {
    return getTypeOptions(groups, groupId, includeInternal, useGDPRFormattedTypes, hideIds, disableNonMarketingTypes);
  }, [groups, groupId, includeInternal, useGDPRFormattedTypes, disableNonMarketingTypes, hideIds]);

  var onSelectGroup = function onSelectGroup(e) {
    setShowPlaceholder(true);
    onGroupChange(e.target.value);

    if (canBeEmpty) {
      onChange(null);
    }
  };

  var onChangeTypeId = function onChangeTypeId(e) {
    setShowPlaceholder(false);
    var type = getTypeById(groups, e.target.value);

    if (type || canBeEmpty) {
      onChange(type || null);
    }
  };

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [renderGroupSelect(Object.assign({}, groupSelectProps, {
      isLoading: isLoading,
      options: !isLoading && groupOptionsIncludingCurrentValue,
      value: groupId,
      onChange: onSelectGroup
    }), Object.assign({
      required: required
    }, groupFormControlsProps)), groupId && renderTypeSelect(Object.assign({}, otherProps, {
      options: !isLoading && typeOptions,
      value: showPlaceholder ? null : value,
      onChange: onChangeTypeId
    }), Object.assign({
      required: required
    }, formControlsProps))]
  });
};

SubscriptionSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  renderTypeSelect: PropTypes.func.isRequired,
  renderGroupSelect: PropTypes.func.isRequired,
  onGroupChange: PropTypes.func,
  value: PropTypes.number,
  groups: PropTypes.array,
  withUserAccessibleGroups: PropTypes.bool,
  userAccessibleGroups: PropTypes.array,
  includeInternal: PropTypes.bool,
  useGDPRFormattedTypes: PropTypes.bool,
  defaultTypesText: PropTypes.string,
  required: PropTypes.bool,
  canBeEmpty: PropTypes.bool,
  disableNonMarketingTypes: PropTypes.bool,
  hideIds: PropTypes.array,
  isLoading: PropTypes.bool,
  formControlsProps: PropTypes.object,
  groupFormControlsProps: PropTypes.object,
  groupSelectProps: PropTypes.object
};
var SubscriptionTypeForm = withFetchedSubscriptionGroups(SubscriptionSelect);
SubscriptionTypeForm.SubscriptionSelect = SubscriptionSelect;
export default SubscriptionTypeForm;