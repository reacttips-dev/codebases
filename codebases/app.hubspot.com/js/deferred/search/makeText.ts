export default function (obj, result, gates) {
  var highlights = result.highlights,
      resultType = result.resultType,
      properties = result.properties;

  if (typeof obj[resultType] === 'function') {
    return obj[resultType](result, gates);
  }

  if (gates && gates.indexOf('search:no_highlight') > -1) {
    return properties[obj[resultType]] || '';
  } else {
    return result && highlights && highlights[obj[resultType] + ".ngrammed"] || result && highlights && highlights['content'] || properties[obj[resultType]] || '';
  }
}