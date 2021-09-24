'use es6';

import { getIconNamePropType } from '../utils/propTypes/iconName';
import PropTypes from 'prop-types';
export var SingleValueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]);
export var ValueType = PropTypes.oneOfType([SingleValueType, PropTypes.arrayOf(SingleValueType)]);
export var OptionType = PropTypes.shape({
  avatar: PropTypes.node,
  badge: PropTypes.object,
  buttonText: PropTypes.node,
  disabled: PropTypes.bool,
  dropdownClassName: PropTypes.string,
  dropdownText: PropTypes.node,
  icon: getIconNamePropType(),
  iconColor: PropTypes.string,
  help: PropTypes.node,
  imageUrl: PropTypes.string,
  loading: PropTypes.bool,
  tag: PropTypes.object,
  tagUse: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string,
  value: SingleValueType
});
export var OptionGroupType = PropTypes.shape({
  dropdownClassName: PropTypes.string,
  dropdownText: PropTypes.node,
  emptyMessage: PropTypes.string,
  options: PropTypes.arrayOf(OptionType.isRequired).isRequired,
  text: PropTypes.string,
  title: PropTypes.string
});
export var OptionOrGroupType = PropTypes.oneOfType([OptionGroupType, OptionType]);