const _ = require('lodash');
const Pipedrive = require('pipedrive');
const contactSync = require('utils/contact-sync');

module.exports = Pipedrive.View.extend({
	tagName: 'div',
	templateHelpers: {
		message: ''
	},
	template: _.template(`
		<% if (message) { %>
			<div class="cui4-message cui4-message--visible cui4-message--yellow cui4-message--align-center">
				<div class="cui4-message__inner">
					<div class="cui4-message__content-wrap">
						<div class="cui4-message__content cui4-text">
							<%= message  %>
						</div>
					</div>

					<button class="cui4-button cui4-button--s cui4-button--ghost cui4-message__close">
						<svg class="cui4-icon cui4-icon--s">
							<use href="#icon-sm-cross" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sm-cross"></use>
						</svg>
					</button>
				</div>
			</div>
		<% } %>
	`),

	onLoad() {
		this.onContactSyncEvent = this.onContactSyncEvent.bind(this);
		contactSync.addEventListener(this.onContactSyncEvent);
	},

	onUnload() {
		contactSync.removeEventListener(this.onContactSyncEvent);
	},

	afterRender() {
		this.$el.one('click', '.cui4-message__close', () => {
			contactSync.acknowledgeConnectionError();
		});
	},

	onContactSyncEvent(event) {
		if (event.errorCode) {
			this.templateHelpers.message = this.getErrorMessage(event.errorCode);
			this.$el.addClass('pageMessageVisible');
		} else {
			this.templateHelpers.message = '';
			this.$el.removeClass('pageMessageVisible');
		}

		this.render();
	},

	getErrorMessage(errorCode) {
		switch (errorCode) {
			case 'MissingToken':
			case 'UnauthorizedToken':
			case 'ForbiddenToken':
				return _.gettext(
					'<strong>Authentication failed in Contact Sync.</strong> Your token has expired. Please <a href="/settings/contact-sync">re-authenticate here</a>.'
				);

			case 'AccountInLoop':
				return _.gettext(
					'<strong>Multiple contacts in loop detected in Contact Sync.</strong> We have noticed an unusual loop activity in some contacts of your account. <a href="https://support.pipedrive.com/hc/articles/115005875565">Contact our support team</a>.'
				);

			case 'InvalidGroup':
				return _.gettext(
					'<strong>Invalid contact group selected for Contact Sync.</strong> Please update <a href="/settings/contact-sync">your settings here</a>.'
				);

			case 'WarmupFail':
				return _.gettext(
					'<strong>Authentication failed in Contact Sync.</strong> Your token has expired. Please <a href="/settings/contact-sync">re-authenticate here</a>.'
				);

			default:
				return '';
		}
	}
});
