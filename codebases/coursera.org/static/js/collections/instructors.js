import Backbone from 'backbone';
import Instructor from 'js/models/instructor';

const Instructors = Backbone.Collection.extend({
  model: Instructor,

  byLastName() {
    return new Instructors(
      this.sortBy(function (t) {
        return t.get('last_name');
      })
    );
  },
});

export default Instructors;
