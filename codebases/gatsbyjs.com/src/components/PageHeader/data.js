import {
  PluginsIcon,
  ThemesIcon,
  BlogIcon,
  WebinarsIcon,
  GatsbyCloudIcon,
  PartnersIcon,
  ConciergeIcon,
  DrupalIcon,
  ContentfulIcon,
  WordpressIcon,
  SparkleIcon,
  ShopifyIcon,
  HowToGuideIcon,
  ReferenceGuideIcon,
  ConceptualGuideIcon,
  TutorialGuideIcon,
  CareersIcon,
  CloudDocumentation,
  AboutGatsbyIcon,
  UnionIcon,
  StartersIcon,
  AlgoliaIcon,
  GoogleAnalyticsIcon,
  SegmentIcon,
  TwitchIcon,
  YouTubeIcon,
  DiscordIcon,
  TwitterIcon,
  GatsbyCloudBuildsIcon,
  GatsbyCloudPreviewIcon,
  GatsbyCloudPricingIcon,
  GatsbyCloudHostingIcon,
  GatsbyCloudIntegrationsIcon,
  GatsbyFrameworkIcon,
  // commented because pages still need to be built
  // @ref https://github.com/gatsby-inc/mansion/pull/11277
  // LightningFastPerfIcon,
  DeveloperExperienceIcon,
  IntegrationsIcon,
  // PressIcon,
  GatsbyCampIcon,
  GatsbyCloudFunctionsIcon,
  Gatsby4Icon,
} from "../shared/icons"

// IDENTIFIERS

export const Identifiers = {
  GetStarted: `getStarted`,
  LogIn: `logIn`,
  Cloud: `cloud`,
}

// DETAILS

const docsDocumentation = [
  [
    {
      items: [
        // {
        //  text: `Overview`,
        //  url: `/docs/`,
        // },
        {
          text: `Quick Start`,
          url: `/docs/quick-start/`,
        },
        {
          text: `Tutorial`,
          url: `/docs/tutorial/`,
        },
      ],
    },
    {
      items: [
        {
          text: `How-To Guides`,
          url: `/docs/how-to/`,
        },
        {
          text: `Reference Guides`,
          url: `/docs/reference/`,
        },
        {
          text: `Conceptual Guides`,
          url: `/docs/conceptual/`,
        },
      ],
    },
  ],
]

// commented because pages still need to be built
// @ref https://github.com/gatsby-inc/mansion/pull/11277
// const pressDetails = [
//   [
//     {
//       items: [
//         {
//           text: `Events`,
//           url: `/docs/glossary/content-delivery-network/`,
//         },
//       ],
//     },
//     {
//       items: [
//         {
//           text: `In The News`,
//           url: `/docs/glossary/jamstack/`,
//         },
//       ],
//     },
//     {
//       items: [
//         {
//           text: `Press Releases`,
//           url: `/docs/glossary/jamstack/`,
//         },
//       ],
//     },
//   ],
// ]

const cloudIntegrations = [
  [
    {
      items: [
        {
          text: `WordPress`,
          url: `/plugins/gatsby-source-wordpress/`,
          Icon: WordpressIcon,
        },
        {
          text: `Contentful`,
          url: `/plugins/gatsby-source-contentful/`,
          Icon: ContentfulIcon,
        },
      ],
    },
    {
      items: [
        {
          text: `Shopify`,
          url: `/plugins/gatsby-source-shopify/`,
          Icon: ShopifyIcon,
        },
        {
          text: `Algolia`,
          url: `/plugins/gatsby-plugin-algolia/`,
          Icon: AlgoliaIcon,
        },
      ],
    },
    {
      items: [
        {
          text: `Google Analytics`,
          url: `/plugins/gatsby-plugin-google-analytics/`,
          Icon: GoogleAnalyticsIcon,
        },
        {
          text: `Segment`,
          url: `/plugins/gatsby-plugin-segment-js/`,
          Icon: SegmentIcon,
        },
      ],
    },
  ],
]

