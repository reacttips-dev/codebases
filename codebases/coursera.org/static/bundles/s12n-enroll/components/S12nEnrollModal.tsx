import React from 'react';

import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import { compose, withProps } from 'recompose';

/* eslint-disable quote-props, no-nested-ternary */
import PropTypes from 'prop-types';

import Course from 'bundles/catalogP/models/course';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import EnrollmentReasonCode from 'bundles/enroll-course/common/EnrollmentReasonCode';
import Modal from 'bundles/phoenix/components/Modal';
import S12nEnrollModalPaymentChoices from 'bundles/s12n-enroll/components/PaymentChoices';
import constants from 'bundles/s12n-common/service/constants';
import {
  loadS12nOwnership,
  loadAndBuildSpecializationOwnership,
} from 'bundles/s12n-common/actions/S12nOwnershipActionCreators';
import {
  loadS12nMembership,
  loadSpecializationMembership,
} from 'bundles/s12n-common/actions/S12nMembershipActionCreators';
import {
  loadS12nById,
  loadSpecializationById,
  loadSpecializationFromDjangoEndpointById,
} from 'bundles/s12n-common/actions/S12nActionCreators';
import S12nOwnershipsStore from 'bundles/s12n-common/stores/S12nOwnershipsStore';
import S12nMembershipsStore from 'bundles/s12n-common/stores/S12nMembershipsStore';
import S12nsStore from 'bundles/s12n-common/stores/S12nsStore';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
import redirect from 'js/lib/coursera.redirect';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Fluxible from 'vendor/cnpm/fluxible.v0-4/lib/Fluxible';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import _t from 'i18n!nls/s12n-enroll';
import { getAvailablePrograms, getAvailableInvitedPrograms } from 'bundles/s12n-enroll/components/lib/programClient';
import EnterpriseEnrollmentChoiceModalForXDP from 'bundles/program-common/components/EnterpriseEnrollmentChoiceModalForXDP';
import { PRODUCT_TYPES } from 'bundles/program-common/constants/ProgramActionConstants';
import withEnrollmentGraphql from 'bundles/enroll/components/xdp/withEnrollmentGraphql';
import 'css!./__styles__/S12nEnrollModal';

const S12nEnrollModalPropTypes = {
  onClose: PropTypes.func.isRequired,

  userS12n: PropTypes.instanceOf(UserS12n),
  isContentGate: PropTypes.bool,
  s12nId: PropTypes.string,
  courseIdOverride: PropTypes.string,
  showFreeOption: PropTypes.bool,
  isPreEnroll: PropTypes.bool,
  title: PropTypes.string,
  orgName: PropTypes.string,
  // Callback for free enroll
  onFreeEnroll: PropTypes.func,
  onEnrollFailure: PropTypes.func,
  onEnrollSuccess: PropTypes.func,
};

export class S12nEnrollModal extends React.Component {
  static propTypes = Object.assign({}, S12nEnrollModalPropTypes, {
    enrollmentAvailableChoices: PropTypes.instanceOf(EnrollmentAvailableChoicesV1),
  });

  static contextTypes = {
    onSdp: PropTypes.bool,
  };

