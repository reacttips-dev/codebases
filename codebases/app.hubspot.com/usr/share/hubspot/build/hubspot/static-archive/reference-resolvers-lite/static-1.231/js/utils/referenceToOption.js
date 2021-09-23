'use es6';

export var referenceToOption = function referenceToOption(reference) {
  return {
    disabled: reference.disabled,
    help: reference.description,
    text: reference.label,
    value: reference.id
  };
};