import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';

import PRODUCT_VARIANT from 'bundles/s12n-common/constants/s12nProductVariants';
import { CmlContent } from 'bundles/cml/types/Content';

import config from 'js/app/config';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

class OnDemandSpecialization extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandSpecializations.v1';

  // TODO(qtran) Type all the fields
  // These properties are always included.
  description!: string;

  name!: string;

  tagline!: string;

  id!: string;

  slug!: string;

  premiumExperienceVariant!: string;

  // These properties must be requested.
  metadata?: {
    headline?: string;
    subheader?: string;
    certificateLogo?: string;
    certificateDescription?: string;
    headerImage?: string;
    incentives?: string;
  };

  partnerIds!: Array<string>;

  logo!: string;

  capstone?: {
    courseIds: Array<string>;
  };

  courseIds!: Array<string>;

  versionDescription?: CmlContent;

  launchedAt!: number;

  productVariant!: keyof typeof PRODUCT_VARIANT;

  @requireFields('slug')
  get link() {
    return path.join('/', 'specializations', this.slug);
  }

  @requireFields('link')
  get fullLink() {
    return path.join(config.url.base, this.link);
  }

  /**
   * Suitable for icon display, across all "offering" resource types
   * @return {String} URL to an icon representing this offering
   */
  @requireFields('logo')
  get iconSrc() {
    return this.logo;
  }

  @requireFields('capstone')
  get hasCapstone() {
    return this.capstone && this.capstone.courseIds.length > 0;
  }

  @requireFields('capstone')
  get capstoneIds() {
    return (this.capstone && this.capstone.courseIds) || [];
  }

  /**
   * Returns the number of courses in the specialization, not including capstone
   * @return {int} number of courses
   */
  @requireFields('courseIds', 'capstone')
  get courseCount() {
    const capstoneProjectCount = (this.capstone && this.capstone.courseIds.length) || 0;
    const courseCount = (this.courseIds && this.courseIds.length) || 0;
    return courseCount - capstoneProjectCount;
  }

  /**
   * Returns the number of courses in the specialization, including capstone
   * @return {int} number of courses
   */
  @requireFields('courseIds')
  get courseCountWithCapstones() {
    return (this.courseIds && this.courseIds.length) || 0;
  }

  @requireFields('capstone', 'courseIds')
  get capstoneProjectCount() {
    return this.capstone && this.capstone.courseIds.length;
  }

  @requireFields('productVariant')
  get isProfessionalCertificate(): boolean {
    if (typeof this.productVariant === 'undefined') {
      throw new Error('Could not determine specialization product variant');
    }

    return this.productVariant === PRODUCT_VARIANT.ProfessionalCertificateS12n;
  }

  @requireFields('launchedAt')
  get isPublic() {
    return this.launchedAt && this.launchedAt <= Date.now();
  }

  /**
   * Returns the minimum length string that is 1) 60+ characters and 2) a full sentence.
   */
  @requireFields('description')
  get desc60() {
    const descLen = 60;
    if (this.description && this.description.length > descLen && this.description.indexOf('.', descLen) !== -1) {
      return this.description.slice(0, this.description.indexOf('.', descLen) + 1);
    } else {
      return this.description;
    }
  }

  /**
   * Flags whether or not s12n is Premium Grading
   * @return {boolean} true if s12n is Premium Grading, false otherwise
   */
  @requireFields('premiumExperienceVariant')
  get isPremiumGrading() {
    return this.premiumExperienceVariant === 'PremiumGrading';
  }

  static specializationsByCourse({ courseId, fields = [] }: { courseId: string; fields?: string[] }) {
    return this.finder('course', {
      params: {
        courseId,
        fields,
      },
    });
  }

  static bySlug(slug: string, options: object = {}) {
    return this.finder(
      'slug',
      Object.assign(
        {
          params: { slug },
        },
        options
      ),
      (s12ns) => s12ns[0]
    );
  }

  static primary(userId: number | string, courseId: string, options?: object) {
    const params = Object.assign(userId ? { userId } : {}, { courseId });
    return this.finder(
      'primary',
      Object.assign({ params }, options),
      // When the s12n doesn't exist, we must make sure to return `null` instead of `undefined` because naptimeJS
      // treats `undefined` as "data not yet loaded".
      (s12ns) => s12ns[0] || null
    );
  }

  static latestInFamilies({ s12nIds, fields }: { s12nIds: string[]; fields: string[] }) {
    return this.finder('latestInFamilies', {
      params: { s12nIds, fields },
    });
  }
}

export default OnDemandSpecialization;
