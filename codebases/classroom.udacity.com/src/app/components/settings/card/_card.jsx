import PropTypes from 'prop-types';
import styles from './_card.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/card';

    static propTypes = {
      children: PropTypes.node,
      faded: PropTypes.bool,
      title: PropTypes.node,
      onVersionUpdate: PropTypes.func,
    };

    static defaultProps = {
      faded: false,
      onVersionUpdate: _.noop,
    };

    state = {
      activeLink: null,
    };

    _renderTitle = () => {
      const { title, faded } = this.props;
      if (title) {
        return <h5 styleName={faded ? 'header-faded' : 'header'}>{title}</h5>;
      }
    };

    render() {
      return (
        <div styleName="card">
          {this._renderTitle()}
          {this.props.children}
        </div>
      );
    }
  },
  styles
);
