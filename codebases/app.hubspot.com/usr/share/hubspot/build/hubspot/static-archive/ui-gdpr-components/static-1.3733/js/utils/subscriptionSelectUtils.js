'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export var DEFAULT = 'DEFAULT';
import I18n from 'I18n';
export var formatTypeOption = function formatTypeOption() {
  var process = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var name = arguments.length > 2 ? arguments[2] : undefined;

  if (process.length === 0 && operation.length === 0) {
    return name;
  }

  return process + " " + operation + " | " + name;
};
export var getGroupAsOption = function getGroupAsOption(_ref) {
  var _ref$preferencesGroup = _ref.preferencesGroup,
      name = _ref$preferencesGroup.name,
      id = _ref$preferencesGroup.id;
  return {
    text: name,
    value: id
  };
};
export var getGroupOptions = function getGroupOptions(groups, withUserAccessibleGroups, userAccessibleGroups, defaultTypesText) {
  return [{
    text: defaultTypesText || I18n.text('labels.defaultSubscriptionTypes'),
    value: DEFAULT
  }].concat(_toConsumableArray(groups.reduce(function (options, group) {
    if (!withUserAccessibleGroups || userAccessibleGroups.includes(group.preferencesGroup.id)) {
      return [].concat(_toConsumableArray(options), [getGroupAsOption(group)]);
    }

    return options;
  }, [])));
};
export var getFilteredTypeOptions = function getFilteredTypeOptions(group, filterDefault, includeInternal, useGDPRFormattedTypes) {
  var hideIds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var disableNonMarketingTypes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  return group.translatedSubscriptionDefinitions.reduce(function (options, _ref2) {
    var _ref2$subscriptionDef = _ref2.subscriptionDefinition,
        id = _ref2$subscriptionDef.id,
        name = _ref2$subscriptionDef.name,
        defaultSubscription = _ref2$subscriptionDef.defaultSubscription,
        process = _ref2$subscriptionDef.process,
        operation = _ref2$subscriptionDef.operation,
        internal = _ref2$subscriptionDef.internal;
    var typeIsDefault = !!defaultSubscription;
    var isHidden = hideIds.includes(id);
    var hasNonMarketingProcess = process && process !== 'Marketing';
    var disabled = disableNonMarketingTypes && (internal || hasNonMarketingProcess);

    if (!isHidden && typeIsDefault === filterDefault && (includeInternal || !internal)) {
      return [].concat(_toConsumableArray(options), [{
        text: useGDPRFormattedTypes ? formatTypeOption(process, operation, name) : name,
        disabled: disabled,
        value: id
      }]);
    }

    return options;
  }, []);
};
export var getTypeOptions = function getTypeOptions(groups, groupId, includeInternal, useGDPRFormattedTypes, hideIds, disableNonMarketingTypes) {
  if (groupId === DEFAULT && groups.length) {
    return getFilteredTypeOptions(groups[0], true, includeInternal, useGDPRFormattedTypes, hideIds, disableNonMarketingTypes);
  }

  var group = groups.find(function (_ref3) {
    var id = _ref3.preferencesGroup.id;
    return groupId === id;
  });
  return group ? getFilteredTypeOptions(group, false, includeInternal, useGDPRFormattedTypes, hideIds, disableNonMarketingTypes) : [];
};
export var getGroupIdFromType = function getGroupIdFromType(groups, typeId) {
  var defaultGroupId;
  var group = groups.find(function (g) {
    var type = g.translatedSubscriptionDefinitions.find(function (_ref4) {
      var id = _ref4.subscriptionDefinition.id;
      return id === typeId;
    });

    if (type && type.subscriptionDefinition.defaultSubscription) {
      defaultGroupId = DEFAULT;
    }

    return !!type;
  });

  if (defaultGroupId) {
    return defaultGroupId;
  }

  if (group) {
    return group.preferencesGroup.id;
  }

  return null;
};
export var getTypeById = function getTypeById(groups, typeId) {
  for (var i = 0; i < groups.length; i++) {
    var type = groups[i].translatedSubscriptionDefinitions.find(function (_ref5) {
      var id = _ref5.subscriptionDefinition.id;
      return id === typeId;
    });

    if (type) {
      return type.subscriptionDefinition;
    }
  }

  return null;
};