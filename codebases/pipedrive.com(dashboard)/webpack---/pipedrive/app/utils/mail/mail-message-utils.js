const moment = require('moment');
const _ = require('lodash');
const $ = require('jquery');
const componentLoader = require('webapp-component-loader');

/**
 * Contains some methods that MailMessage and MailMessage-like (MailFiles in flow) classes use
 */

const MailMessageUtils = function() {};

_.assignIn(MailMessageUtils.prototype, {
	/**
	 * Returns a HTML-string which contains links of the participants
	 *
	 * @param  {Array} partiesList 	List of objects of party datas
	 * @param  {Boolean} withEmail 	Should it return party link with email after the name or not
	 * @return {String}
	 */
	getPartiesLinks: function(partiesList, withEmail) {
		const $links = $('<div>');

		_.forEach(
			partiesList,
			_.bind(function(partyData) {
				$links.append(this.getPartyLink(partyData, withEmail));
			}, this)
		);

		if (withEmail) {
			$links.find('span.recipient:not(:last)').after(', ');
		} else {
			$links.find('a:not(:last)').after(', ');
		}

		return $links.html();
	},

	/**
	 * Creates a party link to be placed into the DOM
	 *
	 * @param  {Object} partyData
	 * @param  {Boolean} withEmail 	Whether to just display the name or the name with the email address
	 * @return {Object} A jQuery element
	 */
	getPartyLink: function(partyData, withEmail) {
		const $link = $('<a href="#" class="party">')
			.attr('data-party-id', partyData.id)
			.text(this.getPartyDisplayName(partyData));

		if (withEmail) {
			const $partyEl = $('<span class="recipient">');
			const $email = $(
				`<span class="recipientDetailEmail"> ${_.escape(partyData.email_address)}</span>	`
			);

			$partyEl.append($link).append($email);

			return $partyEl;
		} else {
			return $link;
		}
	},

	/**
	 * Return display name for a single party
	 *
	 * @param  {Object} partyData party related data
	 * @return {String}           party name or if it's not provided then the first part of the email address
	 */
	getPartyDisplayName: function(partyData) {
		return (
			partyData.linked_person_name || partyData.name || partyData.email_address.split('@')[0]
		);
	},

	/**
	 * Composes a string that represents mail message time
	 * If message is sent on the same day it will show the message time in 'h:mm A' format
	 * Otherwise time will be presented as date 'MMM DD' format
	 * Also relative time is appended to the message time (in parentheses)
	 *
	 * @param {String} messageTime 	Timestamp
	 * @return {String} Html string
	 */
	getMessageTimeString: function(messageTime) {
		const messageTimeStamp = moment.utc(messageTime).local();
		const todaysDate = moment.utc().local();
		const isNotCurrentYear = todaysDate.diff(messageTimeStamp, 'years') > 0;
		const format = moment().isSame(messageTimeStamp, 'day') ? 'LT' : 'pd_day_month';
		const time = messageTimeStamp.format(format);
		const isInPast = moment().diff(messageTimeStamp, 'ms') > 0;
		const relativeTime = _.gettext(
			'%s ago',
			_.interactiveTimestamp(messageTimeStamp, 'relative')
		);

		return `${time} ${isNotCurrentYear ? messageTimeStamp.year() : ''} ${
			isInPast ? `(${relativeTime})` : ''
		}`;
	},

	/**
	 * Handles the click on a party link
	 *
	 * @param  {Object} ev jQuery event object
	 * @void
	 */
	onPartyClicked: function(ev, mailModel, trackingData) {
		ev.preventDefault();
		ev.stopPropagation();

		const partyId = $(ev.currentTarget).data().partyId;
		const partyModel = mailModel.partyModelsHandler.getById(partyId);

		trackingData = _.assignIn(trackingData, {
			mail_thread_id: mailModel.get('mail_thread_id')
		});

		this.openBusinesscard(ev, partyModel, trackingData);
	},

	openBusinesscard: async function(ev, partyModel, trackingData) {
		const popover = await componentLoader.load('webapp:popover');
		const bCardOpts = {
			target: ev.currentTarget,
			position: 'bottom-start',
			trackingData
		};

		_.assignIn(bCardOpts, this.convertPartyToBcardData(partyModel));

		popover.open({
			popover: 'businesscard',
			params: {
				...bCardOpts
			}
		});
	},

	convertPartyToBcardData: function(partyModel) {
		return {
			person_id: partyModel.get('linked_person_id'),
			name: partyModel.getName(),
			email: partyModel.get('email_address')
		};
	},

	getMessageTimeTooltip: function(time) {
		return _.capitalize(
			moment
				.utc(time)
				.local()
				.format('LLLL')
		);
	}
});

module.exports = new MailMessageUtils();
