const _ = require('lodash');

module.exports = {
	default: _.gettext(
		'We’re sorry, but the message can’t be sent right now.' +
			' Please try again. If the problem persists, contact our customer support.'
	),
	4042: {
		default: _.gettext(
			'It looks like there may be a typo in at least one email address in your message.' +
				' Please check before trying to send your email again.'
		)
	},
	4049: {
		default: _.gettext(
			'It appears that one of the attached files is larger than your email' +
				" provider supports. Please check your email provider's restrictions."
		)
	},
	7007: {
		gmail: _.gettext(
			"Your message exceeded Google's message size limits." +
				" Please visit https://support.google.com/mail/?p=MaxSizeError to review Google's attachment limit guidelines."
		),
		default: _.gettext(
			"Your message exceeded your mail provider's message size limit." +
				' Please remove some files from your message before trying to send it again.' +
				" For more information about size limits visit your provider's support page."
		)
	},
	7010: {
		default: _.gettext(
			"You have exceeded your mail provider's sending quota." +
				' Unfortunately there is no reliable way to determine these limits. Wait a bit and try again later.'
		)
	},
	7020: {
		default: _.gettext('Please check this email addresses for unsupported characters')
	},
	7103: {
		gmail: _.gettext(
			'Couldn’t send the email. Please make sure the attachments don’t exceed 25 MB and try again.'
		),
		default: _.gettext(
			"Your message exceeded your mail provider's message size limit." +
				' Please remove some files from your message before trying to send it again.' +
				" For more information about size limits visit your provider's support page."
		)
	}
};
