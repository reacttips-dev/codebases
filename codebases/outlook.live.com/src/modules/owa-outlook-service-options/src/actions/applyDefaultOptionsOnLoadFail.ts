import { action } from 'satcheljs';
import getDefaultOptions, { DefaultOptionsType } from '../data/defaultOptions';

export const applyDefaultOptionsOnLoadFail = action(
    'APPLY_DEFAULT_OPTIONS_ON_LOAD_FAIL',
    (defaultOptions: DefaultOptionsType = getDefaultOptions()) => ({ defaultOptions })
);
