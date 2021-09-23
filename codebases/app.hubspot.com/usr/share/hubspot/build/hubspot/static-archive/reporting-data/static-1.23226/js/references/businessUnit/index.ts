import I18n from 'I18n';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
export var generateBusinessUnitLabel = function generateBusinessUnitLabel(businessUnit, id) {
  return id === DEFAULT_NULL_VALUES.ENUMERATION ? I18n.text('reporting-data.missing.unassigned') : businessUnit.get('label');
};