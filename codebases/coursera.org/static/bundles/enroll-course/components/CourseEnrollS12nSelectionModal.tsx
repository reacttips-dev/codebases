import classNames from 'classnames';
import Naptime from 'bundles/naptimejs';
import React from 'react';
import Select, { OnChangeSingleHandler } from 'react-select';
import { compose, branch, renderNothing } from 'recompose';
import _ from 'lodash';
import { color } from '@coursera/coursera-ui';
import { SvgChevronUp, SvgChevronDown } from '@coursera/coursera-ui/svg';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { getS12nOrder } from 'bundles/enroll/utils/mixAndMatchUtils';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import TrackedButton from 'bundles/page/components/TrackedButton';
import Modal from 'bundles/phoenix/components/Modal';
import getS12nProductLabels from 'bundles/s12n-common/constants/s12nProductLabels';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/enroll';

import 'css!./__styles__/CourseEnrollS12nSelectionModal';

type InputProps = {
  courseId: string;
  s12nIds: string[];
  onClose: (event?: React.MouseEvent<HTMLElement>) => void;
  onSubmit: (selectedS12nId: string) => void;
  isTerminal: boolean;
  altMessageGenerator?: (courseName: string) => React.ReactNode;
};

type Props = InputProps & {
  course: CoursesV1;
  s12ns: Array<OnDemandSpecializationsV1>;
  s12nCourses: Array<CoursesV1>;
};

type State = {
  selectedS12nId: string;
};

class CourseEnrollS12nSelectionModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { course, s12ns } = props;
    this.state = {
      selectedS12nId: getS12nOrder(course.id, s12ns)[0].id,
    };
  }

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { selectedS12nId } = this.state;
    onSubmit(selectedS12nId);
  };

  onChange: OnChangeSingleHandler<string> = (newValue) => {
    const value = newValue?.value;
    if (value) {
      this.setState(() => ({ selectedS12nId: value }));
    }
  };

  renderArrow({ isOpen }: { isOpen: boolean }) {
    const props = {
      size: 24,
      style: { verticalAlign: 'bottom' },
      color: color.primary,
    };

    return isOpen ? <SvgChevronUp {...props} /> : <SvgChevronDown {...props} />;
  }

  render() {
    const { course, s12ns, s12nCourses, onClose, isTerminal, altMessageGenerator } = this.props;
    const { selectedS12nId } = this.state;
    const { SPECIALIZATION_LABEL, PROFESSIONAL_CERTIFICATE_LABEL } = getS12nProductLabels();
    const selectedS12n = s12ns.find(({ id }) => id === selectedS12nId);
    const orderedS12ns = getS12nOrder(course.id, s12ns).filter((s12n) => s12n && s12n.id);

    return (
      <div className="rc-CourseEnrollS12nSelectionModal">
        <CSSTransitionGroup transitionName="fade" transitionEnter={false} transitionLeaveTimeout={300}>
          <Modal
            trackingName="course_enroll_s12n_selection_modal"
            key="CourseEnrollS12nSelectionModal"
            modalName={_t('Choose a program')}
            handleClose={onClose}
          >
            <div className="s12n-selection-modal-container m-t-1s">
              {!isTerminal && <strong>{_t('Step 1 of 2')}</strong>}
              <p className="headline-5-text punch-line">{_t('Choose a program')}</p>
              <p>
                {altMessageGenerator ? (
                  altMessageGenerator(course.name)
                ) : (
                  <FormattedMessage
                    message={_t(`You're enrolling in {courseName}, which is available as part of multiple learning programs.
                    These programs are designed to help you become job ready or master a skill.
                    Select the program that is right for you from the list below.`)}
                    courseName={<strong>{course.name}</strong>}
                  />
                )}
              </p>
              {orderedS12ns && (
                <Select
                  id="s12n-selection-dropdown"
                  onChange={this.onChange}
                  value={selectedS12nId}
                  options={orderedS12ns.map((s12n) => {
                    const productName = s12n.name;
                    const productType = s12n.isProfessionalCertificate
                      ? PROFESSIONAL_CERTIFICATE_LABEL
                      : SPECIALIZATION_LABEL;

                    return {
                      label: _t('#{productName} #{productType}', {
                        productName,
                        productType,
                      }),
                      value: s12n.id,
                    };
                  })}
                  arrowRenderer={this.renderArrow}
                  searchable={false}
                  clearable={false}
                />
              )}
              {selectedS12n && (
                <div className="m-t-1">
                  <p className="m-y-0">
                    <FormattedMessage
                      message={_t('There are {numCourses} courses in this program')}
                      numCourses={selectedS12n.courseIds.length}
                    />
                  </p>
                  <ul>
                    {selectedS12n.courseIds.map((courseId, i) => {
                      const s12nCourse = s12nCourses.find(({ id }) => id === courseId);
                      const courseItemClass = classNames('course-item m-t-1s', {
                        'is-enrolling-in-course': course.id === courseId,
                      });
                      return (
                        s12nCourse && (
                          <li key={courseId} className={courseItemClass}>
                            <FormattedMessage
                              message={_t('Course {courseNumber}: {courseName}')}
                              courseNumber={i + 1}
                              courseName={s12nCourse.name}
                            />
                          </li>
                        )
                      );
                    })}
                  </ul>
                </div>
              )}
              <TrackedButton
                trackingName="course_enroll_s12n_selection_button"
                data={{ courseId: course.id, s12nId: selectedS12nId }}
                className="primary cozy m-y-1"
                onClick={this.handleSubmit}
              >
                {isTerminal ? _t('Continue') : _t('Next')}
              </TrackedButton>
            </div>
          </Modal>
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default compose<Props, InputProps>(
  Naptime.createContainer<Pick<Props, 's12ns' | 'course'>, InputProps>(({ courseId, s12nIds }) => ({
    course: CoursesV1.get(courseId, {
      fields: ['id', 'name'],
    }),
    s12ns: OnDemandSpecializationsV1.multiGet(s12nIds, {
      fields: ['id', 'name', 'courseIds', 'productVariant'],
    }),
  })),
  branch<Props>(({ s12ns, s12nIds }) => _.isEmpty(s12ns) || s12ns.length !== s12nIds.length, renderNothing),
  Naptime.createContainer<Pick<Props, 's12nCourses'>, InputProps & Pick<Props, 's12ns'>>(({ s12ns }) => {
    const courseIds = _.reduce(s12ns, (allCourseIds, s12n) => allCourseIds.concat(s12n.courseIds), [] as string[]);
    return {
      s12nCourses: CoursesV1.multiGet(courseIds, {
        fields: ['id', 'name'],
      }),
    };
  }),
  branch<Props>(({ s12nCourses }) => _.isEmpty(s12nCourses), renderNothing)
)(CourseEnrollS12nSelectionModal);
