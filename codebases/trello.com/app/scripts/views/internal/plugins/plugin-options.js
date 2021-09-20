// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const xtend = require('xtend');
const { currentLocale } = require('@trello/locale');

module.exports = (baseOptions) => xtend(baseOptions, { locale: currentLocale });