const cloudProducts = [
  [
    {
      items: [
        {
          text: `Builds`,
          url: `/products/cloud/builds/`,
          Icon: GatsbyCloudBuildsIcon,
        },
        {
          text: `Preview`,
          url: `/products/cloud/previews/`,
          Icon: GatsbyCloudPreviewIcon,
        },
        {
          text: `Hosting`,
          url: `/products/cloud/hosting/`,
          Icon: GatsbyCloudHostingIcon,
        },
        {
          text: `Functions`,
          url: `/products/cloud/functions/`,
          Icon: GatsbyCloudFunctionsIcon,
        },
      ],
    },
    {
      items: [
        {
          text: `Integrations`,
          url: `/products/cloud/integrations/`,
          Icon: GatsbyCloudIntegrationsIcon,
        },
        {
          text: `Pricing`,
          url: `/pricing/`,
          Icon: GatsbyCloudPricingIcon,
        },
      ],
    },
  ],
]

const cloudServices = [
  [
    {
      items: [
        // commented because pages still need to be built
        // @ref https://github.com/gatsby-inc/mansion/pull/11277
        // {
        //   text: `Support`,
        //   url: `/products/cloud/builds/`,
        // },
        {
          text: `Performance Audits`,
          url: `/products/concierge/performance/`,
        },
        {
          text: `Build Audits`,
          url: `/products/concierge/builds/`,
        },
      ],
    },
    {
      items: [
        {
          text: `Onboarding`,
          url: `/products/concierge/onboarding/`,
        },
        {
          text: `Migrations`,
          url: `/products/concierge/migration/`,
        },
      ],
    },
  ],
]

const useCaseDetails = [
  [
    {
      heading: {
        text: `By Industry`,
      },
      items: [
        {
          text: `Software & SaaS`,
          url: `/use-cases/software-saas/`,
        },
        {
          text: `Finance & Insurance`,
          url: `/use-cases/finance-insurance/`,
        },
        {
          text: `E-commerce`,
          url: `/use-cases/e-commerce/`,
        },
        {
          text: `Content & Media`,
          url: `/use-cases/content-media/`,
        },
      ],
    },
    {
      heading: {
        text: `By Technology`,
      },
      items: [
        {
          text: `WordPress`,
          url: `/solutions/wordpress/`,
          Icon: WordpressIcon,
        },
        {
          text: `Contentful`,
          url: `/use-cases/contentful/`,
          Icon: ContentfulIcon,
        },
        {
          text: `Drupal`,
          url: `/use-cases/drupal/`,
          Icon: DrupalIcon,
        },
        {
          text: `Shopify`,
          url: `/solutions/shopify/`,
          Icon: ShopifyIcon,
        },
      ],
    },
    {
      heading: {
        text: `By User`,
      },
      items: [
        {
          text: `Developers`,
          url: `/use-cases/developer/`,
        },
        {
          text: `Marketers`,
          url: `/use-cases/marketer/`,
        },
        {
          text: `Content Creators`,
          url: `/use-cases/content-creator/`,
        },
        {
          text: `Engineering Leaders`,
          url: `/use-cases/engineering-leader/`,
        },
      ],
    },
  ],
]

const eventsWebinars = [
  [
    {
      heading: {
        text: `Latest webinars`,
      },
      items: [
        {
          text: `Achieving the Optimal Gatsby Experience by Hosting in Gatsby Cloud`,
          url: `/resources/webinar/hosting-in-gatsby-cloud`,
        },
        {
          text: `Learn How Gatsby Can Supercharge Your WordPress Website`,
          url: `/wordpress-integration-webinar`,
        },
      ],
    },
  ],
]

const communityGuidesOld = [
  [
    {
      items: [
        {
          text: `Twitter`,
          url: `https://www.twitter.com/gatsbyjs`,
          Icon: TwitterIcon,
        },
        {
          text: `Twitch`,
          url: `https://www.twitch.tv/gatsbyjs`,
          Icon: TwitchIcon,
        },
      ],
    },
    {
      items: [
        {
          text: `Discord`,
          url: `https://gatsby.dev/discord`,
          Icon: DiscordIcon,
        },
        {
          text: `YouTube`,
          url: `https://www.youtube.com/gatsbyjs`,
          Icon: YouTubeIcon,
        },
      ],
    },
  ],
]

