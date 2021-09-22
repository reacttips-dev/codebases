import React from 'react';

import classNames from 'classnames';

import { SvgLoaderSignal } from '@coursera/coursera-ui/svg';

import 'css!./__styles__/CenteredLoadingSpinner';

const CenteredLoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={classNames(className, 'rc-CenteredLoadingSpinner', 'horizontal-box', 'align-items-absolute-center')}>
    <SvgLoaderSignal size={48} />
  </div>
);

export default CenteredLoadingSpinner;
