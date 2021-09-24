import enviro from 'enviro';
import { PRODUCTION_PQL_FORM_ATTRIBUTES, QA_PQL_FORM_ATTRIBUTES } from 'ui-addon-upgrades/_core/pql/formAttributes';
export var getPqlFormAttributes = function getPqlFormAttributes() {
  var isProd = enviro.getShort() === 'prod';

  if (!isProd) {
    return QA_PQL_FORM_ATTRIBUTES;
  }

  return PRODUCTION_PQL_FORM_ATTRIBUTES;
};