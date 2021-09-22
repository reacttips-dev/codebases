import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { durationLabel } from '../../utils/formatters';
import { ONE_HOUR, TWO_ITEMS, THREE_ITEMS, FOUR_ITEMS } from './constants';
import classes from '../../scss/_grid-item.scss';

const GridItemDuration = ({ item }) => {
	const width = item.get('width');
	const duration = moment.duration(item.get('duration')).asHours();

	const hideEndTime = (width <= TWO_ITEMS && duration <= ONE_HOUR) || width <= FOUR_ITEMS;
	const startDateTime = item.get('startDateTime');
	const endDateTime = hideEndTime ? null : item.get('endDateTime');
	const classNames = [classes.duration, duration <= ONE_HOUR ? classes.durationNoWrap : ''];

	return (
		<div className={classNames.join(' ')}>
			{durationLabel({ startDateTime, endDateTime }).map((durationTime) => (
				<div className={classes.durationTime} key={durationTime}>
					{width < THREE_ITEMS ? durationTime.replace(/ AM| PM/g, '') : durationTime}
				</div>
			))}
		</div>
	);
};

GridItemDuration.propTypes = {
	item: PropTypes.object,
};

export default GridItemDuration;
