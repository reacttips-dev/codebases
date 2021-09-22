import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import { Progressbar, Icon } from '@pipedrive/convention-ui-react';
import PDBox from 'components/gettingStarted/pdBox';
import Panel from 'components/gettingStarted/panel';

import style from './style.css';

export class ToggleButton extends Component {
	constructor(props) {
		super(props);

		this.hide = this.hide.bind(this);
	}

	hide(e) {
		e.stopPropagation();
		this.props.hide();
	}

	getStagesStats() {
		const countableStages = this.props.stages.filter((stage) => !stage.excludeFromProgress);
		const total = countableStages.length;
		const completed = countableStages.filter((stage) => stage.completed).length;

		return {
			total,
			completed,
		};
	}

	getTitle() {
		const stages = this.getStagesStats();

		if (!stages.completed) {
			return this.props.gettext('Continue set-up');
		} else if (stages.completed === stages.total) {
			return this.props.gettext('Well done!');
		}

		return this.props.gettext('Making progress');
	}

	getProgress() {
		// Shall include stages with `excludeFromProgress` flag for the GS v2 test
		const max = this.props.stages.length;
		const current = this.props.stages.filter((stage) => stage.completed).length;

		return (current / max) * 100;
	}

	render() {
		if (!this.props.displayButton) {
			return null;
		}

		const progress = this.getProgress();

		return (
			<div className={style.ToggleButton} onClick={this.props.toggle}>
				<Panel
					display={this.props.displayButton}
					exposedClass={this.props.exposedClass}
					zIndex={this.props.zIndex}
				>
					<PDBox stages={this.props.stages} />
					<div className={style.ToggleButton__title}>
						{this.getTitle()}
						<span className={style.ToggleButton__titleIcon}>
							<Icon
								icon="arrow-right"
								size="s"
							/>
						</span>
					</div>
					<div className={style.ToggleButton__progressbarContainer}>
						<Progressbar
							className={style.ToggleButton__progressbar}
							size="s"
							color="green"
							percent={progress}
						/>
					</div>
					<div className={style.ToggleButton__skip} onClick={this.hide}>
						{this.props.gettext('Close')}
					</div>
				</Panel>
			</div>
		);
	}
}

ToggleButton.propTypes = {
	displayButton: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	hide: PropTypes.func.isRequired,
	gettext: PropTypes.func.isRequired,
	stages: PropTypes.array.isRequired,
	zIndex: PropTypes.number,
	exposedClass: PropTypes.string.isRequired,
};

ToggleButton.defaultProps = {
	stages: [],
};

export default translate()(ToggleButton);
