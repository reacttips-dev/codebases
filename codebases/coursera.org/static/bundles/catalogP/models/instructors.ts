import stringifyList from 'bundles/catalogP/lib/stringifyList';
import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Instructor from 'bundles/catalogP/models/instructor';

const Instructors = CatalogCollection.extend({
  model: Instructor,
  resourceName: 'instructors.v1',

  getNamesString() {
    return stringifyList(this.invoke('getFullName'));
  },
});

export default Instructors;
