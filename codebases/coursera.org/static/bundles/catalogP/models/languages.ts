import stringifyList from 'bundles/catalogP/lib/stringifyList';
import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Language from 'bundles/catalogP/models/language';

const Languages = CatalogCollection.extend({
  model: Language,
  resourceName: 'languages.v1',

  getLanguagesString() {
    return stringifyList(this.pluck('name'));
  },
});

export default Languages;
