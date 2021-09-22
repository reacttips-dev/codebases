const formItemsTemplate = require('templates/formitems.html');
const _ = require('lodash');
const $ = require('jquery');
const compiledTemplate = _.template(formItemsTemplate);

module.exports = function(data) {
	return $.trim(compiledTemplate(_.assign({ $ }, data)).replace(/>\s+\\</g, '><)'));
};
