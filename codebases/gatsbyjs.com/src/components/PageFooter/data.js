import { LoginIcon } from "../shared/icons/LoginIcon"
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaTwitch,
  FaYoutube,
  FaDiscord,
  FaLinkedin,
} from "react-icons/fa"

export const socialNetworks = [
  {
    name: `Github`,
    url: `https://github.com/gatsbyjs`,
    icon: FaGithub,
  },
  {
    name: `Twitter`,
    url: `https://twitter.com/gatsbyjs`,
    icon: FaTwitter,
  },
  {
    name: `Discord`,
    url: `https://gatsby.dev/discord`,
    icon: FaDiscord,
  },
  {
    name: `Instagram`,
    url: `https://www.instagram.com/gatsbyjs/`,
    icon: FaInstagram,
  },
  {
    name: `Youtube`,
    url: `https://www.youtube.com/gatsbyjs`,
    icon: FaYoutube,
  },
  {
    name: `Twitch`,
    url: `https://www.twitch.tv/gatsbyjs`,
    icon: FaTwitch,
  },
  {
    name: `LinkedIn`,
    url: `https://www.linkedin.com/company/gatsbyjs`,
    icon: FaLinkedin,
  },
]

const OpenSource = {
  items: [
    {
      url: `/docs/`,
      text: `Documentation`,
    },
    {
      url: `/docs/quick-start/`,
      text: `Quick Start`,
    },
    {
      url: `/docs/tutorial/`,
      text: `Tutorial`,
    },
    {
      url: `/docs/how-to/`,
      text: `How-To Guides`,
    },
    {
      url: `/docs/reference/`,
      text: `Reference Guides`,
    },
    {
      url: `/docs/conceptual/`,
      text: `Conceptual Guides`,
    },
    {
      url: `/docs/reference/gatsby-cli/`,
      text: `Gatsby CLI`,
    },
    {
      url: `https://github.com/gatsbyjs`,
      text: `Github`,
      Icon: FaGithub,
      shifted: true,
    },
  ],
  heading: {
    text: `Open Source`,
  },
}

const GatsbyCloud = {
  items: [
    {
      url: `/cloud/`,
      text: `Why Gatsby Cloud?`,
    },
    {
      url: "/support/",
      text: "Support",
    },
    {
      url: `/integrations/`,
      text: `Integrations `,
    },
    {
      url: `/guides/`,
      text: `Guides`,
    },
    {
      url: `/pricing/`,
      text: `Pricing`,
    },
    {
      url: `/dashboard`,
      text: `Log in`,
      Icon: LoginIcon,
      shifted: true,
    },
  ],
  heading: {
    text: `Gatsby Cloud`,
  },
}

const Features = {
  items: [
    {
      url: "/features/",
      text: "Comparison",
    },
    {
      url: "/plugins/",
      text: "Plugins",
    },
    {
      url: "/docs/themes/",
      text: "Themes",
    },
    {
      url: "/docs/recipes/",
      text: "Recipes",
    },
    {
      url: "/starters/?v=2",
      text: "Starters",
    },
    {
      url: "/use-cases/",
      text: "Use Cases",
    },
  ],
  heading: {
    text: "Features",
  },
}

const Community = {
  items: [
    {
      url: "/contributing/",
      text: "Contributing",
    },
    {
      url: "https://store.gatsbyjs.org/",
      text: "Swag Store",
    },
    {
      url: "/contributing/code-of-conduct/",
      text: "Code of Conduct",
    },
    {
      url: "/contributing/gatsby-style-guide/",
      text: "Style Guide",
    },
    {
      url: "/contributing/translation/",
      text: "Translations",
    },
    {
      url: "https://www.twitch.tv/gatsbyjs",
      text: "Live Streams",
    },
  ],
  heading: {
    text: "Community",
  },
}

const Events = {
  items: [
    {
      url: "/resources/webinars/",
      text: "Webinars",
    },
    {
      url: "/resources/gatsby-days/",
      text: "Gatsby Days",
    },
  ],
  heading: {
    text: "Events",
  },
}

const Company = {
  items: [
    {
      url: "/about/",
      text: "About us",
    },
    {
      url: "/blog/",
      text: "Blog",
    },
    {
      url: "/contact-us/",
      text: "Contact Us",
    },
    {
      url: "/careers/",
      text: "Careers",
    },
    {
      url: `/partners/`,
      text: `Partners`,
    },
  ],
  heading: {
    text: "Company",
  },
}

export const navData = [
  OpenSource,
  GatsbyCloud,
  Features,
  Community,
  Events,
  Company,
]
