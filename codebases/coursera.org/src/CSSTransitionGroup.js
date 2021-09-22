/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *	Additional credit to the Author of rc-css-transition-group: https://github.com/yiminghe
 *	File originally extracted from the React source, converted to ES6 by https://github.com/developit
 */


import { h, cloneElement, Component } from 'preact';
import { getKey, filterNullChildren } from './util';
import { mergeChildMappings, isShownInChildren, isShownInChildrenByKey, inChildren, inChildrenByKey } from './TransitionChildMapping';
import { CSSTransitionGroupChild } from './CSSTransitionGroupChild';

export class CSSTransitionGroup extends Component {
	static defaultProps = {
		component: 'span',
		transitionEnter: true,
		transitionLeave: true
	};

	constructor(props) {
		super();
		this.refs = {};
		this.state = {
			children: (props.children || []).slice()
		};
	}

	shouldComponentUpdate(_, { children }) {
		return children!==this.state.children;
	}

	componentWillMount() {
		this.currentlyTransitioningKeys = {};
		this.keysToEnter = [];
		this.keysToLeave = [];
	}

	componentWillReceiveProps({ children, exclusive, showProp }) {
		let nextChildMapping = filterNullChildren(children || []).slice();

		// last props children if exclusive
		let prevChildMapping = filterNullChildren(exclusive ? this.props.children : this.state.children);

		let newChildren = mergeChildMappings(
			prevChildMapping,
			nextChildMapping
		);

		if (showProp) {
			newChildren = newChildren.map( c => {
				if (!c.props[showProp] && isShownInChildren(prevChildMapping, c, showProp)) {
					c = cloneElement(c, { [showProp]:true });
				}
				return c;
			});
		}

		if (exclusive) {
			// make middle state children invalid
			// restore to last props children
			newChildren.forEach( c => this.stop(getKey(c)) );
		}

		this.setState({ children: newChildren });
		this.forceUpdate();

		nextChildMapping.forEach( c => {
			let { key } = c,
				hasPrev = prevChildMapping && inChildren(prevChildMapping, c);
			if (showProp) {
				if (hasPrev) {
					let showInPrev = isShownInChildren(prevChildMapping, c, showProp),
						showInNow = c.props[showProp];
					if (!showInPrev && showInNow && !this.currentlyTransitioningKeys[key]) {
						this.keysToEnter.push(key);
					}
				}
			}
			else if (!hasPrev && !this.currentlyTransitioningKeys[key]) {
				this.keysToEnter.push(key);
			}
		});

		prevChildMapping.forEach( c => {
			let { key } = c,
				hasNext = nextChildMapping && inChildren(nextChildMapping, c);
			if (showProp) {
				if (hasNext) {
					let showInNext = isShownInChildren(nextChildMapping, c, showProp);
					let showInNow = c.props[showProp];
					if (!showInNext && showInNow && !this.currentlyTransitioningKeys[key]) {
						this.keysToLeave.push(key);
					}
				}
			}
			else if (!hasNext && !this.currentlyTransitioningKeys[key]) {
				this.keysToLeave.push(key);
			}
		});
	}

	performEnter(key) {
		this.currentlyTransitioningKeys[key] = true;
		let component = this.refs[key];
		if (component.componentWillEnter) {
			component.componentWillEnter( () => this._handleDoneEntering(key) );
		}
		else {
			this._handleDoneEntering(key);
		}
	}

	_handleDoneEntering(key) {
		delete this.currentlyTransitioningKeys[key];
		let currentChildMapping = filterNullChildren(this.props.children),
			showProp = this.props.showProp;
		if (!currentChildMapping || (
			!showProp && !inChildrenByKey(currentChildMapping, key)
		) || (
			showProp && !isShownInChildrenByKey(currentChildMapping, key, showProp)
		)) {
			// This was removed before it had fully entered. Remove it.
			this.performLeave(key);
		}
		else {
			this.setState({ children: currentChildMapping });
			// this.forceUpdate();
		}
	}

	stop(key) {
		delete this.currentlyTransitioningKeys[key];
		let component = this.refs[key];
		if (component) component.stop();
	}

	performLeave(key) {
		this.currentlyTransitioningKeys[key] = true;
		let component = this.refs[key];
		if (component && component.componentWillLeave) {
			component.componentWillLeave( () => this._handleDoneLeaving(key) );
		}
		else {
			// Note that this is somewhat dangerous b/c it calls setState()
			// again, effectively mutating the component before all the work
			// is done.
			this._handleDoneLeaving(key);
		}
	}

	_handleDoneLeaving(key) {
		delete this.currentlyTransitioningKeys[key];
		let showProp = this.props.showProp,
			currentChildMapping = filterNullChildren(this.props.children);
		if (showProp && currentChildMapping &&
			isShownInChildrenByKey(currentChildMapping, key, showProp)) {
			this.performEnter(key);
		}
		else if (!showProp && currentChildMapping && inChildrenByKey(currentChildMapping, key)) {
			// This entered again before it fully left. Add it again.
			this.performEnter(key);
		}
		else {
			this.setState({ children: currentChildMapping });
			// this.forceUpdate();
		}
	}

	componentDidUpdate() {
		let { keysToEnter, keysToLeave } = this;
		this.keysToEnter = [];
		keysToEnter.forEach( k => this.performEnter(k) );
		this.keysToLeave = [];
		keysToLeave.forEach( k => this.performLeave(k) );
	}

	renderChild = child => {
		let { transitionName, transitionEnter, transitionLeave, transitionEnterTimeout, transitionLeaveTimeout } = this.props,
			key = getKey(child);
		return (
			<CSSTransitionGroupChild
				key={key}
				ref={ c => {
					if (!(this.refs[key] = c)) child = null;
				}}
				name={transitionName}
				enter={transitionEnter}
				leave={transitionLeave}
				enterTimeout={transitionEnterTimeout}
				leaveTimeout={transitionLeaveTimeout}>
				{child}
			</CSSTransitionGroupChild>
		);
	};

	render({ component:Component, transitionName, transitionEnter, transitionLeave, transitionEnterTimeout, transitionLeaveTimeout, children:c, ...props }, { children }) {
		return (
			<Component {...props}>
				{ filterNullChildren(children).map(this.renderChild) }
			</Component>
		);
	}
}