const partnerDetails = [
  [
    {
      items: [
        {
          text: `Agency Partners`,
          url: `/partners/agencies/`,
        },
      ],
    },
    {
      items: [
        {
          text: `Tech Partners`,
          url: `/partners/technology/`,
        },
      ],
    },
  ],
]

// DROPDOWNS

const whyGatsby = {
  dropdownWidth: "37.5rem",
  items: [
    // {
    //   text: `Modern Developer Experience`,
    //   url: `/developer-experience/`,
    //   description: `Use JavaScript, APIs, Markdown, Git, and more`,
    //   Icon: DeveloperExperienceIcon,
    // },
    // {
    //   text: `Lightning Fast Performance`,
    //   url: `/performance/`,
    //   description: `Boost your web performance with the fastest frontend`,
    //   Icon: LightningFastPerfIcon,
    // },
    // {
    //   text: `Connect All Your Content`,
    //   url: `/content-mesh/`,
    //   description: `Leverage GraphQL and 2500+ plugins to integrate your content`,
    //   Icon: IntegrationsIcon,
    // },
    {
      text: `Why Gatsby`,
      url: `/why-gatsby/`,
      description: `See why the best frontend teams choose Gatsby`,
      Icon: DeveloperExperienceIcon,
    },
    {
      text: `How It Works`,
      url: `/how-it-works/`,
      description: `Learn how Gatsby works on the inside`,
      Icon: IntegrationsIcon,
    },
    {
      text: `Who Uses Gatsby`,
      url: `/customers/`,
      description: `See how our customers use Gatsby`,
      Icon: AboutGatsbyIcon,
    },
    {
      text: `Use Cases`,
      url: `/use-cases/`,
      description: `Explore the many ways to use Gatsby`,
      Icon: UnionIcon,
      details: useCaseDetails,
      // colored: true,
    },
  ],
  bgColor: `purple`,
}

const cloud = {
  items: [
    {
      text: `Gatsby Cloud`,
      url: `/products/cloud/`,
      description: `The end-to-end platform for optimal Gatsby experiences`,
      Icon: GatsbyCloudIcon,
      details: cloudProducts,
    },
    {
      text: `Gatsby Concierge`,
      url: `/concierge/`,
      description: `Expert assistance for optimizing Gatsby websites and applications`,
      Icon: ConciergeIcon,
      details: cloudServices,
      colored: true,
    },
  ],
  bgColor: `magenta`,
}

const community = {
  dropdownWidth: "37.5rem",
  items: [
    {
      text: `Say hello to Gatsby 4`,
      url: "/gatsby-4/",
      description: `Check out the all-new Gatsby with SSR, DSG and more`,
      Icon: Gatsby4Icon,
    },
    {
      text: `Documentation`,
      url: "/docs",
      description: `Start building with Gatsby and its ecosystem`,
      Icon: GatsbyFrameworkIcon,
      details: docsDocumentation,
    },
    {
      text: `Gatsby Plugins`,
      url: "/plugins/",
      Icon: PluginsIcon,
      details: cloudIntegrations,
      description: `A rich ecosystem of 2500+ ready solutions and integrations`,
    },
    {
      text: `Starters`,
      url: `/starters/`,
      Icon: StartersIcon,
      description: `Get up and running with premade templates`,
    },
    {
      text: `Themes`,
      url: `/docs/themes/`,
      Icon: ThemesIcon,
      description: `Gain centralized control over web projects`,
    },
    {
      text: `Contributing`,
      url: `/contributing`,
      Icon: PartnersIcon,
      description: `Contribute to the Gatsby project`,
    },
  ],
  bgColor: `orange`,
}

const docs = {
  dropdownWidth: "37.5rem",
  items: [
    {
      text: `GatsbyCamp - Fall 21`,
      url: `/camp-fall-2021/`,
      Icon: GatsbyCampIcon,
      description: `Join us on September 16th`,
    },
    {
      text: `Community Showcase`,
      url: `/showcase/`,
      Icon: SparkleIcon,
      description: `Check out what the community is building`,
    },
    {
      text: `Webinars`,
      url: `/resources/webinars/`,
      description: `Learn more with live or on-demand webinars`,
      Icon: WebinarsIcon,
      details: eventsWebinars,
    },
    {
      text: `Blog`,
      url: `/blog/`,
      description: `Read the latest musings from Gatsby`,
      Icon: BlogIcon,
    },
    {
      text: `Community`,
      url: `/contributing/community/`,
      Icon: PartnersIcon,
      description: `Explore and interact with our community`,
      colored: true,
      details: communityGuidesOld,
    },
  ],
  bgColor: `orange`,
}

