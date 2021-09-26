import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import withContext from '../../../utils/context';
import { selectSchedulerEvent } from '../actions/scheduler';
import classes from '../scss/_actions.scss';

class SchedulerButton extends Component {
	state = {
		SchedulerPicker: null,
	};

	async componentDidMount() {
		const { webappApi } = this.props;
		const SchedulerPicker = await webappApi.componentLoader.load(
			'scheduler-service-assets:schedule-picker',
		);

		this.setState({
			SchedulerPicker,
		});
	}

	render() {
		const { SchedulerPicker } = this.state;

		return (
			<div className={classes.schedulerButton}>
				{SchedulerPicker ? (
					<Fragment>
						<SchedulerPicker
							type="popover"
							entryPointName="activitiesList"
							popoverPlacement="bottom-start"
						>
							<Button>
								<span>{this.props.translator.gettext('Propose times')}</span>
								<Icon icon="triangle-down" />
							</Button>
						</SchedulerPicker>
						<SchedulerPicker
							type="modal"
							visible={!!this.props.selectedEvent}
							eventId={this.props.selectedEvent}
							noButton={true}
							onClose={() => this.props.selectSchedulerEvent(null)}
						/>
					</Fragment>
				) : null}
			</div>
		);
	}
}

SchedulerButton.propTypes = {
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	selectedEvent: PropTypes.number,
	selectSchedulerEvent: PropTypes.func,
};

const mapStateToProps = (state) => ({
	selectedEvent: state.getIn(['scheduler', 'selectedEvent']),
});

const mapDispatchToProps = (dispatch) => ({
	selectSchedulerEvent: (eventId) => dispatch(selectSchedulerEvent(eventId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withContext(SchedulerButton));
