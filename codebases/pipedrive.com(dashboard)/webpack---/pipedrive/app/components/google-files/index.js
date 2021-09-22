import Pipedrive from 'pipedrive';
import _ from 'lodash';
import Helpers from 'utils/helpers';
import $ from 'jquery';

export default async (componentLoader) => {
	const User = await componentLoader.load('webapp:user');

	/**
	 * GoogleFilesHelper creates a singleton class on the application to reuse
	 * Google library if and when needed
	 *
	 * @class utils/GoogleFilesHelper
	 */
	const appDomain = `https://${app.config.appDomain}.${app.config.baseDomain}`;
	const targetOrigin = `${appDomain}/google-files-iframe`;

	let iframe;

	const GoogleFilesHelper = function() {
		this.loginInProcess = false;
		this.needsLogin = false;
		this.ready = false;
		this.browseCallback = null;

		window.onmessage = _.bind(this.onMessage, this);
	};

	_.assignIn(GoogleFilesHelper.prototype, Pipedrive.Events, {
		initialize() {
			this.loginInProcess = false;
			this.needsLogin = false;
			this.ready = false;
			this.browseCallback = null;

			Object.keys(Pipedrive.Events).forEach((key) => {
				this[key] = Pipedrive.Events[key].bind(this);
			});

			window.onmessage = _.bind(this.onMessage, this);
		},

		get loginEmail() {
			if (_.isObject(User.get('connections'))) {
				return User.get('connections').google;
			}

			return '';
		},

		/**
		 * Loads google API and authentication information without popup! The email param is optional and if none is
		 * provided it will use the user google connection
		 * @param {string} email
		 * @void
		 */
		prepareAPI(email) {
			this.createIFrame(email);
		},

		/**
		 * Log into google with popup
		 * @void
		 */
		login() {
			this.sendMessage({ message: 'auth' });

			// we need to disable loginInProcess because there is no way we can detect google popup beeing just closed
			setTimeout(
				_.bind(function() {
					this.loginInProcess = false;
					this.trigger('login');
				}, this),
				3000
			);
		},

		/**
		 * Browse files
		 *
		 * @example
		 * GoogleFiles.browseFiles(function(files) {
		 *    // Do something with `files`
		 * });
		 * @param {Function} callback
		 * @param {Object} context
		 * @void
		 */
		browseFiles(callback, context) {
			const languageCode = User.get('language').language_code;

			this.sendMessage({
				message: 'browseFiles',
				lang: languageCode === 'nb' ? 'no' : languageCode,
				// DOCS corresponds to all Google Drive document types
				fileType: context?.fileType || 'DOCS',
				mimeTypes: context?.mimeTypes
			});

			this.browseCallback = _.bind(callback, context);
		},

		// private
		createIFrame(loginEmail) {
			if (iframe) {
				return;
			}

			const email = loginEmail || this.loginEmail;

			iframe = document.createElement('IFRAME');
			iframe.setAttribute('src', `${targetOrigin}?${window.encodeURIComponent(email)}`);
			iframe.style.position = 'fixed';
			this.setHidden();
			window.document.body.appendChild(iframe);
		},

		onMessage(evt) {
			if (!evt.data || !evt.data['google~files~frame'] || evt.origin !== appDomain) {
				return;
			}

			if (evt.data.hasOwnProperty('trigger')) {
				this.forwardTrigger(evt.data.trigger);
			} else if (evt.data.hasOwnProperty('browseResult')) {
				this.setHidden();
				this.browseCallback(evt.data.browseResult);
			} else if (evt.data.pickerVisible) {
				this.setFullscreen();
			}
		},

		forwardTrigger(trigger) {
			if (trigger === 'login') {
				this.loginInProcess = true;
			} else if (trigger === 'authFail') {
				this.needsLogin = true;
				this.loginInProcess = false;
			} else if (trigger === 'authSuccess') {
				this.needsLogin = false;
				this.loginInProcess = false;
			} else if (trigger === 'ready') {
				this.ready = true;
			}

			this.trigger(trigger);
		},

		setFullscreen() {
			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.zIndex = 9999;
			iframe.style.top = 0;
		},

		setHidden() {
			iframe.style.width = '1px';
			iframe.style.height = '1px';
			iframe.style.zIndex = 1;
		},

		sendMessage(message) {
			try {
				message['google~files~parent'] = true;
				iframe.contentWindow.postMessage(message, targetOrigin);
			} catch (e) {
				// ignored
			}
		},

		openFile(type, elem, url, additionalOptions) {
			if (type === 'gform') {
				// gform on popup because of google added SAME-ORIGIN
				Helpers.openPopupInCenter(url, 1000, 650);
			} else {
				// open document in fancybox for editing
				const options = {
					width: '80%',
					height: '90%',
					type: 'iframe',
					openEffect: 'none',
					closeEffect: 'none',
					href: url,
					iframe: {
						scrolling: 'auto',
						preload: false
					}
				};

				if (additionalOptions) {
					_.merge(options, additionalOptions);
				}

				$.fancybox(elem, options);
			}
		}
	});

	return new GoogleFilesHelper();
};
