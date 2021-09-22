import PropTypes from 'prop-types';
import React from 'react';
import { mapProps } from 'recompose';
import _ from 'underscore';
import TrackedButton from 'bundles/page/components/TrackedButton';
import Course from 'bundles/catalogP/models/course';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Group from 'bundles/groups/models/Group';
import CourseRoles from 'bundles/common/constants/CourseRoles';
import Icon from 'bundles/iconfont/Icon';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
import * as enrollment from 'bundles/s12n-enroll/components/lib/enrollment';
import { getAvailablePrograms } from 'bundles/s12n-enroll/components/lib/programClient';
import { getAvailableGroups } from 'bundles/s12n-enroll/components/lib/groupClient';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/s12n-enroll';
import PaymentChoiceSingle from './PaymentChoiceSingle';
import PaymentChoiceGroup from './PaymentChoiceGroup';
import PaymentChoiceProgram from './PaymentChoiceProgram';
import PaymentChoiceFull from './PaymentChoiceFull';
import PaymentChoiceFree from './PaymentChoiceFree';
import PaymentChoiceCapstone from './PaymentChoiceCapstone';
import 'css!./__styles__/PaymentChoices';

const PaymentChoiceTypes = {
  PROGRAM: 'program',
  GROUP: 'group',
  FULL: 'full',
  SINGLE: 'single',
  FREE: 'free',
};

class PaymentChoices extends React.Component {
  static propTypes = {
    enrollmentAvailableChoices: PropTypes.instanceOf(EnrollmentAvailableChoicesV1).isRequired,
    title: PropTypes.string.isRequired,
    showFreeOption: PropTypes.bool,
    onFreeEnroll: PropTypes.func,
    onEnrollSuccess: PropTypes.func,
    onEnrollFailure: PropTypes.func,
    isPreEnroll: PropTypes.bool,
    onSdp: PropTypes.bool,
    showEnrollThroughProgram: PropTypes.bool,
    showEnrollThroughGroup: PropTypes.bool,
    showBulkPay: PropTypes.bool,
  };

  static contextTypes = {
    course: PropTypes.instanceOf(Course),
    userS12n: PropTypes.instanceOf(UserS12n),
  };

  static childContextTypes = {
    uniqueRadioName: PropTypes.string,
  };

  static defaultProps = {
    onFreeEnroll: () => {},
    showFreeOption: false,
    showBulkPay: false,
  };

  state = {
    enrolling: false,
    showErrorMessage: false,
    currentSelectedType: this.getInitialSelectedType(),
  };

  getChildContext() {
    // Needed in case there are multiple enrollment modals. Each enrollment modal
    // needs unique names on their set of radio buttons so they can be grouped
    // by modal and not all together
    return { uniqueRadioName: _.uniqueId() };
  }

  constructor(props: $TSFixMe, context: $TSFixMe) {
    super(props);
    this.context = context;
    if (props.showEnrollThroughProgram) {
      getAvailablePrograms(context.userS12n.metadata.id)
        .then(({ program, thirdPartyOrganization }) => {
          this.setState(() => ({ program, thirdPartyOrganization }));
        })
        .done();
    }

    if (props.showEnrollThroughGroup) {
      getAvailableGroups(context.userS12n.metadata.id)
        .then((response) => this.setState({ group: new Group(response[0]) }))
        .done();
    }
  }

  handleClickEnroll = (ev: $TSFixMe) => {
    ev.stopPropagation();
    const selectedType = this.state.currentSelectedType;
    const { course, userS12n } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type '{ enrol... Remove this comment to see the full error message
    const { program, group } = this.state;
    const courseId = course.get('id');

    if (selectedType) {
      this.setState({
        enrolling: true,
        showErrorMessage: false,
      });
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      const promise = {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'isPreEnroll' does not exist on type 'Rea... Remove this comment to see the full error message
        free: this.props.isPreEnroll
          ? enrollment.freeEnroll(CourseRoles.PRE_ENROLLED_LEARNER, courseId)
          : enrollment.freeEnroll(CourseRoles.LEARNER, courseId),
        single: enrollment.singleEnroll(courseId),
        full: enrollment.fullEnroll(userS12n.metadata.id, courseId),
        program: enrollment.programEnroll(userS12n.metadata.id, program && program.id),
        group: enrollment.groupEnroll(userS12n.metadata.id, group && group.id),
      }[selectedType].call(this);

      // Not all enrollment factory functions return a promise. Some return undefined.
      if (promise) {
        if (
          selectedType === PaymentChoiceTypes.FREE ||
          selectedType === PaymentChoiceTypes.PROGRAM ||
          selectedType === PaymentChoiceTypes.GROUP
        ) {
          this.setState({ enrolling: true });
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'onFreeEnroll' does not exist on type 'Re... Remove this comment to see the full error message
          promise.then(this.props.onFreeEnroll);
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onEnrollSuccess' does not exist on type ... Remove this comment to see the full error message
        promise.then(this.props.onEnrollSuccess, this.props.onEnrollFailure).done();
      } else if (
        selectedType === PaymentChoiceTypes.FREE ||
        selectedType === PaymentChoiceTypes.PROGRAM ||
        selectedType === PaymentChoiceTypes.GROUP
      ) {
        // Free enrollment in a Spark specialization course
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onFreeEnroll' does not exist on type 'Re... Remove this comment to see the full error message
        this.props.onFreeEnroll();
      }
    } else {
      this.setState({ showErrorMessage: true });
    }
  };

  getInitialSelectedType() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'showBulkPay' does not exist on type 'Rea... Remove this comment to see the full error message
    const { showBulkPay, showEnrollThroughProgram, showEnrollThroughGroup } = this.props;
    if (showEnrollThroughProgram) {
      return PaymentChoiceTypes.PROGRAM;
    } else if (showEnrollThroughGroup) {
      return PaymentChoiceTypes.GROUP;
    } else if (showBulkPay) {
      return PaymentChoiceTypes.FULL;
    } else {
      return PaymentChoiceTypes.SINGLE;
    }
  }

