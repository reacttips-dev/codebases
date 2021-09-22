import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import withContext from '../../../utils/context';

import { ButtonGroup, Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';

import classes from '../scss/_header.scss';

const ChangeDayButton = ({ icon, onClick, tooltip }) => {
	return (
		<Tooltip placement="top" content={tooltip} popperProps={{ positionFixed: true }}>
			<Button color="ghost" onClick={onClick}>
				<Icon icon={icon} size="s" />
			</Button>
		</Tooltip>
	);
};

ChangeDayButton.propTypes = {
	icon: PropTypes.string,
	onClick: PropTypes.func,
	tooltip: PropTypes.string,
};

class AgendaViewHeader extends Component {
	renderButton(icon, onClick, tooltip) {
		return (
			<Tooltip placement="top" content={tooltip}>
				<Button color="ghost" onClick={onClick}>
					<Icon icon={icon} size="s" />
				</Button>
			</Tooltip>
		);
	}

	render() {
		const { startDate, translator } = this.props;
		const dateFormat = 'dddd, MMMM Do';

		return (
			<div className={classes.agendaViewHeader}>
				<div className={classes.agendaViewHeaderDate}>
					{moment(startDate).format(dateFormat)}
				</div>
				<ButtonGroup className={classes.buttonGroup}>
					<ChangeDayButton
						icon="arrow-left"
						onClick={this.props.onDayBack}
						tooltip={translator.gettext('Previous day')}
					/>
					<ChangeDayButton
						icon="arrow-right"
						onClick={this.props.onDayForward}
						tooltip={translator.gettext('Next day')}
					/>
				</ButtonGroup>
			</div>
		);
	}
}

AgendaViewHeader.propTypes = {
	translator: PropTypes.object.isRequired,
	startDate: PropTypes.string,
	onDayBack: PropTypes.func,
	onDayForward: PropTypes.func,
};

const mapStateToProps = (state) => ({
	startDate: state.getIn(['dates', 'startDate']),
});

export default connect(mapStateToProps)(withContext(AgendaViewHeader));
