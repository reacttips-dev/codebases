'use es6';

var toOption = function toOption(reference) {
  if (!reference) {
    return reference;
  }

  var id = reference.id,
      label = reference.label,
      description = reference.description,
      icon = reference.icon,
      disabled = reference.disabled,
      archived = reference.archived;
  var option = {
    text: label || id,
    value: id
  };

  if (description) {
    option.help = description;
  }

  if (icon) {
    option.imageUrl = icon.src;
  }

  if (disabled) {
    option.disabled = !!disabled;
  }

  if (archived !== undefined) {
    option.archived = !!archived;
  }

  return option;
};

export var toOptions = function toOptions(references) {
  return references.map(toOption);
};
export var Reference = function Reference(_ref) {
  var id = _ref.id,
      label = _ref.label,
      description = _ref.description,
      icon = _ref.icon,
      disabled = _ref.disabled,
      archived = _ref.archived,
      additionalProperties = _ref.additionalProperties;
  return {
    id: id,
    label: label,
    description: description,
    icon: icon,
    disabled: disabled,
    archived: archived,
    additionalProperties: additionalProperties
  };
};