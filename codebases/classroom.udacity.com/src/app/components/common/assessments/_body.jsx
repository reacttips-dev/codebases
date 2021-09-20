import PropTypes from 'prop-types';
//ureact-app-shell requires this component layer in order to avoid unnecessary re-rendering
export default class Body extends React.Component {
  static propTypes = {
    content: PropTypes.node.isRequired,
  };

  render() {
    return <div>{this.props.content}</div>;
  }
}
