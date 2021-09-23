'use es6'; // For more details about why we use this format see:
// https://product.hubteam.com/docs/crm-search/faqs.html#how-do-i-search-for-associated-objects
//
// It's worth calling out here that we do not support the old format of
// associations.<objectType> (i.e. associations.contact) because it's not
// compatible with flexible associations, so while those pseudo properties will
// work in search we explicitly decided not to support them in the table.

var GenericAssociationRegex = /^associations\.[0-9]+-[0-9]+$/;
export var isGenericAssociation = function isGenericAssociation(columnName) {
  return GenericAssociationRegex.test(columnName);
};