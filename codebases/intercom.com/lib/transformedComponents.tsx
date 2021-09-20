import { Entry } from 'contentful'
import { CONTENT_TYPE } from 'marketing-site/@types/generated/contentful'
import { ComponentLayout } from 'marketing-site/src/styles/constants'
import dynamic from 'next/dynamic'
import { ReactComponentLike } from 'prop-types'
import React from 'react'

const Section = dynamic(
  async () => (await import('marketing-site/src/library/components/Section')).Section,
)
const ContentfulCapabilitiesCarousel = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCapabilitiesCarousel'))
      .ContentfulCapabilitiesCarousel,
)
const ContentfulCrosslinkCards = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCrosslinkCards'))
      .ContentfulCrosslinkCards,
)
const ContentfulEmailCapture = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulEmailCapture'))
      .ContentfulEmailCapture,
)

const ContentfulLogoParty = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulLogoParty'))
      .ContentfulLogoParty,
)
const ContentfulHeroEmailCapture = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeroEmailCapture'))
      .ContentfulHeroEmailCapture,
)
const ContentfulHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHero')).ContentfulHero,
)
const ContentfulNewFeatureAnnouncement = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulNewFeatureAnnouncement'))
      .ContentfulNewFeatureAnnouncement,
)
const ContentfulNewsUpdatesList = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulNewsUpdatesList'))
      .ContentfulNewsUpdatesList,
)
const ContentfulRooflineBanner = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulRooflineBanner'))
      .ContentfulRooflineBanner,
)
const ContentfulGatedContent = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulGatedContent'))
      .ContentfulGatedContent,
)
const ContentfulFeatureSpotlight = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureSpotlight'))
      .ContentfulFeatureSpotlight,
)
const ContentfulFeatureSpotlightCitation = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureSpotlightCitation'))
      .ContentfulFeatureSpotlightCitation,
)
const ContentfulFeatureSpotlightVertical = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulVerticalFeatureSpotlight'))
      .ContentfulFeatureSpotlightVertical,
)
const ContentfulMiniTestimonials = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulMiniTestimonials'))
      .ContentfulMiniTestimonials,
)
const ContentfulFeatureSpotlightTestimonial = dynamic(
  async () =>
    (
      await import(
        'marketing-site/src/transformers/components/ContentfulFeatureSpotlightTestimonial'
      )
    ).ContentfulFeatureSpotlightTestimonial,
)
const ContentfulMultiFeatureSpotlight = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulMultiFeatureSpotlight'))
      .ContentfulMultiFeatureSpotlight,
)
const ContentfulWhatsIncluded = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulWhatsIncluded'))
      .ContentfulWhatsIncluded,
)
const ContentfulHeadingBlock = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeadingBlock'))
      .ContentfulHeadingBlock,
)
const ContentfulHeaderNavigation = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeaderNavigation'))
      .ContentfulHeaderNavigation,
)
const ContentfulLargeTestimonial = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulLargeTestimonial'))
      .ContentfulLargeTestimonial,
)
const ContentfulFooter = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFooter')).ContentfulFooter,
)
const ContentfulFeatureSpotlightDemo = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureSpotlightDemo'))
      .ContentfulFeatureSpotlightDemo,
)
const ContentfulHeroWithCta = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeroWithCTA'))
      .ContentfulHeroWithCta,
)
const ContentfulHeroForEarlyStage = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeroForEarlyStage'))
      .ContentfulHeroForEarlyStage,
)
const ContentfulTestimonialTextOnly = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulTestimonialTextOnly'))
      .ContentfulTestimonialTextOnly,
)

const ContentfulTestimonialSmall = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulTestimonialSmall'))
      .ContentfulTestimonialSmall,
)
const ContentfulFeatureSpotlightVideo = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureSpotlightVideo'))
      .ContentfulFeatureSpotlightVideo,
)
const ContentfulVideoPlayer = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulVideoPlayer'))
      .ContentfulVideoPlayer,
)
const ContentfulCardsWithImage = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCardsWithImage'))
      .ContentfulCardsWithImage,
)
const ContentfulResourceHub = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulResourceHub'))
      .ContentfulResourceHub,
)
const ContentfulRichText = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulRichText'))
      .ContentfulRichText,
)
const ContentfulFeatureGrid = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureGrid'))
      .ContentfulFeatureGrid,
)
const ContentfulFeatureListSimple = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulFeatureListSimple'))
      .ContentfulFeatureList,
)
const ContentfulStatistics = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulStatistics'))
      .ContentfulStatistics,
)
const ContentfulTestimonialTweet = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulTestimonialTweet'))
      .ContentfulTestimonialTweet,
)
const ContentfulHeroWithVideo = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeroWithVideo'))
      .ContentfulHeroWithVideo,
)

const ContentfulHomepageHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHomepageHero'))
      .ContentfulHomepageHero,
)

const ContentfulEditorialStoryGrid = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulEditorialStoryGrid'))
      .ContentfulCustomerStoryGrid,
)

const ContentfulMarketoForm = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulMarketoForm'))
      .ContentfulMarketoForm,
)

const ContentfulHeroForCareersPage = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeroForCareersPage'))
      .ContentfulHeroForCareersPage,
)

const ContentfulInboundCarousel = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulInboundCarousel'))
      .ContentfulInboundCarousel,
)

const ContentfulLayout = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulLayout')).ContentfulLayout,
)

const ContentfulProductList = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulProductList'))
      .ContentfulProductList,
)
const ContentfulSolutionWithTiers = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulSolutionWithTiers'))
      .ContentfulSolutionWithTiers,
)
const ContentfulTabbedSolutions = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulTabbedSolutions'))
      .ContentfulTabbedSolutions,
)
const ContentfulPricingAddOns = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPricingAddOns'))
      .ContentfulPricingAddOns,
)
const ContentfulPricingAddOnCard = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPricingAddOnCard'))
      .ContentfulPricingAddOnCard,
)
const ContentfulTierPricingSection = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulTierPricingSection'))
      .ContentfulTierPricingSection,
)
const ContentfulSolutionFeature = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulSolutionFeature'))
      .ContentfulSolutionFeature,
)
const ContentfulFeatureSection = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureSection'))
      .ContentfulFeatureSection,
)
const ContentfulProductToursDemo = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulProductToursDemo'))
      .ContentfulProductToursDemo,
)
const ContentfulPoweredByHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPoweredByHero'))
      .ContentfulPoweredByHero,
)

const ContentfulCallout = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCallout'))
      .ContentfulCallout,
)

const ContentfulBasicHeader = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulBasicHeader'))
      .ContentfulBasicHeader,
)

const ContentfulCardsWithIcon = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCardsWithIcon'))
      .ContentfulCardsWithIcon,
)

const ContentfulVariationContainer = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulVariationContainer'))
      .ContentfulVariationContainer,
)

const ContentfulGreenhouseListings = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulGreenhouseListings'))
      .ContentfulGreenhouseListings,
)

const ContentfulPlanColumnGroup = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPlanColumnGroup'))
      .ContentfulPlanColumnGroup,
)

const ContentfulPlatform = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPlatform'))
      .ContentfulPlatform,
)

const ContentfulPlanColumnGroupLayout = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPlanColumnGroupLayout'))
      .ContentfulPlanColumnGroupLayout,
)

const ContentfulPricingTierCard = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPricingTierCard'))
      .ContentfulPricingTierCard,
)

const ContentfulAddonPricingModal = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulAddonPricingModal'))
      .ContentfulAddOnPricingModal,
)

const ContentfulLegalPageWrapper = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulLegalPageWrapper'))
      .ContentfulLegalPageWrapper,
)

const ContentfulMobileAppsHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulMobileAppsHero'))
      .ContentfulMobileAppsHero,
)

const ContentfulEditorialWrap = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulEditorialWrap'))
      .ContentfulEditorialWrap,
)

const ContentfulPoweredByWrap = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPoweredByWrap'))
      .ContentfulPoweredByWrap,
)

const ContentfulCustomerStoryHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCustomerStoryHero'))
      .ContentfulCustomerStoryHero,
)

const ContentfulWatchADemoCTA = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulWatchADemoCTA'))
      .ContentfulWatchADemoCTA,
)

const ContentfulTestimonialWithForm = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulTestimonialWithForm'))
      .ContentfulTestimonialWithForm,
)

const ContentfulFeatureTab = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulFeatureTab'))
      .ContentfulFeatureTab,
)

const ContentfulIDLink = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulIDLink')).ContentfulIDLink,
)

const ContentfulCarousel = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCarousel'))
      .ContentfulCarousel,
)

