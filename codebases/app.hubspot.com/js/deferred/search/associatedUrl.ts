import { text } from 'unified-navigation-ui/utils/NavI18n';
export default function (_ref) {
  var url = _ref.url,
      associatedObjectName = _ref.properties.associatedObjectName;
  return {
    url: url,
    text: associatedObjectName && text('nav.search.associatedUrlText', {
      defaultValue: 'Found on {{ searchResult }}',
      searchResult: associatedObjectName
    })
  };
}