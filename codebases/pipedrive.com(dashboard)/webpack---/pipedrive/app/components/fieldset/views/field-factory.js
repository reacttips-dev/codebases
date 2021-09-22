const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Field = require('./field');
const FieldFactory = function() {};

_.assignIn(FieldFactory.prototype, {
	baseFieldClass: Field,

	fields: {
		enum: require('./field/enum'),
		date: require('./field/date'),
		daterange: require('./field/daterange'),
		user: require('./field/user'),
		set: require('./field/set'),
		time: require('./field/time'),
		timerange: require('./field/timerange'),
		varchar: require('./field/varchar'),
		varchar_auto: require('./field/varchar-auto'),
		double: require('./field/double'),
		monetary: require('./field/monetary'),
		text: require('./field/text'),
		person: require('./field/person'),
		organization: require('./field/organization'),
		address: require('./field/address'),
		phone: require('./field/phone'),
		email: require('./field/email'),
		im: require('./field/im'),
		visible_to: require('./field/visible-to'),
		stage: require('./field/stage'),
		status: require('./field/status'),
		int: require('./field/int'),
		pipeline: require('./field/pipeline'),
		varchar_options: require('./field/varchar-options'),
		deal: require('./field/deal'),
		participants: require('./field/participants')
	},

	createClass: function(options) {
		const type = options.model.get('field_type');
		const ExtendedField = this.fields.hasOwnProperty(type)
			? this.fields[type]
			: this.baseFieldClass;

		return new ExtendedField(options);
	}
});

FieldFactory.extend = Pipedrive.View.extend;

module.exports = FieldFactory;
