import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.css';

export class PDBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const countableStages = this.props.stages.filter((stage) => !stage.excludeFromProgress);
		const stagesCount = countableStages.length;
		const stagesCompleted = countableStages.filter((stage) => stage.completed).length;

		const classes = classNames({
			[style.PDBox]: true,
			[style['PDBox--boxClosed']]: (stagesCompleted < 1),
			[style['PDBox--boxHalfOpen']]: (stagesCompleted >= 1 && stagesCompleted < stagesCount),
			[style['PDBox--boxOpen']]: (stagesCompleted === stagesCount),
		});

		return (
			<div className={classes}></div>
		);
	}
}

PDBox.propTypes = {
	stages: PropTypes.array.isRequired,
};

PDBox.defaultProps = {
	stages: [],
};

export default PDBox;
