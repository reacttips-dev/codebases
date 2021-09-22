import React from 'react';
import classNames from 'classnames';
import 'css!bundles/author-common/components/__styles__/ValidationErrorText';

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const ValidationErrorText = (props: Props) => {
  const { children, className, style } = props;
  return (
    <div className={classNames('rc-ValidationErrorText', className)} style={style}>
      {children}
    </div>
  );
};

export default ValidationErrorText;
