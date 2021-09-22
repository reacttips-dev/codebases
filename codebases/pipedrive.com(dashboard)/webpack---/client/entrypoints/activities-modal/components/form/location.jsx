import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Address } from '@pipedrive/form-fields';
import { updateMultipleFields } from '../../store/actions/form';
import modalContext from '../../../../utils/context';

const getGeoCodedLocation = (location) =>
	!!location && typeof location !== 'string' && location.geocoded ? location.geocoded[0] : null;

const Location = ({ updateLocation, translator, location, autoFocus, handleBlur }) => {
	return (
		<Address
			value={location}
			inputProps={{
				autoFocus,
				'data-test': 'address-field-input',
				onBlur: () => handleBlur && handleBlur(),
				placeholder: translator.gettext('Location'),
			}}
			onComponentChange={(value) => updateLocation(value)}
			allowClear
		/>
	);
};

Location.propTypes = {
	location: PropTypes.string,
	updateLocation: PropTypes.func,
	autoFocus: PropTypes.bool,
	translator: PropTypes.object.isRequired,
	handleBlur: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
	updateLocation: (location) =>
		dispatch(
			updateMultipleFields({
				location,
				locationGeocoded: getGeoCodedLocation(location),
			}),
		),
});

const mapStateToProps = (state) => {
	return {
		location: state.getIn(['form', 'location']),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(Location));
