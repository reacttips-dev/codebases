import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ResizeHandle from '../resize-handle';
import classes from '../../scss/_grid-item.scss';

const GridItemResizeHandle = ({ item, date, gridEl, calendarApi }) => {
	const isEndDateOnTheSameDay = moment(item.get('endDateTime')).isSame(date, 'day');
	const isResizable = isEndDateOnTheSameDay && calendarApi.isResizable(item);

	return (
		isResizable && (
			<div className={classes.resizeHandle}>
				<ResizeHandle item={item} containerRef={gridEl} />
			</div>
		)
	);
};

GridItemResizeHandle.propTypes = {
	item: PropTypes.object,
	date: PropTypes.string,
	gridEl: PropTypes.object,
	calendarApi: PropTypes.object,
};

export default GridItemResizeHandle;
