import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Button, Dropmenu, Icon } from '@pipedrive/convention-ui-react';

import ActivityTypeButton from '../activity-type-button';
import {
	ActivityTypeIcons,
	ActivityTypeIcon,
	ActivityTypeOption,
	HiddenElement,
} from './form-styles';
import { filterActiveActivityTypes } from '../../../../utils/activity';

const BUTTON_WIDTH = 36;
const ROW_ICON_WIDTH = 40;

class ActivityTypeSelection extends PureComponent {
	hiddenRef = React.createRef();

	state = {
		visibleActivityTypes: [],
		hiddenActivityTypes: [],
	};

	componentDidMount() {
		this.setVisibleAndHiddenActivityTypes();
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.viewportWidth !== this.props.viewportWidth ||
			prevProps.activityTypes !== this.props.activityTypes
		) {
			this.setVisibleAndHiddenActivityTypes();
		}
	}

	get maxWidth() {
		return this.props.viewportWidth - ROW_ICON_WIDTH;
	}

	get shouldShowNames() {
		const widthWithNames = this.hiddenRef.current
			? this.hiddenRef.current.scrollWidth
			: this.maxWidth;

		return widthWithNames <= this.maxWidth;
	}

	get activeActivityTypes() {
		return filterActiveActivityTypes(
			this.props.activityTypes.toJS(),
			this.props.selectedActivityType,
		);
	}

	setVisibleAndHiddenActivityTypes() {
		const activityTypes = this.activeActivityTypes;
		const maxVisibleCount = Math.floor(this.maxWidth / BUTTON_WIDTH);
		const hasHiddenActivityTypes = activityTypes.length > maxVisibleCount;

		const sliceAtIndex = maxVisibleCount - 2;

		const visibleActivityTypes = hasHiddenActivityTypes
			? activityTypes.slice(0, sliceAtIndex)
			: activityTypes;
		const hiddenActivityTypes = hasHiddenActivityTypes ? activityTypes.slice(sliceAtIndex) : [];

		this.setState({ visibleActivityTypes, hiddenActivityTypes });
	}

	renderHiddenActivityTypes() {
		const { hiddenActivityTypes } = this.state;
		const { selectedActivityType } = this.props;

		if (!hiddenActivityTypes || !hiddenActivityTypes.length) {
			return null;
		}

		const visibleActivityType =
			hiddenActivityTypes.find((type) => type.key_string === selectedActivityType) ||
			hiddenActivityTypes[0];

		return (
			<Dropmenu
				closeOnClick
				content={hiddenActivityTypes.map((type) => (
					<ActivityTypeOption
						key={`activity-type-collapsed-${type.id}`}
						onClick={() => this.props.setActivityType(type)}
						selected={type.key_string === selectedActivityType}
					>
						<ActivityTypeIcon icon={`ac-${type.icon_key}`} size="s" />
						{type.name}
					</ActivityTypeOption>
				))}
			>
				<Button active={visibleActivityType.key_string === selectedActivityType}>
					<Icon icon={`ac-${visibleActivityType.icon_key}`} size="s" />
					<Icon icon="triangle-down" size="s" />
				</Button>
			</Dropmenu>
		);
	}

	renderActivityTypes(activityTypes, showName) {
		return activityTypes.map((type) => (
			<ActivityTypeButton
				key={type.id}
				activityType={type}
				showName={showName}
				active={type.key_string === this.props.selectedActivityType}
				setActivityType={(activityType) => this.props.setActivityType(activityType)}
			/>
		));
	}

	render() {
		return (
			<ActivityTypeIcons>
				{this.renderActivityTypes(this.state.visibleActivityTypes, this.shouldShowNames)}
				{this.renderHiddenActivityTypes()}

				<HiddenElement ref={this.hiddenRef}>
					{this.renderActivityTypes(this.activeActivityTypes, true)}
				</HiddenElement>
			</ActivityTypeIcons>
		);
	}
}

ActivityTypeSelection.propTypes = {
	activityTypes: ImmutablePropTypes.list,
	selectedActivityType: PropTypes.string,
	setActivityType: PropTypes.func,
	viewportWidth: PropTypes.number.isRequired,
};

export default ActivityTypeSelection;