const company = {
  items: [
    {
      text: `About Us`,
      url: `/about/`,
      description: `Meet the team and learn about our story`,
      Icon: AboutGatsbyIcon,
    },
    {
      text: `Partners`,
      url: `/partners/`,
      description: `Grow with Gatsby and accelerate your business`,
      Icon: CloudDocumentation,
      details: partnerDetails,
    },
    {
      text: `Careers`,
      url: `/careers/`,
      Icon: CareersIcon,
      colored: true,
    },

    // {
    //   text: `Press`,
    //   url: `/press/`,
    //   description: `The latest from the Gatsby Press Room`,
    //   details: pressDetails,
    //   Icon: PressIcon,
    //   colored: true,
    // },
  ],
  bgColor: `purple`,
}

// SECTIONS

export const mainSection = [
  {
    text: `Why Gatsby`,
    dropdown: whyGatsby,
  },
  {
    text: `Products`,
    dropdown: cloud,
    identifier: Identifiers.Cloud,
  },
  {
    text: `Open Source`,
    dropdown: community,
  },
  {
    text: `Learn`,
    dropdown: docs,
  },
  {
    text: `Company`,
    dropdown: company,
  },
]

export const docsSection = [
  {
    url: `/docs/tutorial/`,
    text: `Tutorial`,
    Icon: TutorialGuideIcon,
    showIconOnDesktop: true,
  },
  {
    url: `/docs/how-to/`,
    text: `How-to Guides`,
    Icon: HowToGuideIcon,
    showIconOnDesktop: true,
  },
  {
    url: `/docs/reference/`,
    text: `Reference`,
    Icon: ReferenceGuideIcon,
    showIconOnDesktop: true,
  },
  {
    url: `/docs/conceptual/`,
    text: `Conceptual Guide`,
    Icon: ConceptualGuideIcon,
    showIconOnDesktop: true,
  },
]

const docSwitcher = {
  items: [
    {
      text: `v4 (beta)`,
      url: `https://v4.gatsbyjs.com/docs/`,
    },
    {
      text: `v3`,
      url: `https://www.gatsbyjs.com/docs/`,
    },
    {
      text: `v2`,
      url: `https://v2.gatsbyjs.com/docs/`,
    },
    {
      text: `v1`,
      url: `https://v1.gatsbyjs.org/docs/`,
    },
  ],
  bgColor: `purple`,
  dropdownWidth: `13rem`,
}

export const sideDocsSection = [
  {
    text: `Quick Start`,
    url: `/docs/quick-start/`,
    identifier: Identifiers.GetStarted,
  },
  {
    text: `v3`,
    dropdown: docSwitcher,
  },
]

export const sideSection = [
  {
    text: `Get Started`,
    url: `/get-started/`,
    identifier: Identifiers.GetStarted,
  },
]

const topLine = [
  {
    url: `/docs/`,
    text: `Documentation`,
    buttonSize: "S",
  },
  {
    url: `/support/`,
    text: `Support`,
    buttonSize: "S",
  },
  {
    url: `/contact-us/`,
    text: `Contact`,
    buttonSize: "S",
  },
  {
    url: `/dashboard/login/`,
    text: `Log in`,
    identifier: Identifiers.LogIn,
    buttonSize: "S",
  },
]

export const docsTopLineData = [
  {
    url: `/`,
    text: `Gatsbyjs.com`,
    buttonSize: "S",
  },
  {
    url: `/cloud/`,
    text: `Gatsby Cloud`,
    buttonSize: "S",
  },
  ...topLine,
]

export const topLineData = topLine

export const featuredMobileItems = {
  getStarted: sideSection[0],
  contact: topLine[1],
  logIn: topLine[2],
}
