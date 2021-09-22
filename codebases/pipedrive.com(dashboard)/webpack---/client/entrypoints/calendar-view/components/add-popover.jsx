import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import { Button, Input } from '@pipedrive/convention-ui-react';
import { ITEM_CONTEXT } from '../../../config/constants';
import { durationLabel, monthDayLabel } from '../utils/formatters';
import ActivityTypeSelect from './activity-type-select';
import { prepareActivityData } from '../../../utils/activity';
import classes from '../scss/_add-popover.scss';
import withContext from '../../../utils/context';

class AddPopover extends Component {
	constructor(props) {
		super(props);

		this.state = {
			popoverVisible: false,
		};

		this.activityTypes = fromJS(this.props.webappApi.userSelf.get('activity_types'));
	}

	handleSubjectChange(e) {
		const { item, updateThisItem } = this.props;
		const inputValue = e.target.value;
		const isDefaultSubject = !inputValue;

		let subject = inputValue;

		if (!inputValue) {
			const selectedType = this.activityTypes.find(
				(type) => type.get('key_string') === item.getIn(['data', 'type']),
			);

			subject = selectedType.get('name');
		}

		updateThisItem(
			fromJS({
				isDefaultSubject,
				data: {
					subject,
				},
			}),
		);
	}

	handleTypeChange(key) {
		const { item, updateThisItem } = this.props;
		const type = this.activityTypes.find((type) => type.get('key_string') === key);
		const data = {
			type: type.get('key_string'),
		};
		const isDefaultSubject = item.get('isDefaultSubject');

		if (isDefaultSubject) {
			data.subject = type.get('name');
		}

		updateThisItem(fromJS({ data }));
	}

	openDetails() {
		const { item, removeThisItem, webappApi } = this.props;

		webappApi.router.go(null, '#dialog/activity/add', false, false, {
			data: prepareActivityData(item),
		});
		removeThisItem();
	}

	getDateTimeLabel() {
		const { item } = this.props;
		const monthDay = monthDayLabel(item.get('startDateTime'));

		if (item.get('context') === ITEM_CONTEXT.ALLDAY) {
			return monthDay;
		}

		const duration = durationLabel({
			startDateTime: item.get('startDateTime'),
			endDateTime: item.get('endDateTime'),
		});

		return `${duration.join(' ')}, ${monthDay}`;
	}

	render() {
		const { item, addThisItem, translator } = this.props;
		const selectedType = this.activityTypes.find(
			(type) => type.get('key_string') === item.getIn(['data', 'type']),
		);
		const placeholder = selectedType ? selectedType.get('name') : '';
		const subject = item.getIn(['data', 'subject']);
		const isDefaultSubject = item.get('isDefaultSubject');
		const activeActivityTypes = this.activityTypes.filter((item) => item.get('active_flag'));

		return (
			<div className={classes.addPopover}>
				<div className={classes.content}>
					<div className={classes.row}>
						<ActivityTypeSelect
							selectedType={item.getIn(['data', 'type'])}
							activityTypes={activeActivityTypes}
							onChange={this.handleTypeChange.bind(this)}
						/>
					</div>
					<div className={classes.row}>
						<Input
							placeholder={placeholder}
							value={isDefaultSubject ? '' : subject}
							onChange={this.handleSubjectChange.bind(this)}
						/>
					</div>
					<div className={classes.row}>{this.getDateTimeLabel()}</div>
				</div>
				<div className={classes.footer}>
					<Button
						data-test="open-details"
						className={classes.button}
						onClick={this.openDetails.bind(this)}
					>
						{translator.gettext('Details...')}
					</Button>
					<Button
						color="green"
						className={classes.button}
						data-test="add-button"
						onClick={() => addThisItem(item.set('isRequestPending', true))}
					>
						{translator.gettext('Add')}
					</Button>
				</div>
			</div>
		);
	}
}

AddPopover.propTypes = {
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	item: ImmutablePropTypes.map.isRequired,
	addThisItem: PropTypes.func.isRequired,
	updateThisItem: PropTypes.func.isRequired,
	removeThisItem: PropTypes.func.isRequired,
};

export default withContext(AddPopover);
