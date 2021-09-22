import _ from 'lodash';
import moment from 'moment';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import NaptimeResource from './NaptimeResource';

class ProgramCurriculumProducts extends NaptimeResource {
  static RESOURCE_NAME = 'programCurriculumProducts.v1';

  @requireFields('productState')
  get isS12n() {
    return this.productState.typeName === 'programS12nWithState';
  }

  @requireFields('productState')
  get isCourse() {
    return this.productState.typeName === 'programCourseWithState';
  }

  @requireFields('productState')
  get isAvailable() {
    return this.productState.definition.state === 'AVAILABLE';
  }

  @requireFields('productState')
  get isUnavailable() {
    return this.productState.definition.state === 'UNAVAILABLE';
  }

  @requireFields('productState')
  get isCompleted() {
    return this.productState.definition.state === 'COMPLETED';
  }

  @requireFields('productState')
  get completedAt() {
    const { completedAt } = this.productState.definition;
    return moment(completedAt).format('LL');
  }

  @requireFields('productState')
  get isEnrolled() {
    return this.productState.definition.state === 'ENROLLED' || this.isCompleted;
  }

  @requireFields('productState')
  get isSelected() {
    return this.productState.definition.isWishlisted;
  }

  // BE issue: use this field only for truthy checking as the opposite is not always false
  @requireFields('productState')
  get isWishlisted() {
    return this.productState.definition.isWishlisted;
  }

  @requireFields('productState')
  get completionTime() {
    return this.productState.definition.completedAt;
  }

  @requireFields('productState')
  get canManage() {
    return _.includes(this.productState.definition.actions, 'MANAGE');
  }

  @requireFields('productState')
  get canSelect() {
    return this.productState.definition.isWishlisted !== undefined && !this.productState.definition.isWishlisted;
  }

  @requireFields('productState')
  get canUnselect() {
    return this.productState.definition.isWishlisted !== undefined && this.productState.definition.isWishlisted;
  }

  @requireFields('productState')
  get canEnroll() {
    return _.includes(this.productState.definition.actions, 'ENROLL');
  }

  @requireFields('productState')
  get canUnenroll() {
    return _.includes(this.productState.definition.actions, 'UNENROLL');
  }

  @requireFields('productState')
  get canResume() {
    return _.includes(this.productState.definition.actions, 'RESUME');
  }

  @requireFields('productState')
  get canUpgrade() {
    return this.isS12n && _.includes(this.productState.definition.actions, 'UPGRADE');
  }

  @requireFields('productState')
  get hasAvailableCourses() {
    const { courseStates } = this.productState.definition;
    return this.isS12n && !_.isEmpty(courseStates) && !!_.find(courseStates, { state: 'AVAILABLE' });
  }

  @requireFields('productState')
  get courseId() {
    return this.productState.definition.courseId;
  }

  @requireFields('productState')
  get s12nId() {
    return this.productState.definition.s12nId;
  }

  @requireFields('productState')
  get latestS12nId() {
    return this.productState.definition.latestS12nId;
  }

  @requireFields('productState')
  get state() {
    return this.productState.definition.state;
  }

  @requireFields('productState')
  get productId() {
    return this.s12nId || this.courseId;
  }

  @requireFields('productState')
  get hasNoOpenSessions() {
    return this.productState.definition.reasonsForState.includes('UNAVAILABLE_COURSE_NO_OPEN_SESSIONS');
  }

  @requireFields('productState')
  get s12nCourseStates() {
    return this.productState.definition.courseStates.map(
      (definition) =>
        new ProgramCurriculumProducts({
          productState: {
            definition,
            typeName: 'programCourseWithState',
          },
        })
    );
  }
}

export default ProgramCurriculumProducts;
