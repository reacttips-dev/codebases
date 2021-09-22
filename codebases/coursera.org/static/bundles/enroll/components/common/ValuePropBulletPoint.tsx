import React from 'react';
import classNames from 'classnames';
import Icon from 'bundles/iconfont/Icon';

type Props = {
  className?: string;
  children: React.ReactNode;
};

class ValuePropBulletPoint extends React.Component<Props> {
  render() {
    const { className, children } = this.props;
    const bulletClassName = classNames('rc-ValuePropBulletPoint horizontal-box', className);
    return (
      <div className={bulletClassName}>
        <div className="flex-1 checkmark-cont">
          <Icon name="checkmark" className="color-primary" />
        </div>
        <div className="flex-11">{children}</div>
      </div>
    );
  }
}
export default ValuePropBulletPoint;
