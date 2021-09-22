import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import Naptime from 'bundles/naptimejs';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';

import Icon from 'bundles/iconfont/Icon';
import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
import { ApiError } from 'bundles/enroll/utils/errorUtils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { guidedProjectSubmitPromise, submitEnrollmentPromise } from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import { SvgCheck } from '@coursera/coursera-ui/svg';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import TrackedButton from 'bundles/page/components/TrackedButton';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import Modal from 'bundles/phoenix/components/Modal';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';

import { EnrollModalType } from 'bundles/enroll/types/modalTypes';
import _t from 'i18n!nls/enroll-course';

import 'css!./__styles__/GuidedProjectEnrollModal';

const getBulletPoints = () => [
  _t('All learning materials, including the interactive workspace and final quiz'),
  _t('Instant access to the necessary software packages through Rhyme'),
  _t('A split-screen video walkthrough of each step, from a subject-matter expert'),
  _t('Free download of what you create'),
  _t('Ability to access your cloud desktop across six different sessions'),
];

type PropsFromCaller = {
  courseId: string;
  onClose: () => void;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsToComponent = PropsFromCaller & {
  course: CoursesV1;
  partners?: Array<PartnersV1>;
  productPrice?: ProductPricesV3;
  promotionEligibilities?: PromotionEligibilitiesV1;
};

type State = {
  didClickContinue: boolean;
  activeModal?: EnrollModalType;
  error?: ApiError;
};

export class GuidedProjectEnrollmentModal extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    didClickContinue: false,
    error: undefined,
    activeModal: EnrollModalType.ENROLL,
  };

  handleModalClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  onClickContinue = () => {
    this.setState(() => ({ didClickContinue: true }));

    const { promotionEligibilities, course } = this.props;
    const promoCode = promotionEligibilities?.isEligible ? promotionEligibilities.promoCodeId : null;
    const options = {
      courseId: course.id,
    };

    const handleSubmitPromise = guidedProjectSubmitPromise;
    submitEnrollmentPromise({ handleSubmitPromise, options, promoCode }).catch((
      data: $TSFixMe /* type submitEnrollmentPromise */
    ) => {
      this.setState(() => ({
        activeModal: EnrollModalType.ERROR,
        error: data,
      }));
    });
  };

  getFormattedPartnerDisplayName(partners: Array<PartnersV1>): string {
    const partnerNames = partners.map((partner) => partner.name);

    let partnerDisplayString;
    if (partnerNames.length > 1) {
      const combinedNames = partnerNames.slice(0, partnerNames.length - 1).join(', ');
      partnerDisplayString = _t('Offered by #{combinedNames} and #{lastPartner}', {
        combinedNames,
        lastPartner: partnerNames[partnerNames.length - 1],
      });
    } else {
      partnerDisplayString = _t('Offered by #{partnerName}', { partnerName: partnerNames[0] });
    }

    return partnerDisplayString;
  }

  renderValueProps(): React.ReactNode {
    const bullets = getBulletPoints();
    return (
      <ul className="value-props nostyle">
        {bullets.map((bullet, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`value-prop-${index}`}>
            <div className="bullet horizontal-box">
              <div className="checkmark">
                <SvgCheck size={22} color="#2A73CC" suppressTitle={true} />
              </div>
              <p className="body-1-text">{bullet}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  renderEnrollModal() {
    const { course, partners, productPrice } = this.props;
    const { didClickContinue } = this.state;

    return (
      <Modal
        className="rc-GuidedProjectEnrollModal"
        modalName="GuidedProjectEnrollModal"
        handleClose={this.handleModalClose}
        trackingName="guided_project_enroll_modal"
        data={{ id: course.id }}
      >
        <div className="body">
          <div className="headline-2-text project-name">{course.name}</div>
          {partners && (
            <div className="offered-by-partner caption-text">
              {partners && this.getFormattedPartnerDisplayName(partners)}
            </div>
          )}
          {productPrice && (
            <div className="price">
              <ReactPriceDisplay value={productPrice.finalAmount} currency={productPrice.currencyCode} />
            </div>
          )}
          <PromotionApplicableCheckoutMessage course={course} />
          <hr />
          <div className="value-props-container">
            <p className="value-props-title">{_t('Included in this Guided Project:')}</p>
            {this.renderValueProps()}
          </div>
        </div>
        <TrackedButton
          className="primary continue-button cozy"
          data-e2e="guided_project_enroll_modal_continue_button"
          onClick={this.onClickContinue}
          disabled={didClickContinue}
          trackingName="guided_project_enroll_modal_continue"
        >
          {didClickContinue ? <Icon name="spinner" spin={true} /> : _t('Continue')}
        </TrackedButton>
      </Modal>
    );
  }

  render() {
    const { onClose } = this.props;
    const { activeModal, error } = this.state;

    switch (activeModal) {
      case EnrollModalType.ERROR:
        return <EnrollErrorModal error={error} onClose={onClose} />;
      case EnrollModalType.ENROLL:
        return this.renderEnrollModal();
      default:
        return null;
    }
  }
}

type PropsFromStores = PropsFromCaller & {
  requestCountryCode: string;
};

type PropsFromNaptime1 = PropsFromStores & {
  productPrice: ProductPricesV3;
  course: CoursesV1;
};

type PropsFromNaptime2 = PropsFromNaptime1 & {
  partners?: Array<PartnersV1>;
};

export default compose<PropsToComponent, PropsFromCaller>(
  connectToStores<PropsFromStores, PropsFromCaller>(['ApplicationStore'], ({ ApplicationStore }) => ({
    requestCountryCode: ApplicationStore.getState().requestCountryCode,
  })),
  Naptime.createContainer<PropsFromNaptime1, PropsFromStores>(({ courseId, requestCountryCode }) => ({
    course: CoursesV1.get(courseId, {
      fields: ['id', 'name', 'partnerIds'],
      params: {
        showHidden: true,
      },
    }),
    productPrice: ProductPricesV3.getCourseProductPrice(courseId, requestCountryCode, {}),
  })),
  Naptime.createContainer<PropsFromNaptime2, PropsFromNaptime1>(({ course }) => ({
    partners: PartnersV1.multiGet(course.partnerIds, {
      fields: ['name'],
    }),
  })),
  withPromotionInfo()
)(GuidedProjectEnrollmentModal);
