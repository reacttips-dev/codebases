import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/app';
import CoachmarkContainer from 'containers/coachmarks';
import {
	notifyReadyWithDetails, closeAndPossiblyNotify, receive, enqueue, unqueue, dropQueue, requestWithUserDetails, suppress,
} from 'actions/coachmarks';
import { gettingStartedStore } from '../../store';
import { suppressGettingStarted } from 'actions/gettingStarted';
import style from './style.css';

let fetchRequired = true;

const coachmarks = {};

const renderDetachedCoachMark = (Coachmark, options, mountNode) => {
	if (!Coachmark.detachedMountNode || options.parentContainer) {
		Coachmark.detachedMountNode = document.createElement('DIV');
		Coachmark.detachedMountNode.className = style.Mount;

		if (options.parentContainer) {
			options.parentContainer.appendChild(Coachmark.detachedMountNode);
		} else {
			document.body.appendChild(Coachmark.detachedMountNode);
		}
	}

	Coachmark.detachedMountNode.appendChild(mountNode);
};

export default function(store) {
	return {
		Coachmark: class Coachmark {
			static detachedMountNode = null;

			constructor(options) {
				if (coachmarks[options.tag]) {
					return coachmarks[this.tag];
				} else {
					coachmarks[options.tag] = this;
				}

				this.tag = options.tag;
				this.__debug = options.__debug || false;

				store.dispatch(enqueue(this.tag));

				if (fetchRequired) {
					store.dispatch(requestWithUserDetails());
					fetchRequired = false;
				}

				if (this.__debug) {
					if (process.env.NODE_ENV !== 'production') {
						console.warn(`The ${options.tag} coachmark is in DEBUG mode. Disable DEBUG mode to hide this message.`);
					}

					store.dispatch(receive([Object.assign({}, this.__debug, {
						tag: options.tag,
						activeFlag: true,
					})]));
				}

				this.mountNode = document.createElement('DIV');

				if (options.parent) {
					const parent = options.parent;

					if (options.detached) {
						renderDetachedCoachMark(Coachmark, options, this.mountNode);
					} else {
						parent.appendChild(this.mountNode);
					}
				}

				this.close = this.close.bind(this);
				this.confirm = this.confirm.bind(this);
				this.onConfirm = options.onConfirm;
				this.onSeen = options.onSeen;
				this.onReady = this.onReady.bind(this, options.onReady);
				this.onChange = options.onChange;

				if (options.pulsate) {
					this.pulsating = true;
					options.pulsate.onPopupVisible = this.onPopupVisible.bind(this, options.pulsate.onPopupVisible);
				}

				ReactDOM.render(
					<App store={store}>
						<CoachmarkContainer
							pulsate={options.pulsate}
							appearance={options.appearance}
							close={this.close}
							confirm={this.confirm}
							onReady={this.onReady}
							onChange={this.onChange}
							onSeen={this.onSeen}
							tag={options.tag}
							content={options.content}
							footer={options.footer}
							actions={options.actions}
							exposedClass={options.exposedClass}
							parent={options.parent}
							detached={options.detached}
							unqueue={this.unqueue}
						/>
					</App>,
					this.mountNode);
			}

			onReady(onReady, data) {
				if (onReady) {
					onReady(data);
				}

				if (!this.pulsating) {
					store.dispatch(notifyReadyWithDetails(this.tag));
				}
			}

			onPopupVisible(onPopupVisible, visible) {
				if (onPopupVisible) {
					onPopupVisible(visible);
				}

				if (visible) {
					store.dispatch(notifyReadyWithDetails(this.tag));
				}
			}

			close(event, cta) {
				if (event) {
					event.stopPropagation();
				}

				store.dispatch(closeAndPossiblyNotify(this.tag, this.__debug, cta));
			}

			unqueue(event) {
				if (event) {
					event.stopPropagation();
				}

				store.dispatch(unqueue(this.tag));
			}

			confirm(event) {
				if (this.onConfirm) {
					this.onConfirm(event);
				} else {
					this.close(event);
				}
			}

			remove() {
				this.unqueue();
				this.onConfirm = null;
				this.onReady = null;
				this.onChange = null;
				this.onSeen = null;
				coachmarks[this.tag] = null;

				if (this.mountNode) {
					ReactDOM.unmountComponentAtNode(this.mountNode);

					if (this.mountNode.parentElement) {
						this.mountNode.parentElement.removeChild(this.mountNode);
					} else if (this.mountNode.remove) {
						this.mountNode.remove();
					}
				}
			}
		},
		clearCoachmarksQueue: () => {
			store.dispatch(dropQueue());
		},
		suppressCoachmarks: (suppressed) => {
			store.dispatch(suppress(suppressed));
			gettingStartedStore.dispatch(suppressGettingStarted(suppressed));
		},
	};
}