  setSelectedType(newType: $TSFixMe) {
    this.setState({ currentSelectedType: newType });
  }

  renderChoices() {
    const { userS12n, course } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'showFreeOption' does not exist on type '... Remove this comment to see the full error message
    const { showFreeOption, showBulkPay, showEnrollThroughProgram, showEnrollThroughGroup } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type '{ enrol... Remove this comment to see the full error message
    const { program, group, thirdPartyOrganization } = this.state;
    const doesOwnCourse = userS12n.doesOwnCourse(course.get('id'));

    if (
      doesOwnCourse &&
      userS12n.ownsAllCoursesExceptCapstone() &&
      !(showEnrollThroughGroup || showEnrollThroughProgram)
    ) {
      return <PaymentChoiceCapstone price={this.context.userS12n.getCapstone().get('price')} />;
    }

    return (
      <div>
        {showEnrollThroughProgram && (
          // @ts-expect-error ts-migrate(2786) FIXME: 'PaymentChoiceProgram' cannot be used as a JSX com... Remove this comment to see the full error message
          <PaymentChoiceProgram
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ checked: boolean; program: any; thirdParty... Remove this comment to see the full error message
            checked={this.state.selectedType === PaymentChoiceTypes.PROGRAM}
            program={program}
            thirdPartyOrganization={thirdPartyOrganization}
          />
        )}
        {showEnrollThroughGroup && group && (
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <PaymentChoiceGroup checked={this.state.selectedType === PaymentChoiceTypes.GROUP} group={group} />
        )}
        {showBulkPay && !showEnrollThroughProgram && (
          <PaymentChoiceFull
            price={this.context.userS12n.getMetadata('price')}
            currentType={this.state.currentSelectedType}
            onClick={(type: $TSFixMe) => this.setSelectedType(type)}
          />
        )}
        {!(showEnrollThroughProgram || showEnrollThroughGroup) && !doesOwnCourse && (
          <PaymentChoiceSingle
            price={this.context.course.get('price')}
            currentType={this.state.currentSelectedType}
            onClick={(type: $TSFixMe) => this.setSelectedType(type)}
          />
        )}
        {showFreeOption && !showEnrollThroughProgram && (
          <PaymentChoiceFree
            currentType={this.state.currentSelectedType}
            onClick={(type: $TSFixMe) => this.setSelectedType(type)}
          />
        )}
      </div>
    );
  }

  renderSubTitle() {
    return (
      <div className="sub-title bt3-text-center">
        <FormattedMessage
          className="center"
          message={_t('Part of a {s12nCourseCount}-course series, {s12nTitle}')}
          s12nCourseCount={this.context.userS12n.getNumCoursesIncludingCapstone()}
          s12nTitle={this.context.userS12n.getMetadata().attributes.name}
        />
      </div>
    );
  }

  render() {
    const enrollButtonProps = {};
    if (this.state.enrolling) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'disabled' does not exist on type '{}'.
      enrollButtonProps.disabled = true;
    }

    return (
      <div className="rc-PaymentChoices styleguide">
        <div className="title container">
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Readonly<... Remove this comment to see the full error message */}
          <h3 className="bt3-modal-title center">{this.props.title || _t('Pick a Payment Option')}</h3>
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'onSdp' does not exist on type 'Readonly<... Remove this comment to see the full error message */}
          {!this.props.onSdp && this.renderSubTitle()}
        </div>
        <div className="content container">
          {this.renderChoices()}
          <div className="horizontal-box align-items-absolute-center enroll-button">
            <TrackedButton
              trackingName="enroll_button"
              data={{ selectType: this.state.currentSelectedType }}
              className="primary"
              onClick={(ev) => this.handleClickEnroll(ev)}
              {...enrollButtonProps}
            >
              {this.state.enrolling ? <Icon name="spinner" spin /> : _t('Enroll')}
            </TrackedButton>
          </div>
          {this.state.showErrorMessage && (
            <div className="error-message align-horizontal-center body-1-text color-warn-dark">
              {_t('Please choose a payment option')}
            </div>
          )}
        </div>
      </div>
    );
  }
}

// @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ enrollmentAvailableChoices, i... Remove this comment to see the full error message
export default mapProps(({ enrollmentAvailableChoices, isPreEnroll, showFreeOption, ...props }) => ({
  isPreEnroll,
  showFreeOption:
    enrollmentAvailableChoices.hasFreeEnrollOptionIntoCourse ||
    enrollmentAvailableChoices.canAuditCourse ||
    showFreeOption,
  showBulkPay: enrollmentAvailableChoices.canBulkPaySpecialization,
  showEnrollThroughProgram: enrollmentAvailableChoices.canEnrollThroughProgram,
  showEnrollThroughProgramInvitation: enrollmentAvailableChoices.canEnrollThroughProgramInvitation,
  showEnrollThroughGroup: enrollmentAvailableChoices.canEnrollThroughGroup,
  ...props,
}))(PaymentChoices);

export const BaseComp = PaymentChoices;
