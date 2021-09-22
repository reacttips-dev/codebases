import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { connect } from 'react-redux';
import { find, defer } from 'lodash';
import Align from 'rc-align';
import { notifyServer } from 'actions/coachmarks';
import zIndex from 'containers/zIndex';
import CoachmarkComponent from 'components/coachmarks';
import PulsatingCoachmarkComponent from 'components/coachmarks/pulsating';
import isHidden from 'utils/isHidden';
/*
	Keep the following constant synced with a `$triangleSide` CSS variable
	from `components/coachmarks/style.css` so that styles are unified
*/
const COACHMARKS_OFFSET = 10;

export const encodeAlignPosition = (position) => {
	if (typeof position === 'object') {
		return position;
	}

	switch (position) {
		case 'top':
			return {
				points: ['bc', 'tc'],
				targetOffset: [0, COACHMARKS_OFFSET],
			};
		case 'topRight':
			return {
				points: ['bl', 'tc'],
				targetOffset: [0, COACHMARKS_OFFSET],
			};
		case 'topLeft':
			return {
				points: ['br', 'tc'],
				targetOffset: [0, COACHMARKS_OFFSET],
			};
		case 'bottom':
			return {
				points: ['tc', 'bc'],
				targetOffset: [0, -COACHMARKS_OFFSET],
			};
		case 'bottomRight':
			return {
				points: ['tl', 'bc'],
				targetOffset: [0, -COACHMARKS_OFFSET],
			};
		case 'bottomLeft':
			return {
				points: ['tr', 'bc'],
				targetOffset: [0, -COACHMARKS_OFFSET],
			};
		case 'left':
			return {
				points: ['cr', 'cl'],
				targetOffset: [COACHMARKS_OFFSET, 0],
			};
		case 'right':
			return {
				points: ['cl', 'cr'],
				targetOffset: [-COACHMARKS_OFFSET, 0],
			};
		default:
			return {
				points: ['cc', 'cc'],
				targetOffset: [0, 0],
			};
	}
};

const getHighestPriority = (state) =>
	(state.coachmarks.queue || []).reduce((priority, coachmark) =>
		coachmark.priority > priority ? coachmark.priority : priority, 0);

export class Coachmark extends Component {
	constructor(props) {
		super(props);
		this.onReady = this.onReady.bind(this);
		this.onChange = this.onChange.bind(this);
		this.close = this.close.bind(this);
		this.confirm = this.confirm.bind(this);
		this.state = {
			onReadyFired: false,
		};

		if (typeof props.appearance === 'string') {
			this.placement = props.appearance;
		} else {
			this.zIndex = props.appearance.zIndex;
			this.placement = props.appearance.placement;
			this.align = props.appearance.align;
			this.width = props.appearance.width;
		}

		const Component = props.pulsate ? PulsatingCoachmarkComponent : CoachmarkComponent;

		if (this.zIndex) {
			this.PositionedCoachmarkComponent = zIndex(this.zIndex)(Component);
		} else {
			this.PositionedCoachmarkComponent = Component;
		}
	}

	componentDidMount() {
		this.props.active ? this.onReady() : this.onSeen();
	}

	componentDidUpdate() {
		if (this.state.onReadyFired) {
			this.onChange();
		} else {
			this.onReady();
		}
	}

	componentWillUnmount() {
		this.props.unqueue();
	}

	onReady() {
		if (this.props.onReady && this.props.active) {
			// Callback should be async to make sure that coachmark initialization is finished
			defer(this.props.onReady, this.getData());

			this.setState({
				onReadyFired: true,
			});
		}

		if (this.props.active && this.props.shouldNotifyOnDisplay && !this.props.isSavedInServer) {
			this.props.notifyServer(this.props.tag);
		}
	}

	onSeen() {
		if (this.props.onSeen) {
			defer(this.props.onSeen);
		}
	}

	onChange() {
		if (this.props.onChange) {
			// Callback should be async to make sure that coachmark initialization is finished
			defer(this.props.onChange, this.getData());
		}
	}

	getData() {
		return {
			active: this.props.active,
		};
	}

	close(e) {
		this.onSeen();
		this.props.close(e);
	}

	confirm(e) {
		this.props.confirm(e);
	}

	render() {
		const disabled = !(this.props.active);
		const notVisible = (!this.placement && !this.zIndex) || isHidden(this.props.parent);

		// old iam-client coachmarks need to be suppressed while Onboarding Tour is happening
		const { suppressed } = this.props;

		if (suppressed || notVisible || disabled) {
			return false;
		}

		const Coachmark = (
			<this.PositionedCoachmarkComponent
				{...(this.props.pulsate || {})}
				close={this.close}
				confirm={this.confirm}
				placement={this.placement}
				width={this.width}
				detached={this.props.detached}
				content={this.props.content}
				footer={this.props.footer}
				actions={this.props.actions}
			/>
		);

		if (this.props.detached) {
			const align = encodeAlignPosition(this.align || this.placement);

			return (
				<Align align={align} target={() => this.props.parent}>
					{Coachmark}
				</Align>
			);
		} else {
			return Coachmark;
		}
	}
}

Coachmark.propTypes = {
	appearance: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	notifyServer: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	confirm: PropTypes.func.isRequired,
	unqueue: PropTypes.func.isRequired,
	onReady: PropTypes.func,
	onSeen: PropTypes.func,
	onChange: PropTypes.func,
	tag: PropTypes.string.isRequired,
	active: PropTypes.bool.isRequired,
	shouldNotifyOnDisplay: PropTypes.bool.isRequired,
	pulsate: PropTypes.shape({
		iconUrl: PropTypes.string,
		content: PropTypes.string,
		popoverProps: PropTypes.shape({
			offset: PropTypes.string,
			placement: PropTypes.string,
		}),
	}),
	isSavedInServer: PropTypes.bool,
	content: PropTypes.string,
	footer: PropTypes.node,
	important: PropTypes.bool,
	actions: PropTypes.array,
	detached: PropTypes.bool,
	parent: PropTypes.object,
	offset: PropTypes.array,
	suppressed: PropTypes.bool,
};

Coachmark.defaultProps = {
	appearance: {
		placement: 'top',
	},
};

export const mapStateToProps = (state, ownProps) => {
	const dataFetched = !!state.coachmarks.all;
	const details = find(state.coachmarks.all, { tag: ownProps.tag });
	const highestPriority = getHighestPriority(state);

	const snoozed = !!find(state.coachmarks.unquequed, { tag: ownProps.tag });

	const nextInQueue = find(state.coachmarks.queue, { active: true, important: false, priority: highestPriority }) || {};
	const active = dataFetched && !snoozed &&
		!!(details && ((details.important && details.priority === highestPriority) || nextInQueue.tag === ownProps.tag));
	const shouldNotifyOnDisplay = details ? (dataFetched && details.viewedType === 'display') : false;
	const isSavedInServer = !!find(state.coachmarks.all, { tag: ownProps.tag, isSavedInServer: true });
	const suppressed = state.coachmarks.suppressed;

	return {
		active,
		shouldNotifyOnDisplay,
		isSavedInServer,
		suppressed,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		notifyServer: (tag) => {
			dispatch(notifyServer(tag));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Coachmark);
