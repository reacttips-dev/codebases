import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { HEIGHT_OF_HOUR } from '../../../../config/constants';
import { ONE_HOUR, TWO_HOURS, TWO_ITEMS, THREE_ITEMS, FOUR_ITEMS } from './constants';
import TextTruncate from '../text-truncate';
import GridItemDuration from './grid-item-duration';
import classes from '../../scss/_grid-item.scss';

const GridItemSubject = ({ subject, item, hasActivityType }) => {
	const width = item.getIn(['position', 'width']);
	const duration = moment.duration(item.get('duration')).asHours();

	const getSubjectWrapperClasses = () => {
		const subjectWrapperClasses = [classes.subject];

		if ((width < THREE_ITEMS && duration < TWO_HOURS) || width <= FOUR_ITEMS) {
			subjectWrapperClasses.push(classes.subjectHidden);
		}

		if (item.getIn(['data', 'icon_key'])) {
			subjectWrapperClasses.push(classes.subjectWithLeftAside);
		}

		return subjectWrapperClasses;
	};

	const getSubjectLineCount = () => {
		const height = item.getIn(['position', 'height']);

		// for slots with many items but long duration show 2-line due time
		const dueTimeHeight =
			duration > ONE_HOUR && width <= TWO_ITEMS ? HEIGHT_OF_HOUR : HEIGHT_OF_HOUR / 2;
		const availableHeight = height - dueTimeHeight;

		if (availableHeight < HEIGHT_OF_HOUR / 2) {
			return 1;
		}

		return Math.round(availableHeight / (HEIGHT_OF_HOUR / 2));
	};

	const subjectWrapperClasses = getSubjectWrapperClasses();
	const subjectClasses = [
		classes.subjectInner,
		hasActivityType ? classes.subjectInnerWithLeftAside : '',
	];

	const subjectLines = getSubjectLineCount();
	const textTruncateBeforeSpacing = hasActivityType ? 20 : 0;

	return (
		<div className={subjectWrapperClasses.join(' ')}>
			<div className={subjectClasses.join(' ')}>
				{subject ? (
					<TextTruncate
						text={`${subject}`}
						lines={subjectLines}
						beforeSpacing={textTruncateBeforeSpacing}
						slotWidth={width}
					/>
				) : (
					<GridItemDuration item={item} />
				)}
			</div>
		</div>
	);
};

GridItemSubject.propTypes = {
	subject: PropTypes.string,
	item: PropTypes.object,
	hasActivityType: PropTypes.bool,
};

export default GridItemSubject;
