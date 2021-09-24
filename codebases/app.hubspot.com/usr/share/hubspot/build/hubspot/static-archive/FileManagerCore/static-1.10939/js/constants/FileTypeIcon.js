'use es6';

import Immutable from 'immutable';
import Document from '../components/icons/Document';
import PDF from '../components/icons/PDF';
import Video from '../components/icons/Video';
import Image from '../components/icons/Image';
export var WordExtensions = Immutable.Set(['doc', 'docx']);
export var ExcelExtensions = Immutable.Set(['xls', 'xlsx', 'csv']);
export var UIComponentIcons = [Document, Image, PDF, Video];
export var ICON_SHIRT_SIZES = {
  xxs: 16,
  xs: 24,
  sm: 48,
  md: 64,
  lg: 72,
  xl: 96,
  xxl: 128,
  small: 16,
  medium: 32,
  large: 48
};