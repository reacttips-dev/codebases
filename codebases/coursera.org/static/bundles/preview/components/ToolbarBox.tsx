import React from 'react';
import classNames from 'classnames';
import 'css!bundles/preview/components/__styles__/ToolbarBox';

type Props = {
  className: string;
};

const ToolbarBox: React.SFC<Props> = ({ className, children }) => (
  <div className={classNames('rc-ToolbarBox', className)}>{children}</div>
);

export default ToolbarBox;
