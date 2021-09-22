import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'actions/fullscreen';
import FullscreenComponent from 'components/fullscreen';

export class Fullscreen extends Component {
	render() {
		return (
			<FullscreenComponent content={this.props.content} close={this.props.close}/>
		);
	}
}

Fullscreen.propTypes = {
	content: PropTypes.any,
	close: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => {
	return {
		content: state.fullscreen.content,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		close: () => {
			dispatch(actions.close());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Fullscreen);
