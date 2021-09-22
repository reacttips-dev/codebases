import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getTimeFormat } from '../../../utils/date';
import { calculateTimeTopOffset } from '../utils/grid';
import classes from '../scss/_current-time-indicator.scss';

class CurrentTimeIndicator extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			currentTime: {},
			position: {
				top: 0,
			},
		};
	}

	componentDidMount() {
		this.tick();
		this.interval = setInterval(() => this.tick(), 15000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	tick() {
		const currentTime = moment();
		const position = { top: calculateTimeTopOffset() };

		this.setState({
			currentTime,
			position,
		});
	}

	render() {
		const { currentTime, position } = this.state;

		return (
			<div className={classes.currentTimeIndicator} style={position}>
				<div className={classes.time}>
					{moment(currentTime).format(getTimeFormat(true))}
				</div>
				<div className={classes.dot} />
				<div className={classes.line} />
			</div>
		);
	}
}

CurrentTimeIndicator.propTypes = {
	getTimeFormat: PropTypes.func,
};

export default CurrentTimeIndicator;
