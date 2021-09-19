import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { triggerAssignment } from 'actions/ab';
import { isValidTestTreatment } from 'helpers/SymphonyHydraTestValidator.js';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import Ad from 'components/landing/Ad';
import Agreement from 'components/landing/Agreement';
import BrandReviews from 'components/landing/BrandReviews';
import BrandTrending from 'components/landing/BrandTrending';
import BrokenPage from 'components/error/BrokenPage';
import Departments from 'components/landing/Departments';
import EGiftCard from 'components/landing/EGiftCard';
import EventCallout from 'components/landing/EventCallout';
import Faqs from 'components/landing/Faqs';
import GenericBrandFacets from 'components/landing/GenericBrandFacets';
import Images from 'components/landing/Images';
import Iframe from 'components/landing/Iframe';
import Instagram from 'components/landing/Instagram';
import MelodyArticleImages from 'components/landing/MelodyArticleImages';
import MelodyArticleImageCopy from 'components/landing/MelodyArticleImageCopy';
import MelodyBrandIndex from 'components/landing/MelodyBrandIndex';
import MelodyCategory from 'components/landing/MelodyCategory';
import MelodyEditorialPromo from 'components/landing/MelodyEditorialPromo';
import MelodyHeaderRule from 'components/landing/MelodyHeaderRule';
import MelodyHero from 'components/landing/MelodyHero';
import MelodyHeroFull from 'components/landing/MelodyHeroFull';
import MelodyHorizontalNav from 'components/landing/MelodyHorizontalNav';
import MelodyPersonalizedBrand from 'components/landing/MelodyPersonalizedBrand';
import MelodyPersonalizedCategories from 'components/landing/MelodyPersonalizedCategories';
import MelodyPromoGroup from 'components/landing/MelodyPromoGroup';
import MelodySizingGuide from 'components/landing/MelodySizingGuide';
import MelodySplitEditorial from 'components/landing/MelodySplitEditorial';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';
import MelodyNewsfeed from 'components/landing/newsfeed/MelodyNewsfeed';
import NotificationSignup from 'components/landing/NotificationSignup';
import PageContent from 'components/landing/PageContent';
import ProductSearch from 'components/landing/ProductSearch';
import Raffle from 'components/landing/Raffle';
import Recommender from 'components/landing/Recommender';
import ReleaseCalendar from 'components/landing/ReleaseCalendar';
import ZapposHero from 'components/landing/ZapposHero';
import ZapposPromoGroup from 'components/landing/ZapposPromoGroup';
import ZapposForm from 'components/landing/ZapposForm';
import ShopTheLook from 'containers/landing/ShopTheLook';
import VipDashboardHeader from 'components/landing/VipDashboardHeader';
import VipOptIn from 'components/landing/VipOptIn';
import VipPrimeLink from 'components/landing/VipPrimeLink';

// The keys here map directly to the component name in content symphony.
const slotContentTypes = {
  'ad': Ad,
  'agreement': Agreement,
  'brandNotification': NotificationSignup,
  'BrokenPage': BrokenPage,
  'departments': Departments,
  'egiftcard': EGiftCard,
  'eventCallout': EventCallout,
  'faqs': Faqs,
  'genericBrandAbout': PageContent, // reusing PageContent for Taxonomy pages.
  'genericBrandEmails': NotificationSignup, // reusing Notifications for Taxonomy pages
  'genericBrandFacets': GenericBrandFacets,
  'genericBrandReviews': BrandReviews,
  'genericBrandTrending': BrandTrending,
  'iframe': Iframe,
  'images': Images,
  'instagram': Instagram, // Gateway component name
  'catskillsInstagram': Instagram, // ZCS component name
  'melodyArticleImages': MelodyArticleImages,
  'melodyArticleImageCopy': MelodyArticleImageCopy,
  'melodyBrandIndex': MelodyBrandIndex,
  'melodyCategory': MelodyCategory,
  'melodyEditorialPromo': MelodyEditorialPromo,
  'melodyHeaderRule': MelodyHeaderRule,
  'melodyHero': MelodyHero,
  'melodyHeroFull': MelodyHeroFull,
  'melodyHorizontalNav': MelodyHorizontalNav,
  'melodyPersonalizedBrand': MelodyPersonalizedBrand,
  'melodyPersonalizedCategories': MelodyPersonalizedCategories,
  'melodyPromoGroup': MelodyPromoGroup,
  'melodySizingGuide': MelodySizingGuide,
  'melodySplitEditorial': MelodySplitEditorial,
  'melodyVideoPlayer': MelodyVideoPlayer,
  'melodyNewsFeed': MelodyNewsfeed,
  'pageContent': PageContent,
  'productSearch': ProductSearch,
  'raffle': Raffle,
  'recommender': Recommender,
  'releaseCalendar': ReleaseCalendar,
  'shopTheLook': ShopTheLook,
  'vipDashboardHeader': VipDashboardHeader,
  'vipOptIn': VipOptIn,
  'vipPrimeLink': VipPrimeLink,
  'zapposHero': ZapposHero,
  'ZapposForm': ZapposForm,
  'zapposPromoGroup': ZapposPromoGroup
};

