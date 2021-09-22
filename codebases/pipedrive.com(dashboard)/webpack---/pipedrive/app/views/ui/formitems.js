const _ = require('lodash');

require('jquery.timepicker');

const Pipedrive = require('pipedrive');
const logger = new Pipedrive.Logger('widget', 'formitems');

// Supported custom fields
/** @lends views/ui/FormItems.prototype */

const fields = {
	// General
	'button': require('./formitems/fields/button'),
	'radio': require('./formitems/fields/radio'),
	'checkbox': require('./formitems/fields/checkbox'),
	'switch': require('./formitems/fields/switch'),
	'varchar': require('./formitems/fields/varchar'),
	'text': require('./formitems/fields/text'),
	'numeric': require('./formitems/fields/numeric'),
	'set': require('./formitems/fields/set'),
	'enum': require('./formitems/fields/enum'),
	'select': require('./formitems/fields/select'),

	// Time
	'date': require('./formitems/fields/date'),
	'inlineDate': require('./formitems/fields/date'),
	'time': require('./formitems/fields/time'),
	'composite-date-time': require('./formitems/fields/composite-date-time'),

	// Money
	'monetary': require('./formitems/fields/monetary'),

	// Autocomplete
	'varchar_auto': require('./formitems/fields/varchar-auto'),
	'person': require('./formitems/fields/varchar-auto-extended').person,
	'organization': require('./formitems/fields/varchar-auto-extended').organization,
	'deal': require('./formitems/fields/varchar-auto-extended').deal,
	'address': require('./formitems/fields/address'),
	'varcharMultipleOptions': require('./formitems/fields/varchar-multiple-options'),

	// Stages
	'plainStages': require('./formitems/fields/plain-stages'),
	'stage': require('./formitems/fields/stage'),

	// Contact fields
	'contact': require('./formitems/fields/contact'),
	'phone': require('./formitems/fields/phone'),
	'email': require('./formitems/fields/email'),
	'im': require('./formitems/fields/im'),

	// Not categorized
	'emailPicker': require('./formitems/fields/email-picker'),
	'user': require('./formitems/fields/user'),
	'visible_to': require('./formitems/fields/visible-to'),
	'varchar_options': require('./formitems/fields/varchar-options'),
	'radioList': require('./formitems/fields/radio-list')
};

// Aliases
fields.status = fields.select;
fields.enum = fields.switch;
fields.daterange = fields.date;
fields.timerange = fields.time;
fields.textarea = fields.text;
fields.default = fields.varchar;
fields.participants = fields.varcharMultipleOptions;
fields.autocomplete = fields.search = fields.varchar_auto;
fields.double = fields.int = fields.numeric;

const formItems = _.assignIn(fields, {
	object: function(o, cfg) {
		if (!_.isObject(o) || _.isEmpty(o)) {
			return '';
		}

		if (!(o.field_type in fields)) {
			logger.log('No renderer for', o.field_type);
			o.field_type = 'default';
		}

		// Remove _.clone when all formitems methods have been reviewd
		return fields[o.field_type](_.clone(o), _.clone(cfg));
	}
});

_.assignIn(_, { form: formItems });

module.exports = formItems;
