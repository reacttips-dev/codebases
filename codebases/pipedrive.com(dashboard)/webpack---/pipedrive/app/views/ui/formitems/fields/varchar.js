const template = require('../template');
const _ = require('lodash');
const createLoadCallback = require('../create-load-callback');
const $ = require('jquery');

module.exports = function(opts) {
	const options = _.assignIn(
		{
			field_type: 'varchar',
			uuid: `text-${_.makeid()}`
		},
		opts
	);

	if (opts.inlineLabel) {
		options.loadCallback = `async_${_.makeid()}`;
		createLoadCallback(options.loadCallback, function() {
			const $p = $(`#${options.uuid}`).siblings('.label:visible');

			if ($p.length) {
				$(`#${options.uuid}`).css({
					'padding-left': $p.outerWidth() + 10
				});
			} else {
				$(`#${options.uuid}`).one('focus.formitem', function() {
					const $p = $(`#${options.uuid}`).siblings('.label:visible');

					if ($p.length) {
						$(`#${options.uuid}`).css({
							'padding-left': $p.outerWidth() + 10
						});
					}
				});
			}
		});
	}

	return template({ input: options });
};