  static childContextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
    course: PropTypes.instanceOf(Course),
  };

  static defaultProps = {
    showFreeOption: false,
    isContentGate: false,
    onEnrollFailure: () => null,
    isPreEnroll: false,
    onSdp: false,
  };

  state = {
    refreshPageOnClose: false,
    enterpriseLoading: false,
  };

  getChildContext() {
    return {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'userS12n' does not exist on type 'Readon... Remove this comment to see the full error message
      userS12n: this.props.userS12n,
      course: this.getSingleCourse(),
    };
  }

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'enrollmentAvailableChoices' does not exi... Remove this comment to see the full error message
    const { enrollmentAvailableChoices, userS12n } = this.props;
    const s12nId = userS12n.getMetadata('id');
    if (s12nId && enrollmentAvailableChoices) {
      if (enrollmentAvailableChoices.canEnrollThroughProgram) {
        this.setState({ enterpriseLoading: true });
        getAvailablePrograms(s12nId)
          .then(({ programs, thirdPartyOrganizations }) => {
            this.setState(() => ({
              programs,
              thirdPartyOrganizations,
              enterpriseLoading: false,
              displayEnterpriseOnConsumer: true,
            }));
          })
          .done();
      }
      if (enrollmentAvailableChoices.canEnrollThroughProgramInvitation) {
        this.setState({ enterpriseInvitationsLoading: true });
        getAvailableInvitedPrograms(s12nId)
          .then(({ invitedPrograms, invitedThirdPartyOrganizations }) => {
            this.setState(() => ({
              invitedPrograms,
              invitedThirdPartyOrganizations,
              enterpriseInvitationsLoading: false,
              displayEnterpriseOnConsumer: true,
            }));
          })
          .done();
      }
    }
  }

  handleFreeEnroll = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onFreeEnroll' does not exist on type 'Re... Remove this comment to see the full error message
    if (this.props.onFreeEnroll) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'userS12n' does not exist on type 'Readon... Remove this comment to see the full error message
      if (this.props.userS12n.isSpark()) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onFreeEnroll' does not exist on type 'Re... Remove this comment to see the full error message
        this.props.onFreeEnroll('free');
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'onFreeEnroll' does not exist on type 'Re... Remove this comment to see the full error message
        this.props.onFreeEnroll();
        this.handleClose();
      }
    } else {
      this.setState({ refreshPageOnClose: true });
      this.handleClose();
    }
  };

  handleClose = () => {
    if (this.state.refreshPageOnClose) {
      redirect.refresh();
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClose' does not exist on type 'Readonl... Remove this comment to see the full error message
      this.props.onClose();
    }
  };

  /**
   * @returns {Course} The course to use for the Pay By Course option.
   *   Either the course corresponding to this.props.courseId, or the first unowned course in the s12n.
   */
  getSingleCourse() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseIdOverride' does not exist on type... Remove this comment to see the full error message
    const { courseIdOverride, userS12n } = this.props;

    return courseIdOverride
      ? userS12n.getMetadata('courses').get(courseIdOverride)
      : userS12n.getNextUnownedCourse() || userS12n.getMetadata('courses').first();
  }

  getModalName() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isContentGate' does not exist on type 'R... Remove this comment to see the full error message
    if (this.props.isContentGate) {
      return _t('Join to continue');
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'userS12n' does not exist on type 'Readon... Remove this comment to see the full error message
    } else if (this.props.userS12n.isTakingS12n()) {
      return _t('Continue this Specialization');
    } else {
      return _t('Join this Specialization');
    }
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'userS12n' does not exist on type 'Readon... Remove this comment to see the full error message
    const { userS12n, enrollmentAvailableChoices } = this.props;
    const title = this.context.onSdp ? userS12n.getMetadata('name') : this.getSingleCourse().get('name');
    const s12nId = this.context.onSdp ? userS12n.getMetadata('id') : this.getSingleCourse().get('id');
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'programs' does not exist on type '{ refr... Remove this comment to see the full error message
      programs,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'thirdPartyOrganizations' does not exist ... Remove this comment to see the full error message
      thirdPartyOrganizations,
      enterpriseLoading,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayEnterpriseOnConsumer' does not ex... Remove this comment to see the full error message
      displayEnterpriseOnConsumer,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'enterpriseInvitationsLoading' does not e... Remove this comment to see the full error message
      enterpriseInvitationsLoading,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'invitedPrograms' does not exist on type ... Remove this comment to see the full error message
      invitedPrograms,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'invitedThirdPartyOrganizations' does not... Remove this comment to see the full error message
      invitedThirdPartyOrganizations,
    } = this.state;

    const renderModalBody = () => {
      if (enrollmentAvailableChoices && enrollmentAvailableChoices.hasChoice) {
        return (
          <S12nEnrollModalPaymentChoices
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ title: any; userS12n: any; enrollmentAvail... Remove this comment to see the full error message
            title={title}
            userS12n={userS12n}
            enrollmentAvailableChoices={enrollmentAvailableChoices}
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'showFreeOption' does not exist on type '... Remove this comment to see the full error message
            showFreeOption={this.props.showFreeOption}
            onFreeEnroll={this.handleFreeEnroll}
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'onEnrollFailure' does not exist on type ... Remove this comment to see the full error message
            onEnrollFailure={this.props.onEnrollFailure}
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'onEnrollSuccess' does not exist on type ... Remove this comment to see the full error message
            onEnrollSuccess={this.props.onEnrollSuccess}
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'isPreEnroll' does not exist on type 'Rea... Remove this comment to see the full error message
            isPreEnroll={this.props.isPreEnroll}
            onSdp={this.context.onSdp}
          />
        );
      } else {
        const humanReadableReasonCode = enrollmentAvailableChoices
          ? enrollmentAvailableChoices.humanReadableReasonCode
          : _t("Sorry, we couldn't identify any available enrollment choice for this Specialization at this time.");
        const enrollmentChoiceReasonCode =
          enrollmentAvailableChoices && enrollmentAvailableChoices.enrollmentChoiceReasonCode;
        return <p className="no-enrollment-option">{humanReadableReasonCode}</p>;
      }
    };

    if (displayEnterpriseOnConsumer && !enterpriseLoading && !enterpriseInvitationsLoading) {
      return (
        <EnterpriseEnrollmentChoiceModalForXDP
          thirdPartyOrganizations={thirdPartyOrganizations}
          programs={programs}
          invitedPrograms={invitedPrograms}
          invitedThirdPartyOrganizations={invitedThirdPartyOrganizations}
          productId={userS12n.getMetadata('id')}
          productType={PRODUCT_TYPES.SPECIALIZATION}
          userId={user.get().id}
          handleClose={this.handleClose}
        />
      );
    } else if (!enterpriseLoading) {
      return (
        <div className="rc-S12nEnrollModal">
          <CSSTransitionGroup transitionName="fade" transitionEnter={false} transitionLeaveTimeout={300}>
            {userS12n.hasFullData() && (
              <Modal
                trackingName="s12n_enroll_modal"
                data={{ id: s12nId }}
                key="S12nEnrollModal"
                modalName={this.getModalName()}
                handleClose={this.handleClose}
                allowClose={true}
              >
                {renderModalBody()}
              </Modal>
            )}
          </CSSTransitionGroup>
        </div>
      );
    }
    return null;
  }
}