const ContentfulContentDownload = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulContentDownload'))
      .ContentfulCarousel,
)

const ContentfulCSFHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCSFHero'))
      .ContentfulCSFHero,
)
const ContentfulInnovationTimeline = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulInnovationTimeline'))
      .ContentfulInnovationTimeline,
)
const ContentfulSpotlightList = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulSpotlightList'))
      .ContentfulSpotlightList,
)

const ContentfulValuePropsWithModalVideo = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulValuePropsWithModalVideo'))
      .ContentfulValuePropsWithModalVideo,
)

const ContentfulWistiaVideo = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulWistiaVideo'))
      .ContentfulWistiaVideo,
)

const ContentfulLearnLinks = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulLearnLinks'))
      .ContentfulLearnLinks,
)

const ContentfulComponentGroup = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulComponentGroup'))
      .ContentfulComponentGroup,
)

const ContentfulCardContainer = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulCardContainer'))
      .ContentfulCardContainer,
)

const ContentfulSolutionCards = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulSolutionCards'))
      .ContentfulSolutionCards,
)

const ContentfulResourcesBanner = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulResourcesBanner'))
      .ContentfulResourcesBanner,
)

const ContentfulMagicLine = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulMagicLine'))
      .ContentfulMagicLine,
)

const ContentfulCTAButton = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulCTAButton'))
      .ContentfulCTAButton,
)

const ContentfulCTALink = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulCTALink')).ContentfulCTALink,
)

const ContentfulSignUpCTA = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/elements/ContentfulSignUpCTA'))
      .ContentfulSignUpCTA,
)

const ContentfulEnterpriseSolutionBanner = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulEnterpriseSolutionBanner'))
      .ContentfulEnterpriseSolutionBanner,
)

const ContentfulPricingModal = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulPricingModal'))
      .ContentfulPricingModal,
)

const ContentfulDoubleViewHero = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulDoubleViewHero'))
      .ContentfulDoubleViewHero,
)

const ContentfulHeroWithToggle = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulHeroWithToggle'))
      .ContentfulHeroWithToggle,
)

const ContentfulWiredCards = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulWiredCards'))
      .ContentfulWiredCards,
)

const ContentfulToggleMenu = dynamic(
  async () =>
    (await import('marketing-site/src/transformers/components/ContentfulToggleMenu'))
      .ContentfulToggleMenu,
)

type IComponentMap = Partial<Record<CONTENT_TYPE, ReactComponentLike>>

