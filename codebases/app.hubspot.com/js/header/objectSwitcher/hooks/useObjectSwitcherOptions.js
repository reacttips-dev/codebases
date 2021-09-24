'use es6';

import { useCallback } from 'react';
import { useAvailableObjectTypes } from '../../../crmObjects/hooks/useAvailableObjectTypes';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { Seq } from 'immutable';
import localeComparator from 'I18n/utils/localeComparator';
import { getPluralForm } from '../../../crmObjects/methods/getPluralForm';
import links from 'crm-legacy-links/links';
import { useHistory } from 'react-router-dom';

var formatObjectTypeDefAsOption = function formatObjectTypeDefAsOption(objectTypeDef) {
  var objectTypeId = objectTypeDef.objectTypeId;
  var option = {
    objectTypeDef: objectTypeDef,
    value: links.indexFromObjectTypeId({
      objectTypeId: objectTypeId
    }),
    text: getPluralForm(objectTypeDef)
  };
  return option;
};

export var useObjectSwitcherOptions = function useObjectSwitcherOptions() {
  var allObjectTypeDefs = useAvailableObjectTypes();
  var currentObjectTypeDef = useSelectedObjectTypeDef();
  var history = useHistory();
  var options = Seq(allObjectTypeDefs).map(formatObjectTypeDefAsOption).sort(function (a, b) {
    return localeComparator(a.text, b.text);
  }).toArray();
  var currentOption = options.find(function (_ref) {
    var objectTypeDef = _ref.objectTypeDef;
    return objectTypeDef === currentObjectTypeDef;
  });
  var selectOption = useCallback(function (option) {
    history.push(option.value);
  }, [history]);
  return {
    currentOption: currentOption,
    options: options,
    selectOption: selectOption
  };
};