const _ = require('lodash');
const PlainFieldWrapper = require('../components/fields/plain-field');
const ContactFieldWrapper = require('../components/fields/contact-field');
const PhoneFieldWrapper = require('../components/fields/phone-field');
const LinkFieldWrapper = require('../components/fields/link-field');
const CompositeTypeSubjectFieldWrapper = require('../components/fields/composite-type-subject-field');
const UserFieldWrapper = require('../components/fields/user-field');
const SetFieldWrapper = require('../components/fields/set-field');
const ActivityDoneFieldWrapper = require('../components/fields/activity-done-field');
const ParticipantsFieldWrapper = require('../components/fields/participants-field');
const AttendeesFieldWrapper = require('../components/fields/attendees-field');
const ColoredLabelField = require('../components/fields/colored-label-field');
const ColoredLabelSetField = require('../components/fields/colored-label-set-field');
const MonetaryValueProducer = require('../components/fields/value-producers/monetary');
const NumericValueProducer = require('../components/fields/value-producers/numeric');
const DateValueProducer = require('../components/fields/value-producers/date');
const DateRangeValueProducer = require('../components/fields/value-producers/daterange');
const TimeValueProducer = require('../components/fields/value-producers/time');
const TimeRangeValueProducer = require('../components/fields/value-producers/timerange');
const EmailValueProducer = require('../components/fields/value-producers/email');
const PhoneValueProducer = require('../components/fields/value-producers/phone');
const RelatedModelValueProducer = require('../components/fields/value-producers/related-model');
const VarcharValueProducer = require('../components/fields/value-producers/varchar');
const TextValueProducer = require('../components/fields/value-producers/text');
const RichTextValueProducer = require('../components/fields/value-producers/rich-text');
const CompositeDateTimeValueProducer = require('../components/fields/value-producers/composite-datetime');
const CompositeDateValueProducer = require('../components/fields/value-producers/composite-date');
const PipelineValueProducer = require('../components/fields/value-producers/pipeline');
const StageValueProducer = require('../components/fields/value-producers/stage');
const EnumValueProducer = require('../components/fields/value-producers/enum');
const InstantMessengerValueProducer = require('../components/fields/value-producers/instant-messenger');
const AddressValueProducer = require('../components/fields/value-producers/address');
const DurationValueProducer = require('../components/fields/value-producers/duration');
const LinkTextValueProducer = require('../components/fields/value-producers/link-text');
const fieldTypeCalculator = require('./field-type-calculator');
const fieldWrappers = {
	'compositeTypeSubject': CompositeTypeSubjectFieldWrapper,
	'user': UserFieldWrapper,
	'set': SetFieldWrapper,
	'activityDone': ActivityDoneFieldWrapper,
	'participants': ParticipantsFieldWrapper,
	'attendees': AttendeesFieldWrapper,
	'enum:label': ColoredLabelField,
	'set:labels': ColoredLabelSetField
};
const plainFields = {
	monetary: MonetaryValueProducer,
	int: NumericValueProducer,
	double: NumericValueProducer,
	date: DateValueProducer,
	daterange: DateRangeValueProducer,
	time: TimeValueProducer,
	timerange: TimeRangeValueProducer,
	text: LinkTextValueProducer,
	currency: TextValueProducer,
	varchar_auto: LinkTextValueProducer,
	varchar_options: TextValueProducer,
	compositeDateTime: CompositeDateTimeValueProducer,
	compositeDate: CompositeDateValueProducer,
	pipeline: PipelineValueProducer,
	stage: StageValueProducer,
	enum: EnumValueProducer,
	status: EnumValueProducer,
	visible_to: EnumValueProducer,
	duration: DurationValueProducer,
	activityNote: RichTextValueProducer
};
const contactFields = {
	email: EmailValueProducer,
	im: InstantMessengerValueProducer
};
const phoneFields = {
	phone: PhoneValueProducer
};
const linkFields = {
	person: RelatedModelValueProducer,
	organization: RelatedModelValueProducer,
	deal: RelatedModelValueProducer,
	lead: RelatedModelValueProducer,
	varchar: VarcharValueProducer,
	address: AddressValueProducer
};
const FieldWrapperFactory = {
	setFieldWrapper(props, model, field, fieldType) {
		if (!model) {
			props.visualRenderer = _.constant('');

			return PlainFieldWrapper;
		} else if (fieldWrappers.hasOwnProperty(`${fieldType}:${field.key}`)) {
			return fieldWrappers[`${fieldType}:${field.key}`];
		} else if (fieldWrappers.hasOwnProperty(fieldType)) {
			return fieldWrappers[fieldType];
		} else if (plainFields.hasOwnProperty(fieldType)) {
			props.visualRenderer = plainFields[fieldType];

			return PlainFieldWrapper;
		} else if (contactFields.hasOwnProperty(fieldType)) {
			props.visualRenderer = contactFields[fieldType];

			return ContactFieldWrapper;
		} else if (phoneFields.hasOwnProperty(fieldType)) {
			props.visualRenderer = phoneFields[fieldType];

			return PhoneFieldWrapper;
		} else if (linkFields.hasOwnProperty(fieldType)) {
			props.visualRenderer = linkFields[fieldType];
			props.fieldType = fieldType;

			return LinkFieldWrapper;
		}

		return null;
	},

	detectValueRenderer(model, field) {
		const props = {};
		const fieldType = fieldTypeCalculator.detectFieldType({ model, field });

		const fieldWrapper = this.setFieldWrapper(props, model, field, fieldType);

		if (!fieldWrapper) {
			throw new Error(`Unable to detect fieldWrapper for field type ${fieldType}`);
		}

		return { ValueWrapper: fieldWrapper, props };
	}
};

module.exports = FieldWrapperFactory;