export const TRANSFORMED_COMPONENTS: IComponentMap = {
  addOnPricingModal: ContentfulAddonPricingModal,
  basicHeader: ContentfulBasicHeader,
  callout: ContentfulCallout,
  capabilitiesCarousel: ContentfulCapabilitiesCarousel,
  cardContainer: ContentfulCardContainer,
  cardList: ContentfulCrosslinkCards,
  cardsWithIcon: ContentfulCardsWithIcon,
  cardsWithImage: ContentfulCardsWithImage,
  carousel: ContentfulCarousel,
  componentGroup: ContentfulComponentGroup,
  contentDownload: ContentfulContentDownload,
  csfHero: ContentfulCSFHero,
  ctaButton: ContentfulCTAButton,
  ctaLink: ContentfulCTALink,
  customerStoryGrid: ContentfulEditorialStoryGrid,
  customerStoryHero: ContentfulCustomerStoryHero,
  customerWrap: ContentfulEditorialWrap,
  doubleViewHero: ContentfulDoubleViewHero,
  emailCapture: ContentfulEmailCapture,
  enterpriseSolutionBanner: ContentfulEnterpriseSolutionBanner,
  featureAnnouncement: ContentfulNewFeatureAnnouncement,
  featureGrid: ContentfulFeatureGrid,
  featureListSimple: ContentfulFeatureListSimple,
  featureSection: ContentfulFeatureSection,
  featureSpotlight: ContentfulFeatureSpotlight,
  featureSpotlightCitation: ContentfulFeatureSpotlightCitation,
  featureSpotlightVertical: ContentfulFeatureSpotlightVertical,
  featureSpotlightWithProductDemo: ContentfulFeatureSpotlightDemo,
  featureSpotlightWithTestimonial: ContentfulFeatureSpotlightTestimonial,
  featureSpotlightWithVideo: ContentfulFeatureSpotlightVideo,
  featureTab: ContentfulFeatureTab,
  footer2: ContentfulFooter,
  gatedContent: ContentfulGatedContent,
  greenhouseJobListings: ContentfulGreenhouseListings,
  headerNavigation: ContentfulHeaderNavigation,
  headingBlock: ContentfulHeadingBlock,
  hero: ContentfulHero,
  heroEmailCapture: ContentfulHeroEmailCapture,
  heroForCareersPage: ContentfulHeroForCareersPage,
  heroForEarlyStage: ContentfulHeroForEarlyStage,
  heroWithCta: ContentfulHeroWithCta,
  heroWithToggle: ContentfulHeroWithToggle,
  heroWithVideo: ContentfulHeroWithVideo,
  homepageHero: ContentfulHomepageHero,
  idLink: ContentfulIDLink,
  innovationTimeline: ContentfulInnovationTimeline,
  inboundCarousel: ContentfulInboundCarousel,
  largeTestimonial: ContentfulLargeTestimonial,
  layout: ContentfulLayout,
  learnDirectoryLinks: ContentfulLearnLinks,
  legalPageWrapper: ContentfulLegalPageWrapper,
  logoParty: ContentfulLogoParty,
  magicLine: ContentfulMagicLine,
  marketoForm: ContentfulMarketoForm,
  miniTestimonials: ContentfulMiniTestimonials,
  mobileAppsHero: ContentfulMobileAppsHero,
  multiFeatureSpotlight: ContentfulMultiFeatureSpotlight,
  newsUpdatesList: ContentfulNewsUpdatesList,
  planColumnGroup: ContentfulPlanColumnGroup,
  planColumnGroupLayout: ContentfulPlanColumnGroupLayout,
  platform: ContentfulPlatform,
  poweredByHero: ContentfulPoweredByHero,
  poweredByWrap: ContentfulPoweredByWrap,
  pricingAddOnCard: ContentfulPricingAddOnCard,
  pricingAddOns: ContentfulPricingAddOns,
  pricingModal: ContentfulPricingModal,
  pricingTierCard: ContentfulPricingTierCard,
  productList: ContentfulProductList,
  productToursDemo: ContentfulProductToursDemo,
  resourceHub: ContentfulResourceHub,
  resourcesBanner: ContentfulResourcesBanner,
  richTextEditor: ContentfulRichText,
  rooflineBanner: ContentfulRooflineBanner,
  signupCta: ContentfulSignUpCTA,
  solutionCards: ContentfulSolutionCards,
  solutionFeature: ContentfulSolutionFeature,
  solutionWithTiers: ContentfulSolutionWithTiers,
  spotlightList: ContentfulSpotlightList,
  statistics: ContentfulStatistics,
  tabbedSolutions: ContentfulTabbedSolutions,
  testimonialTextOnly: ContentfulTestimonialTextOnly,
  testimonialSmall: ContentfulTestimonialSmall,
  testimonialTweet: ContentfulTestimonialTweet,
  testimonialWithForm: ContentfulTestimonialWithForm,
  tierPricingSection: ContentfulTierPricingSection,
  toggleMenu: ContentfulToggleMenu,
  valuePropsWithModalVideo: ContentfulValuePropsWithModalVideo,
  variationContainer: ContentfulVariationContainer,
  videoPlayer: ContentfulVideoPlayer,
  watchADemoCta: ContentfulWatchADemoCTA,
  whatsIncluded: ContentfulWhatsIncluded,
  wiredCardsComponent: ContentfulWiredCards,
  wistiaVideo: ContentfulWistiaVideo,
}

export function renderTransformedComponent(
  contentTypeId: CONTENT_TYPE,
  props: Entry<{}> & { children?: React.ReactNode },
  index?: number,
): React.ReactNode {
  if (contentTypeId in TRANSFORMED_COMPONENTS) {
    const Component: ReactComponentLike = TRANSFORMED_COMPONENTS[
      contentTypeId
    ] as ReactComponentLike

    const contentLayout = ComponentLayout[contentTypeId]

    if (contentLayout !== undefined) {
      return (
        <Section
          key={index}
          topMargin={contentLayout.topMargin}
          bottomMargin={contentLayout.bottomMargin}
          className={`section--${contentTypeId}`}
        >
          <Component {...props} />
        </Section>
      )
    } else {
      return <Component {...props} />
    }
  } else {
    throw new Error(`${contentTypeId} not implemented`)
  }
}
