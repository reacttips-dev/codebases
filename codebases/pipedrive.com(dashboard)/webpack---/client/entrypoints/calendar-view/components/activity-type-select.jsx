import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, ButtonGroup, Icon, Select } from '@pipedrive/convention-ui-react';
import { TYPE_SELECT_VISIBLE_ITEMS } from '../../../config/constants';
import classes from '../scss/_activity-type-select.scss';

class ActivityTypeSelect extends React.PureComponent {
	constructor(props) {
		super(props);

		this.renderSelectList = this.renderSelectList.bind(this);
		this.getSelectElement = this.getSelectElement.bind(this);
		this.getIconElement = this.getIconElement.bind(this);
	}

	getIconElement(type) {
		const { selectedType, onChange } = this.props;
		const classNames = [];
		const key = type.get('key_string');

		if (key === selectedType) {
			classNames.push(classes.buttonSelected);
		}

		return (
			<Button
				data-test="select-button"
				className={classNames.join(' ')}
				key={key}
				onClick={() => onChange(key)}
			>
				<Icon icon={`ac-${type.get('icon_key')}`} size="s" />
			</Button>
		);
	}

	getSelectElement(type) {
		const key = type.get('key_string');

		return (
			<Select.Option key={key} value={key}>
				<span className={classes.selectListItem}>
					<Icon icon={`ac-${type.get('icon_key')}`} size="s" />
					<span className={classes.selectListText}>{type.get('name')}</span>
				</span>
			</Select.Option>
		);
	}

	renderSelectList(selectElements) {
		const { onChange, selectedType } = this.props;
		const classNames = [classes.selectList];

		if (selectElements.find((type) => type.get('key_string') === selectedType)) {
			classNames.push(classes.selectListSelected);
		}

		return (
			<Select
				className={classNames.join(' ')}
				popupClassName={classes.popover}
				onChange={onChange}
				value={selectedType}
				key="activity-type-select__select"
			>
				{selectElements.map(this.getSelectElement)}
			</Select>
		);
	}

	render() {
		const { activityTypes } = this.props;
		const iconElements = activityTypes.slice(0, TYPE_SELECT_VISIBLE_ITEMS);
		const selectElements = activityTypes.slice(TYPE_SELECT_VISIBLE_ITEMS, activityTypes.size);
		const buttons = iconElements.map(this.getIconElement).toArray();

		if (selectElements.size) {
			buttons.push(this.renderSelectList(selectElements));
		}

		return <ButtonGroup className={classes.select}>{buttons}</ButtonGroup>;
	}
}

ActivityTypeSelect.propTypes = {
	activityTypes: ImmutablePropTypes.list.isRequired,
	selectedType: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default ActivityTypeSelect;
