import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import 'css!bundles/ui/components/__styles__/CalloutBox';

class CalloutBox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.node,
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'className' does not exist on type 'Reado... Remove this comment to see the full error message
    const { className, label, children } = this.props;

    return (
      <div className={classNames('rc-CalloutBox card-no-action selected', className)}>
        {label && <h3 className="callout-box-label label-text">{label}</h3>}
        <div>{children}</div>
      </div>
    );
  }
}

export default CalloutBox;
