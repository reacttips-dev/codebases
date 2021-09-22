import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import CourseList from 'bundles/catalogP/models/courseList';

const CourseListCollection = CatalogCollection.extend({
  model: CourseList,
  resourceName: 'courseLists.v1',
});

export default CourseListCollection;
