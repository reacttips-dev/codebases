'use es6';

import I18n from 'I18n';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
export var defaultEnumOptionFormatter = function defaultEnumOptionFormatter(record) {
  var option = Object.assign({}, ReferenceRecord.toOption(record));

  if (record.archived) {
    // Archived takes precedence over the description
    option.help = I18n.text('customerDataReferenceUiComponents.archived');
  }

  return option;
};