import React from 'react';
import Pill from 'bundles/preview/components/pills/Pill';

import 'css!bundles/preview/components/pills/__styles__/PillPrivate';

import _t from 'i18n!nls/preview';

const PillPrivate = () => <Pill className="rc-PillPrivate" color="#e65732" label={_t('Private')} />;

export default PillPrivate;
