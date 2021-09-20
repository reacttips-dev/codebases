import PropTypes from 'prop-types';
import styles from './index.scss';

@cssModule(styles, { errorWhenNotFound: false })
export default class Responsive extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.oneOf([
      'until-tablet',
      'until-desktop',
      'from-tablet',
      'from-desktop',
    ]).isRequired,
  };

  static defaultProps = {
    block: false,
    className: null,
  };

  render() {
    const { block, children, className, type } = this.props;

    const Component = block ? 'div' : 'span';
    return (
      <Component styleName={type} className={className}>
        {children}
      </Component>
    );
  }
}
