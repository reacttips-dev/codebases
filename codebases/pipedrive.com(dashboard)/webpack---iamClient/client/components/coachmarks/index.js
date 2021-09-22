import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NativeListener from 'react-native-listener';
import { Icon } from '@pipedrive/convention-ui-react';
import defaults from 'constants/coachmarks/options.json';

import style from './style.css';

export default class Coachmark extends Component {
	constructor(props) {
		super(props);
		this.close = this.close.bind(this);
	}

	close(e) {
		e.stopPropagation();
		this.props.close(e);
	}

	makeAction(action) {
		return (e) => {
			e.stopPropagation();
			action(e);
		};
	}

	render() {
		const classes = [
			this.props.exposedClass,
			style.Coachmark,
			style[`Coachmark--${this.props.placement}`],
		];

		let actions;

		let primarySpecified = false;

		if (this.props.actions) {
			classes.push(style['Coachmark--withActions']);
			actions = this.props.actions.map((action, index) => {
				const actionClasses = [style.Coachmark__action];

				if (action.primary || (this.props.actions.length === (index + 1) && !primarySpecified)) {
					actionClasses.push(style['Coachmark__action--primary']);
					primarySpecified = true;
				}

				return (
					<NativeListener key={index} onClick={this.makeAction(action.handler)}>
						<div className={actionClasses.join(' ')}>
							{action.label}
						</div>
					</NativeListener>
				);
			});
		}

		if (this.props.detached) {
			classes.push(style['Coachmark--detached']);
		}

		const css = {
			zIndex: this.props.zIndex,
		};

		if (this.props.width) {
			css.width = `${this.props.width}px`;
			classes.push(style['Coachmark--hasWidth']);
		}

		return (
			<div className={classes.join(' ')} onClick={this.props.confirm} style={css}>
				<div className={style.Coachmark__content}>{this.props.content}</div>
				<NativeListener onClick={this.close}>
					<div className={style.Coachmark__closeWrapper}>
						<Icon icon="cross" color="white" size="s" className={style.Coachmark__close}/>
					</div>
				</NativeListener>
				{(this.props.footer || this.props.actions) &&
					<div className={style.Coachmark__footer}>
						{!!this.props.footer &&
							<div className={style.Coachmark__footerInner}>
								{this.props.footer}
							</div>
						}
						{!!this.props.actions &&
							<div className={style.Coachmark__actionsList}>
								{actions}
							</div>
						}
					</div>
				}
			</div>
		);
	}
}

Coachmark.propTypes = {
	close: PropTypes.func.isRequired,
	confirm: PropTypes.func.isRequired,
	content: PropTypes.string.isRequired,
	footer: PropTypes.node,
	placement: PropTypes.string,
	actions: PropTypes.array,
	exposedClass: PropTypes.string.isRequired,
	width: PropTypes.number,
	detached: PropTypes.bool,
	zIndex: PropTypes.number,
};

Coachmark.defaultProps = {
	exposedClass: defaults.EXPOSED_CLASS,
};
