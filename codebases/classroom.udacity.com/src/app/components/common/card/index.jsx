import PropTypes from 'prop-types';
import styles from './index.scss';

// TODO: (dcwither) add zDepth http://www.material-ui.com/#/components/paper
@cssModule(styles, { errorWhenNotFound: false })
export default class Card extends React.Component {
  static displayName = 'common/card';

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    interactive: PropTypes.bool,
  };

  render() {
    const { children, className, interactive } = this.props;

    return (
      <div
        className={className}
        styleName={interactive ? 'card-interactive' : 'card'}
      >
        {children}
      </div>
    );
  }
}
