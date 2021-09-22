const RelatedModelField = require('./related-model');
const _ = require('lodash');
const Template = require('../../templates/field/person.html');

module.exports = RelatedModelField.extend({
	type: 'organization',
	displayAttr: 'name',
	template: _.template(Template)
});
