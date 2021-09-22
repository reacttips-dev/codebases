import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Icon } from '@pipedrive/convention-ui-react';
import {
	HEIGHT_OF_ALLDAY_ACTIVITY,
	SPACE_BETWEEN_ALLDAY_ACTIVITIES,
	ITEM_TYPE,
} from '../../../config/constants';
import DraggableItem from './draggable-item';
import { toggleAlldayCollapse } from '../actions/calendar';
import context from '../../../utils/context';
import classes from '../scss/_allday-item.scss';

class AlldayItem extends Component {
	shouldComponentUpdate(nextProps) {
		const keysToComapre = ['checkboxState', 'daysNumber'];

		if (
			!nextProps.item.equals(this.props.item) ||
			keysToComapre.find((key) => this.props[key] !== nextProps[key])
		) {
			return true;
		}

		return false;
	}

	onClick(event) {
		const { item, toggleAlldayCollapse, calendarApi } = this.props;
		const itemType = item.get('type');

		if (itemType === ITEM_TYPE.COLLAPSIBLE) {
			return toggleAlldayCollapse();
		}

		return calendarApi.onItemClick({ event, item });
	}

	getClassName() {
		const { item } = this.props;
		const color = this.props.calendarApi.getColor(item);
		const customClassName = this.props.calendarApi.getCustomClassName(item);
		const classNames = [classes.alldayItem, classes[`color--${color}`]];

		if (customClassName) {
			classNames.push(customClassName);
		}

		if (item.get('ignoreIntersection')) {
			classNames.push(classes.ignoreIntersection);
		}

		if (item.get('type') === ITEM_TYPE.COLLAPSIBLE) {
			classNames.push(classes.collapsible);
		}

		if (item.get('isHidden')) {
			classNames.push(classes.hide);
		}

		return classNames.join(' ');
	}

	renderCollapsibleArrow() {
		if (ITEM_TYPE.COLLAPSIBLE !== this.props.item.get('type')) {
			return null;
		}

		if (this.props.item.getIn(['data', 'isCollapsed'])) {
			return <Icon className={classes.icon} icon="arrow-down" size="s" />;
		}

		return <Icon className={classes.icon} icon="arrow-up" size="s" />;
	}

	renderItem() {
		const { item, daysNumber, calendarApi, forwardRef } = this.props;

		const top = item.getIn(['position', 'top']);
		const left = item.getIn(['position', 'left']);
		const width = item.getIn(['position', 'width']);
		const activityHeight =
			HEIGHT_OF_ALLDAY_ACTIVITY + (top > 0 ? SPACE_BETWEEN_ALLDAY_ACTIVITIES : 0);
		const activityStyles = {
			top: `${activityHeight * top}px`,
			left: `calc(100% / ${daysNumber} * ${left})`,
			width: `calc(100% / ${daysNumber} * ${width})`,
		};

		let subject = calendarApi.renderSubject(item);

		if (ITEM_TYPE.COLLAPSIBLE === item.get('type')) {
			subject = item.getIn(['data', 'collapsible_label']);
		}

		return (
			<div
				className={this.getClassName()}
				style={activityStyles}
				ref={forwardRef}
				data-test="allday-item"
			>
				<div
					className={AlldayItem.getContentClassName(item)}
					onClick={this.onClick.bind(this)}
				>
					<div className={classes.asideLeft}>{calendarApi.renderLeftAside(item)}</div>
					<div className={classes.subject}>{subject}</div>
					{this.renderCollapsibleArrow()}
					<span className={classes.asideRight}>{calendarApi.renderRightAside(item)}</span>
				</div>
			</div>
		);
	}

	render() {
		const { item, calendarApi } = this.props;

		let result = this.renderItem();

		const popover = calendarApi.renderItem(item, { children: result });

		if (popover) {
			result = popover;
		}

		if (calendarApi.isDraggable(item)) {
			result = <DraggableItem item={item}>{result}</DraggableItem>;
		}

		return result;
	}
}

AlldayItem.getContentClassName = (activityPosition) => {
	const isPreviousWeekActivity = activityPosition.get('isPreviousWeekActivity');
	const isNextWeekActivity = activityPosition.get('isNextWeekActivity');

	const classNames = [classes.content];

	if (isPreviousWeekActivity) {
		classNames.push(classes.previousWeek);
	}

	if (isNextWeekActivity) {
		classNames.push(classes.nextWeek);
	}

	return classNames.join(' ');
};

AlldayItem.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	item: ImmutablePropTypes.map.isRequired,
	daysNumber: PropTypes.number.isRequired,
	toggleAlldayCollapse: PropTypes.func.isRequired,
	forwardRef: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
	toggleAlldayCollapse: (item) => dispatch(toggleAlldayCollapse(item)),
});

export default connect(null, mapDispatchToProps)(context(AlldayItem));
