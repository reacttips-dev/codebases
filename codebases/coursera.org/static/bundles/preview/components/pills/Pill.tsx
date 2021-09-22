import React from 'react';
import classNames from 'classnames';
import { Pill as CourseraUiPill } from '@coursera/coursera-ui';

import 'css!bundles/preview/components/pills/__styles__/Pill';

type Props = {
  label: string;
  color: string;
  className?: string;
};

const Pill = ({ label, color, className }: Props) => (
  <span className={classNames('rc-Pill', className)}>
    <CourseraUiPill size="md" type="outline" borderColor={color} label={label} />
  </span>
);

export default Pill;
