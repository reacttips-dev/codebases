import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { snakeCase } from 'lodash';

import activityCardContext from '../../../utils/context';

const GeocodedLocation = styled.a`
	color: inherit;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const Location = ({ activity, location, webappApi }) => {
	const openMap = (e) => {
		e.preventDefault();

		const activityObject = activity.toJS();
		const activityData = Object.keys(activityObject).reduce((data, key) => {
			data[snakeCase(key)] = activityObject[key];

			return data;
		}, {});
		const activityField = {
			item_type: 'activity',
			key: 'location',
			name: 'Location',
		};

		webappApi.router.go(null, '#dialog/map', false, false, {
			type: 'activity',
			field: activityField,
			model: webappApi.modelCollectionFactory.getModel('activity', activityData),
			userSettings: webappApi.userSelf.settings,
		});
	};

	const isGeoCoded = activity.get('locationLat');

	return isGeoCoded ? (
		<GeocodedLocation href="#" onClick={openMap}>
			{location}
		</GeocodedLocation>
	) : (
		location
	);
};

Location.propTypes = {
	activity: ImmutablePropTypes.map.isRequired,
	location: PropTypes.string.isRequired,
	webappApi: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	activity: state.get('activity'),
});

export default connect(mapStateToProps)(activityCardContext(Location));
