import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';

import context from '../../../../utils/context';
import { ONE_HOUR, FOUR_ITEMS } from './constants';
import GridItemDuration from './grid-item-duration';
import GridItemResizeHandle from './grid-item-resize-handle';
import GridItemSubject from './grid-item-subject';
import classes from '../../scss/_grid-item.scss';

const GridItemContent = ({ calendarApi, item, date, gridEl, forwardRef }) => {
	const width = item.getIn(['position', 'width']);
	const duration = moment.duration(item.get('duration')).asHours();

	const getStyles = () => {
		return {
			top: `${item.getIn(['position', 'top'])}px`,
			height: `${item.getIn(['position', 'height']) - 1}px`,
			width: `${width}%`,
			left: `${item.getIn(['position', 'left'])}%`,
		};
	};

	const getClassName = () => {
		const color = calendarApi.getColor(item);
		const customClassName = calendarApi.getCustomClassName(item);
		const classNames = [classes.gridItem, classes[`color--${color}`]];

		if (customClassName) {
			classNames.push(customClassName);
		}

		if (item.get('ignoreIntersection')) {
			classNames.push(classes.ignoreIntersection);
		}

		if (item.get('isHidden')) {
			classNames.push(classes.hide);
		}

		return classNames.join(' ');
	};

	const onClick = (event) => {
		return calendarApi.onItemClick({ event, item });
	};

	const containerClassNames = [
		classes.container,
		width <= FOUR_ITEMS ? classes.containerShrink : '',
	];
	const durationContainerClassNames = [
		classes.durationContainer,
		duration < ONE_HOUR ? classes.durationContainerShrink : '',
	];

	const subject = calendarApi.renderSubject(item);
	const leftAside = calendarApi.renderLeftAside(item, { date });
	const showDurationBelow = subject || width <= FOUR_ITEMS;

	return (
		<div
			data-test="grid-item"
			className={getClassName()}
			style={getStyles()}
			onClick={onClick}
			ref={forwardRef}
		>
			<div className={containerClassNames.join(' ')}>
				<div className={classes.subjectContainer}>
					<div className={classes.asideLeft}>{leftAside}</div>

					<div className={classes.asideRight}>
						{calendarApi.renderRightAside(item, { date })}
					</div>

					<GridItemSubject subject={subject} item={item} hasActivityType={!!leftAside} />
				</div>

				{showDurationBelow ? (
					<div className={durationContainerClassNames.join(' ')}>
						<GridItemDuration item={item} />
					</div>
				) : null}
			</div>

			<GridItemResizeHandle
				item={item}
				date={date}
				gridEl={gridEl}
				calendarApi={calendarApi}
			/>
		</div>
	);
};

GridItemContent.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	item: ImmutablePropTypes.map.isRequired,
	date: PropTypes.string.isRequired,
	forwardRef: PropTypes.func,
	gridEl: PropTypes.object,
};

export default context(GridItemContent);
