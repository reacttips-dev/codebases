import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { range } from 'lodash';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import {
	ITEM_TYPE,
	HEIGHT_OF_ALLDAY_ACTIVITY,
	ALLDAY_OFFSET,
	ITEM_CONTEXT,
	UTC_DATE_FORMAT,
	SPACE_BETWEEN_ALLDAY_ACTIVITIES,
} from '../../../config/constants';
import { toggleAlldayCollapse } from '../actions/calendar';
import { getAlldayItems, filterAlldayItems } from '../utils/allday-item';
import { calculateDateTimeFromCoordinates } from '../utils/grid';
import context from '../../../utils/context';
import AlldayItem from '../components/allday-item';
import classes from '../scss/_grid-allday.scss';

const ALLDAY_SCROLL_HEIGHT_EXTRA = 16;

class Allday extends Component {
	constructor(props) {
		super(props);

		this.alldayItems = filterAlldayItems(props.items);
		this.addNewItem = this.addNewItem.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		const keysToCompare = [
			'viewportHeight',
			'viewportWidth',
			'startDate',
			'endDate',
			'daysNumber',
			'isAlldayCollapsed',
			'visibleAlldayItems',
		];
		const alldayItems = filterAlldayItems(nextProps.items);

		if (
			!alldayItems.equals(this.alldayItems) ||
			keysToCompare.find((key) => this.props[key] !== nextProps[key])
		) {
			this.alldayItems = alldayItems;

			return true;
		}

		return false;
	}

	renderAlldayItem(item) {
		const { daysNumber } = this.props;

		return <AlldayItem key={item.get('id')} item={item} daysNumber={daysNumber} />;
	}

	renderCollapseButton(alldayItems) {
		const { toggleAlldayCollapse, isAlldayCollapsed } = this.props;

		if (!alldayItems.some((item) => item.get('type') === ITEM_TYPE.COLLAPSIBLE)) {
			return null;
		}

		return (
			<Button onClick={() => toggleAlldayCollapse()} size="s" className={classes.buttonRound}>
				<Icon icon={isAlldayCollapsed ? 'arrow-down' : 'arrow-up'} />
			</Button>
		);
	}

	async addNewItem(event) {
		const { daysNumber, startDate, calendarApi } = this.props;
		const alldayRect = this.alldayContainer.getBoundingClientRect();

		const date = calculateDateTimeFromCoordinates(startDate, daysNumber, alldayRect.width, 0, {
			x: event.pageX - alldayRect.left,
		});

		await calendarApi.onGridClick({
			event,
			context: ITEM_CONTEXT.ALLDAY,
			date: date.format(UTC_DATE_FORMAT),
			time: null,
		});
	}

	render() {
		const {
			daysNumber,
			viewportHeight,
			visibleAlldayItems,
			viewportWidth,
			translator,
		} = this.props;
		const alldayItems = getAlldayItems(this.props, this.alldayItems);

		const maxTopPosition = alldayItems.size
			? alldayItems
					.maxBy((item) => {
						return item.getIn(['position', 'top']);
					})
					.getIn(['position', 'top'])
			: 0;

		const alldayItemsMinCount =
			visibleAlldayItems > maxTopPosition ? maxTopPosition : visibleAlldayItems;
		const alldayItemHeight =
			HEIGHT_OF_ALLDAY_ACTIVITY +
			(alldayItemsMinCount > 0 ? SPACE_BETWEEN_ALLDAY_ACTIVITIES : 0);

		const alldayMaxHeight = viewportHeight / 2;
		const alldayMinHeight = alldayItemsMinCount * alldayItemHeight;

		const totalHeight = (maxTopPosition + 1) * alldayItemHeight;
		const height = Math.max(Math.min(totalHeight, alldayMaxHeight), alldayMinHeight);
		const overflowY = height < totalHeight ? 'scroll' : 'visible';

		return (
			<div className={classes.calendarAllday} style={{ overflowY }}>
				<div
					className={classes.calendarAlldayBackground}
					style={{
						width: viewportWidth,
						height: totalHeight + ALLDAY_SCROLL_HEIGHT_EXTRA,
					}}
				>
					<div className={classes.calendarAlldayLeftAside}>
						{this.renderCollapseButton(alldayItems)}
					</div>
					<div
						className={classes.allday}
						onClick={this.addNewItem}
						data-calendar-item-drop-area="allday"
					>
						{range(daysNumber).map((index) => (
							<div className={classes.day} key={`allday-day-header-${index}`}>
								<div
									className={classes.placeholder}
									key={`day__placeholder-${index}`}
								>
									<span className={classes.placeholderContent}>
										{translator.gettext('Click to add')}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div>
					<div
						className={classes.calendarAlldayActivitiesWrapper}
						ref={(el) => (this.alldayContainer = el)}
						data-calendar-item-drop-area="allday"
						style={{ height, width: viewportWidth - ALLDAY_OFFSET.LEFT }}
					>
						<div className={classes.calendarAlldayActivitiesInner}>
							{alldayItems.map(this.renderAlldayItem.bind(this))}
							<div
								key="spacer"
								style={{
									position: 'absolute',
									top:
										maxTopPosition * HEIGHT_OF_ALLDAY_ACTIVITY +
										ALLDAY_OFFSET.BOTTOM,
									width: '1px',
									height: `${HEIGHT_OF_ALLDAY_ACTIVITY}px`,
								}}
							></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Allday.propTypes = {
	calendarApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	viewportHeight: PropTypes.number.isRequired,
	viewportWidth: PropTypes.number.isRequired,
	startDate: PropTypes.string.isRequired,
	endDate: PropTypes.string.isRequired,
	daysNumber: PropTypes.number.isRequired,
	toggleAlldayCollapse: PropTypes.func.isRequired,
	items: ImmutablePropTypes.list,
	isAlldayCollapsed: PropTypes.bool,
	visibleAlldayItems: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
	startDate: state.getIn(['dates', 'startDate']),
	endDate: state.getIn(['dates', 'endDate']),
	daysNumber: state.getIn(['dates', 'daysNumber']),
	items: state.getIn(['calendar', 'items']),
	isAlldayCollapsed: state.getIn(['calendar', 'isAlldayCollapsed']),
	visibleAlldayItems: state.getIn(['calendar', 'visibleAlldayItems']),
	viewportHeight: state.getIn(['viewport', 'height']),
	viewportWidth: state.getIn(['viewport', 'width']),
});
const mapDispatchToProps = (dispatch) => ({
	toggleAlldayCollapse: (activityId, data) => dispatch(toggleAlldayCollapse(activityId, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(context(Allday));
