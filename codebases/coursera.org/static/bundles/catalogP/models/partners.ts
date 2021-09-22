import stringifyList from 'bundles/catalogP/lib/stringifyList';
import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Partner from 'bundles/catalogP/models/partner';

const Partners = CatalogCollection.extend({
  model: Partner,
  resourceName: 'partners.v1',

  getNamesString() {
    return stringifyList(this.models.map((model: $TSFixMe) => model.get('name')));
  },

  getUnlocalizedNamesString() {
    return stringifyList(this.models.map((model: $TSFixMe) => model.getUnlocalizedName()));
  },
});

export default Partners;
