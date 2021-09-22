import Backbone from 'backbone';
import CourseOwnership from 'bundles/product/models/courseOwnership';

const CourseOwnershipCollection = Backbone.Collection.extend({
  model: CourseOwnership,

  owns(courseId: $TSFixMe) {
    const ownership = this.findWhere({ courseId });
    return !!(ownership && ownership.get('owns'));
  },
});

export default CourseOwnershipCollection;
