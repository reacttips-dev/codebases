import { AUTOCOMPLETE_CLEAR, AUTOCOMPLETE_UNREGISTER, AUTOCOMPLETE_UPDATE } from 'constants/reduxActions';

export function clearAutoComplete(id) {
  return {
    type: AUTOCOMPLETE_CLEAR,
    id
  };
}

export function unRegisterAutoComplete(id) {
  return {
    type: AUTOCOMPLETE_UNREGISTER,
    id
  };
}

export function updateAutoComplete(id, text, data) {
  return {
    type: AUTOCOMPLETE_UPDATE,
    id,
    text,
    data
  };
}