const S12nEnrollModalNC = compose(
  withProps(() => ({
    isSpecialization: true,
  })),
  withEnrollmentGraphql()
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'typeof S12nEnrollModal' is not a... Remove this comment to see the full error message
)(S12nEnrollModal);

class S12nEnrollModalContainer extends React.Component {
  static propTypes = S12nEnrollModalPropTypes;

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func,
  };

  componentWillMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 's12nId' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { s12nId } = this.props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isSpark' does not exist on type 'S12nEnr... Remove this comment to see the full error message
    this.isSpark = Object.keys(constants.sparkSpecializationIds).some((key) => {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      return constants.sparkSpecializationIds[key].toString() === s12nId.toString();
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isSpark' does not exist on type 'S12nEnr... Remove this comment to see the full error message
    if (this.isSpark) {
      const specializationId = s12nId;

      this.context.executeAction(loadSpecializationById, { specializationId });
      this.context.executeAction(loadSpecializationFromDjangoEndpointById, {
        specializationId,
      });
      this.context.executeAction(loadSpecializationMembership, {
        specializationId,
      });
      this.context.executeAction(loadAndBuildSpecializationOwnership, {
        specializationId,
      });
    } else {
      this.context.executeAction(loadS12nById, { s12nId });
      this.context.executeAction(loadS12nMembership, { s12nId });
      this.context.executeAction(loadS12nOwnership, { s12nId });
    }
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'userS12n' does not exist on type 'Readon... Remove this comment to see the full error message
    if (!this.props.userS12n.hasFullData()) {
      return false;
    }

    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ userId: number; isSpark: any; children?: R... Remove this comment to see the full error message
    return <S12nEnrollModalNC {...this.props} userId={user.get().id} isSpark={this.isSpark} />;
  }
}

const StoreConnectedS12nEnrollModal = connectToStores(
  S12nEnrollModalContainer,
  ['S12nOwnershipsStore', 'S12nMembershipsStore', 'S12nsStore'],
  (context, props) => {
    return {
      userS12n: new UserS12n({
        // @ts-expect-error ts-migrate(2339) FIXME: Property 's12nId' does not exist on type '{}'.
        metadata: context.S12nsStore.getById(props.s12nId),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 's12nId' does not exist on type '{}'.
        ownership: context.S12nOwnershipsStore.getOwnership(props.s12nId),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 's12nId' does not exist on type '{}'.
        membership: context.S12nMembershipsStore.getMembership(props.s12nId),
        sparkMetadata: context.S12nsStore.getFirstFromDjango(),
      }),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseId' does not exist on type '{}'.
      courseId: props.courseId,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'showFreeOption' does not exist on type '... Remove this comment to see the full error message
      showFreeOption: props.showFreeOption,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'isContentGate' does not exist on type '{... Remove this comment to see the full error message
      isContentGate: props.isContentGate,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onEnrollFailure' does not exist on type ... Remove this comment to see the full error message
      onEnrollFailure: props.onEnrollFailure,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onEnrollSuccess' does not exist on type ... Remove this comment to see the full error message
      onEnrollSuccess: props.onEnrollSuccess,
    };
  }
);

const app = new Fluxible({
  component: StoreConnectedS12nEnrollModal,
});

app.registerStore(S12nOwnershipsStore);
app.registerStore(S12nMembershipsStore);
app.registerStore(S12nsStore);
app.registerStore(ApplicationStore);
app.registerStore(NaptimeStore);

const appContext = app.createContext();

export default class S12nEnrollModalFluxibleComponentContextProvider extends React.Component {
  render() {
    return (
      <FluxibleComponent context={appContext.getComponentContext()}>
        <StoreConnectedS12nEnrollModal {...this.props} />
      </FluxibleComponent>
    );
  }
}

export const BaseComp = S12nEnrollModalContainer;
