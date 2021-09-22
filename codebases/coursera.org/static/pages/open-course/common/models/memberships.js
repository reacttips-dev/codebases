import Backbone from 'backbone';
import Membership from 'pages/open-course/common/models/membership';

const MembershipCollection = Backbone.Collection.extend({
  model: Membership,

  getEnrolled() {
    return this.filter(function (membership) {
      return membership.get('courseRole') !== Membership.NOT_ENROLLED;
    });
  },
});

export default MembershipCollection;
