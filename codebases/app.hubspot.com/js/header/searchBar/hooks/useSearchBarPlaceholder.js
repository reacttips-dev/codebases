'use es6';

import I18n from 'I18n';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';

var getTextForObjectType = function getTextForObjectType(objectTypeId) {
  switch (objectTypeId) {
    case '0-1':
      //contact
      return I18n.text('index.searchBar.placeholders.contact');

    case '0-2':
      //company
      return I18n.text('index.searchBar.placeholders.company');

    case '0-3':
      //deal
      return I18n.text('index.searchBar.placeholders.deal');

    case '0-5':
      //tickets
      return I18n.text('index.searchBar.placeholders.tickets');

    case '0-48':
      //calls
      return I18n.text('index.searchBar.placeholders.calls');

    default:
      return I18n.text('index.searchBar.placeholders.default');
  }
};

export var useSearchBarPlaceholder = function useSearchBarPlaceholder() {
  var currentObjectTypeDef = useSelectedObjectTypeDef();
  return getTextForObjectType(currentObjectTypeDef.objectTypeId);
};