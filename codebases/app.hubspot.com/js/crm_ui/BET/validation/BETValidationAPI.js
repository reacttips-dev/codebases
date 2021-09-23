'use es6';

import { post } from 'crm_data/api/ImmutableAPI';
export function fetch(properties) {
  return post('bizops-field-validation/v1/validate', properties);
}