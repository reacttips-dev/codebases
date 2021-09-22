import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

class OnDemandCourse extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandCourses.v1';

  /**
   * Flags whether or not course is Premium Grading
   * @return {boolean} true if course is Premium Grading, false otherwise
   */
  @requireFields('premiumExperienceVariant')
  get isPremiumGrading() {
    return this.premiumExperienceVariant === 'PremiumGrading';
  }

  @requireFields('slug')
  get link() {
    return '/learn/' + this.slug;
  }

  @requireFields('slug')
  get phoenixHomeLink() {
    return path.join(this.link, 'home', 'welcome');
  }

  static bySlug(courseSlug, opts) {
    return this.finder(
      'slug',
      Object.assign(
        {
          params: {
            slug: courseSlug,
          },
        },
        opts
      ),
      (courses) => courses[0]
    );
  }
}

export default OnDemandCourse;
