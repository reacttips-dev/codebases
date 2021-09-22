import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from './calendar';

import { Icon } from '@pipedrive/convention-ui-react';

import {
	NarrowViewCalendarContainer,
	ToggleArea,
	ToggleOverflow,
	Toggle,
	ToggleButton,
} from './styles';

const ToggleAgenda = ({ expanded, toggleExpanded }) => {
	const expandAgenda = () => !expanded && toggleExpanded();

	return (
		<ToggleArea expanded={expanded}>
			<ToggleOverflow expanded={expanded} onClick={expandAgenda} />
			<Toggle expanded={expanded} onClick={expandAgenda} />
			<ToggleButton expanded={expanded} onClick={toggleExpanded}>
				<Icon icon={expanded ? 'arrow-right' : 'arrow-left'} size="s" color="blue" />
			</ToggleButton>
		</ToggleArea>
	);
};

ToggleAgenda.propTypes = {
	expanded: PropTypes.bool,
	toggleExpanded: PropTypes.func,
};

class NarrowViewCalendar extends Component {
	constructor(props) {
		super(props);

		this.narrowViewRef = React.createRef();
		this.handleClick = this.handleClick.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);

		this.state = {
			expanded: false,
		};
	}

	componentDidMount() {
		window.addEventListener('click', this.handleClick);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.handleClick);
	}

	handleClick(e) {
		const clickedOutside =
			this.narrowViewRef.current && !this.narrowViewRef.current.contains(e.target);

		if (this.state.expanded && clickedOutside) {
			this.toggleExpanded();
		}
	}

	toggleExpanded() {
		const { expanded } = this.state;

		this.setState({ expanded: !expanded });
	}

	render() {
		const { expanded } = this.state;

		return (
			<NarrowViewCalendarContainer expanded={expanded} ref={this.narrowViewRef}>
				<ToggleAgenda expanded={expanded} toggleExpanded={this.toggleExpanded} />
				<Calendar />
			</NarrowViewCalendarContainer>
		);
	}
}

export default NarrowViewCalendar;
