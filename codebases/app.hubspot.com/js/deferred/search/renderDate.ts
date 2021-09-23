import dateFormatter from './dateFormatter';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export default function (_ref) {
  var updatedAt = _ref.updatedAt,
      closeDate = _ref.properties.closeDate;
  var dateRaw = "" + (updatedAt || closeDate);
  var date = isNaN(parseInt(dateRaw, 10)) ? dateRaw : dateFormatter.format(parseInt(dateRaw, 10));

  if (!dateRaw) {
    return '';
  }

  return text('nav.search.lastModifiedDateNew', {
    defaultValue: 'Last modified date: {{ date }}',
    date: date
  });
}