const renderSlot = (testTreatment, assignmentGroup, testName) => {
  if (assignmentGroup !== null) {
    return testTreatment[assignmentGroup] === 'Render';
  }
  return !testName;
};

export const LandingSlot = props => {
  const {
    isRecognized,
    triggerAssignment,
    hasAssignmentTriggered,
    pageName,
    slotName,
    data = {},
    onTaxonomyComponentClick,
    onComponentClick,
    shouldLazyLoad,
    slotHeartsData,
    ipStatus,
    slotContentTypesList = slotContentTypes,
    slotIndex
  } = props;

  const { componentName, testName, testTreatment, testTrigger } = data;

  /*
   * Components can be reassigned through the Symphony testTreatment
   * attribute. Setting up initialized variables for reassignment
   * if needed.
   */
  let componentContent = data;
  let componentContentName = componentContent.componentName;

  /*
   * Hook definition to set up test assignment for a Symphony component.
   * Evaluates the test attributes and trigger criteria before
   * assigning user to test. setShouldShow to true at this point
   * to avoid showing initial component, then swapping it on the next
   * tick with the treatment or fallback component.
   */
  useEffect(() => {
    const validTest = isValidTestTreatment({ testName, testTrigger, testTreatment, isRecognized, hasAssignmentTriggered });

    if (validTest) {
      const { index = 0 } = triggerAssignment(testName) || {};
      setAssignmentGroup(index);
    }
    setShouldShow(true);
  }, [hasAssignmentTriggered, isRecognized, testName, testTreatment, testTrigger, triggerAssignment]);

  const [assignmentGroup, setAssignmentGroup] = useState(null);
  const [shouldShow, setShouldShow] = useState(false);

  if (!componentName) {
    return null;
  }

  /*
   * Checking for a testTreatment. If the assignmentGroup aligns
   * with a key containing a component object, overwrite the component data.
   * Else if there is no assignment, but there is a fallback component object,
   * overwrite with that. If there is a testName and no testTreatment assignment
   * or the assigment explicitly says not to render, set the component name to null.
   */
  if (testName && testTrigger && testTreatment) {
    const { fallback } = testTreatment;
    if (testTreatment[assignmentGroup] instanceof Object) {
      componentContent = testTreatment[assignmentGroup];
      componentContentName = testTreatment[assignmentGroup].componentName;
    } else if (!hasAssignmentTriggered && fallback instanceof Object) {
      componentContent = fallback;
      componentContentName = fallback.componentName;
    } else if (
      ((!testTreatment[assignmentGroup] && !fallback) || testTreatment[assignmentGroup] === 'DoNotRender')
    ) {
      componentContentName = null;
    }
  }
  const SlotContent = slotContentTypesList[componentContentName];

  return SlotContent && (renderSlot(testTreatment, assignmentGroup, testName) || shouldShow) ?
    <SlotContent
      slotName={slotName}
      slotDetails={componentContent}
      slotIndex={slotIndex}
      pageName={pageName}
      onComponentClick={onComponentClick}
      onTaxonomyComponentClick={onTaxonomyComponentClick}
      shouldLazyLoad={shouldLazyLoad}
      slotHeartsData={slotHeartsData}
      ipStatus={ipStatus}
    /> : null;
};

const mapStateToProps = (state, ownProps) => ({
  isRecognized: !!state.cookies['x-main'],
  hasAssignmentTriggered: Object.keys(state.ab.assignments).includes(ownProps.data?.testName)
});

const mapDispatchToProps = {
  triggerAssignment
};

const ConnectedLandingSlot = connect(mapStateToProps, mapDispatchToProps)(LandingSlot);
export default withErrorBoundary('LandingSlot', ConnectedLandingSlot);
