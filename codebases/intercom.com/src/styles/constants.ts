import { CONTENT_TYPE } from 'marketing-site/@types/generated/contentful'
import { mq } from 'marketing-site/src/library/utils/constants/mediaQueries'
import { MarginSizeOption } from '../library/utils'

type BreakpointNames = keyof typeof mq
type SpacingNames = keyof typeof MarginSizeOption

type SpacingAtBreakpoint = Partial<Record<BreakpointNames, number>>
export const SpacingValues: { [s in SpacingNames]: SpacingAtBreakpoint } = {
  xs: {
    mobile: 24,
    tablet: 24,
  },
  sm: {
    mobile: 60,
    tablet: 60,
  },
  md: {
    mobile: 80,
    tablet: 100,
  },
  lg: {
    mobile: 100,
    tablet: 120,
  },
  xl: {
    mobile: 120,
    tablet: 160,
  },
  xxl: {
    mobile: 160,
    tablet: 200,
  },
}

interface IComponentSection {
  wrappedInSection: boolean
  topMargin?: MarginSizeOption
  bottomMargin?: MarginSizeOption
}

type IComponentLayoutMap = Partial<Record<CONTENT_TYPE, IComponentSection>>

export const ComponentLayout: IComponentLayoutMap = {
  cardList: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.md,
  },
  emailCapture: {
    wrappedInSection: true,
    bottomMargin: MarginSizeOption.sm,
  },
  logoParty: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.md,
    bottomMargin: MarginSizeOption.md,
  },
  heroEmailCapture: {
    wrappedInSection: false,
  },
  featureAnnouncement: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.xl,
    bottomMargin: MarginSizeOption.xl,
  },
  rooflineBanner: {
    wrappedInSection: false,
  },
  gatedContent: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.md,
    bottomMargin: MarginSizeOption.lg,
  },
  featureSpotlight: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.sm,
  },
  featureSpotlightCitation: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.xl,
  },
  featureSpotlightVertical: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.xl,
  },
  miniTestimonials: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.sm,
  },
  featureSpotlightWithTestimonial: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.md,
  },
  multiFeatureSpotlight: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.xl,
    bottomMargin: MarginSizeOption.xl,
  },
  whatsIncluded: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.md,
    bottomMargin: MarginSizeOption.md,
  },
  headingBlock: {
    wrappedInSection: false,
  },
  largeTestimonial: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.xl,
  },
  featureSpotlightWithProductDemo: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.xl,
  },
  heroWithCta: {
    wrappedInSection: false,
  },
  testimonialTextOnly: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.lg,
    bottomMargin: MarginSizeOption.lg,
  },
  featureSpotlightWithVideo: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.xl,
  },
  videoPlayer: {
    wrappedInSection: false,
  },
  cardsWithImage: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.md,
  },
  solutionCards: {
    wrappedInSection: true,
  },
  featureGrid: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.lg,
    bottomMargin: MarginSizeOption.lg,
  },
  statistics: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.lg,
    bottomMargin: MarginSizeOption.xl,
  },
  testimonialTweet: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.lg,
    bottomMargin: MarginSizeOption.lg,
  },
  heroWithVideo: {
    wrappedInSection: false,
  },
  richTextEditor: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.lg,
    bottomMargin: MarginSizeOption.lg,
  },
  customerStoryGrid: {
    wrappedInSection: true,
    bottomMargin: MarginSizeOption.lg,
  },
  cardsWithIcon: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.sm,
    bottomMargin: MarginSizeOption.md,
  },
  greenhouseJobListings: {
    wrappedInSection: true,
    topMargin: MarginSizeOption.lg,
    bottomMargin: MarginSizeOption.xl,
  },
  capabilitiesCarousel: {
    wrappedInSection: true,
  },
}
