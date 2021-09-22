import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const mapDispatchToProps = (dispatch) => {
	return {
		track: (trackAction, trackArgs) => {
			dispatch(trackAction(...trackArgs));
		},
	};
};

export default (trackAction) => (Component) => {
	const trackingComponent = (props) => {
		return (
			<div onClick={() => {
				props.track(trackAction, props.trackArgs);
			}}>
				<Component {...props}/>
			</div>
		);
	};

	trackingComponent.propTypes = {
		statistics: PropTypes.object,
		track: PropTypes.func.isRequired,
		trackArgs: PropTypes.array,
	};

	return connect(null, mapDispatchToProps)(trackingComponent);
};