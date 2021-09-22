import { Component } from 'react';
import PropTypes from 'prop-types';

class WithHotReload extends Component {
	constructor(props) {
		super(props);

		if (module.hot) {
			module.hot.accept('./Search', () => this.forceUpdate());
		}
	}

	render() {
		return this.props.children;
	}
}

WithHotReload.propTypes = {
	children: PropTypes.node.isRequired,
};

export default WithHotReload;
