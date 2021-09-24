'use es6'; // These are old and predate the "filters" query param. Until we've migrated all existing
// usages to use "filters", we unfortunately have to support them.

export var SpecificPropertyFilterQueryParams = ['associatedcompanyid', 'associations.company', 'associations.contact', 'formSubmissions.formId', 'hs_parent_company_id']; // Some even older links pass a "-" in place of the "." that CrmSearch actually expects
// for these properties. Same story as above - we have to support them until they're migrated.
// This map tells us which denormalized property maps to which normalized property

export var DenormalizedPropertyFilterQueryParamMapping = {
  'associations-company': 'associations.company',
  'associations-contact': 'associations.contact',
  'formSubmissions-formId': 'formSubmissions.formId'
};
export var FiltersQueryParam = 'filters';
export var ColumnsQueryParam = 'columns';