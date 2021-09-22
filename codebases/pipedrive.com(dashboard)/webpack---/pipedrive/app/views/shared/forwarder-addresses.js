const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Clipboard = require('clipboard');
const User = require('models/user');
const Template = require('templates/shared/forwarder-addresses.html');
const $ = require('jquery');

module.exports = Pipedrive.View.extend(
	/** @lends views/ForwarderAddresses.prototype */
	{
		template: _.template(Template.replace(/>\s+</g, '><')),

		universalAddress: '',
		specificAddress: '',

		// localized texts, see getL10nTexts method
		text: {},

		/**
		 * Forwarder addresses as selectable inputs
		 *
		 * @class Forwarder addresses view
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @param {Object} options
		 */
		initialize: function(options) {
			this.options = options || {};

			this.applyForwarderRules();

			this.text = this.getL10nTexts(this.model.type);

			this.destroy();

			this.render();
		},

		applyForwarderRules: function() {
			const isDropbox = User.companyFeatures.get('dropbox');
			const isOnDealPage = this.model.type === 'deal';

			this.hasContent = true;

			/**
			 * For Drop-box user both universal drop-box and item specific Drop-box addresses
			 * will both be shown at person/org/deal details pages.
			 */
			if (isDropbox) {
				this.specificAddress = this.model.get('cc_email');
				this.universalAddress = User.get('cc_email');
				/**
				 * For Fred forwarder user universal Fred address will be shown at org/person details page.
				 * Both Universal and Deal specific Fred addresses will be shown at deal details page
				 */
			} else {
				// when RED-475 is done, this gets filled automatically
				this.universalAddress = User.get('cc_email');

				if (isOnDealPage) {
					this.specificAddress = this.model.get('cc_email');
				}
			}
		},

		/* eslint-disable max-len */
		getL10nTexts: function(type) {
			const texts = {
				universalTitle: _.gettext('Universal address'),
				universalTooltip: _.gettext(
					'Use your company’s one and only universal BCC address with all your emails and Pipedrive will figure out where to link those emails.'
				)
			};

			// depend on model type
			if (type === 'deal') {
				_.assignIn(texts, {
					specificTitle: _.gettext('Deal specific address'),
					specificTooltip: _.gettext(
						'When you BCC outgoing emails or forward emails to a deal-specific address, they will be linked to the corresponding deal, person and organization.'
					)
				});
			} else if (type === 'person') {
				_.assignIn(texts, {
					specificTitle: _.gettext('Person specific address'),
					specificTooltip: _.gettext(
						'When you BCC outgoing emails or forward emails to a person-specific address, they will be linked to the corresponding person.'
					)
				});
			} else if (type === 'organization') {
				_.assignIn(texts, {
					specificTitle: _.gettext('Organization specific address'),
					specificTooltip: _.gettext(
						'When you BCC outgoing emails or forward emails to a organization-specific address, they will be linked to the corresponding organization.'
					)
				});
			}

			return texts;
		},
		/* eslint-enable max-len */

		/**
		 * Render main template
		 */
		render: function() {
			if (this.hasContent) {
				this.$el.html(this.template(this));

				this.attachClickToCopy();

				this.$('.questionTooltip').each(function() {
					$(this).tooltip({
						tip: this.getAttribute('data-tooltip'),
						preDelay: 200,
						postDelay: 200,
						zIndex: 20000,
						fadeOutSpeed: 100,
						position: 'top',
						clickCloses: true
					});
				});
			} else {
				this.$el.html('');
			}
		},

		/**
		 * Adds functionality, which allows user to auto-copy text when clicking on the container
		 * @void
		 */
		attachClickToCopy: function() {
			const emailFields = this.$('input.emailField');
			const customEvent = 'showCopiedToClipboardToolTip';
			const fallbackEvent = 'showClipboardFallbackToolTip';
			const fallbackMessage = this.getFallbackCopy();

			emailFields.each(function() {
				const $input = $(this);
				const clipboard = new Clipboard(this, {
					target: function(trigger) {
						return trigger;
					}
				});

				clipboard.on(
					'success',
					_.debounce(function() {
						$input.trigger(customEvent);
					})
				);

				$input.tooltip({
					tip: $input.data('tooltip-hover'),
					position: 'top-end'
				});
				$input.tooltip({
					tip: $input.data('tooltip-click'),
					position: 'top-end',
					preDelay: 0,
					postDelay: 3000,
					customEvent
				});

				if (fallbackMessage) {
					clipboard.on(
						'error',
						_.debounce(function() {
							$input.trigger(fallbackEvent);
						})
					);

					$input.tooltip({
						tip: fallbackMessage,
						position: 'top-end',
						preDelay: 0,
						postDelay: 3000,
						customEvent: fallbackEvent
					});
				}
			});

			emailFields
				.on('focus mousedown', function() {
					$(this).select();
				})
				.on('mouseup', function(ev) {
					ev.preventDefault();
				});
		},

		getFallbackCopy: function() {
			const userAgent = navigator.userAgent;

			if (/iPhone|iPad/i.test(userAgent)) {
				return;
			}

			let key = 'Ctrl';

			if (/Mac/i.test(userAgent)) {
				key = '⌘';
			}

			return _.gettext('Press %s-C to copy', [key]);
		}
	}
);
