import nameFormatter from './nameFormatter';
export default function (result, gates) {
  var _result$properties = result.properties,
      propertiesEmail = _result$properties.email,
      propertiesAdditionalEmails = _result$properties.additionalEmails;

  if (gates && Array.isArray(gates) && gates.indexOf('search:no_highlight') > -1) {
    return nameFormatter(Object.assign({}, result, {
      highlights: undefined
    }));
  }

  return nameFormatter(result) || result.highlights && result.highlights['email.ngrammed'] || propertiesEmail || result.highlights && result.highlights['additionalEmails.ngrammed'] || propertiesAdditionalEmails || '';
}