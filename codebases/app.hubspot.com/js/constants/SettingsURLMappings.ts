/** ************************************************************
  CAUTION: This is a test and a bit brittle at the moment.
  If one of the settings pages in `to` urls changes without
  updating this list and without providing redirects, it could
  send users to a bad place. We want to be able to test that
  these urls are still working in some way.

  If you are updating a url in this list, please also update
  the mirror in the selenium tests.
**************************************************************/
var settingsUrlMappings = {
  EMAIL: {
    from: 'email',
    to: '/settings/**{portalId}**/marketing/email'
  },
  SOCIAL: {
    from: 'social',
    to: '/social/**{portalId}**/settings'
  },
  SOCIAL_REPORTS: {
    from: 'social-reports',
    to: '/social/**{portalId}**/settings'
  },
  ADS: {
    from: 'ads',
    to: '/settings/**{portalId}**/marketing/ads'
  },
  FORMS: {
    from: 'forms',
    to: '/settings/**{portalId}**/marketing/form'
  },
  DEALS: {
    from: /(sales|contacts)\/\d+\/(deals|objects\/0-3)/i,
    to: '/sales-products-settings/**{portalId}**/deals'
  },
  TASKS: {
    from: 'tasks',
    to: '/settings/**{portalId}**/user-preferences/tasks'
  },
  MEETINGS: {
    from: 'meetings',
    to: '/settings/**{portalId}**/user-preferences/calendar'
  },
  TICKETS: {
    from: /(sales|contacts)\/\d+\/(tickets|objects\/0-5)/i,
    to: '/sales-products-settings/**{portalId}**/tickets'
  },
  CONTACTS: {
    from: /(sales|contacts)\/\d+\/(contacts|objects\/0-1)/i,
    to: '/sales-products-settings/**{portalId}**/contacts'
  },
  COMPANIES: {
    from: /(sales|contacts)\/\d+\/(companies|objects\/0-2)/i,
    to: '/sales-products-settings/**{portalId}**/contacts'
  },
  ANALYTICS_TOOLS: {
    from: 'analytics',
    to: '/settings/**{portalId}**/analytics-and-tracking'
  },
  CUSTOM_REPORTS: {
    from: 'reports',
    to: '/settings/**{portalId}**/analytics-and-tracking'
  },
  CONTACT: {
    from: /(sales|contacts)\/\d+\/contact/i,
    to: '/sales-products-settings/**{portalId}**/contacts'
  },
  COMPANY: {
    from: /(sales|contacts)\/\d+\/company/i,
    to: '/sales-products-settings/**{portalId}**/contacts'
  },
  DEAL: {
    from: /(sales|contacts)\/\d+\/deal/i,
    to: '/sales-products-settings/**{portalId}**/deals'
  },
  TICKET: {
    from: /(sales|contacts)\/\d+\/ticket/i,
    to: '/sales-products-settings/**{portalId}**/tickets'
  },
  INBOX: {
    from: 'live-messages',
    to: '/live-messages-settings/**{portalId}**/inboxes'
  },
  BLOGS: {
    from: /(website|blog)\/\d+\/(blog)/i,
    to: '/settings/**{portalId}**/website/blogs'
  },
  SITE_PAGES: {
    from: /(website|pages)\/\d+\/(pages\/site|manage\/site)/i,
    to: '/settings/**{portalId}**/website/pages/'
  },
  LANDING_PAGES: {
    from: /(website|pages)\/\d+\/(pages\/landing|manage\/landing)/i,
    to: '/settings/**{portalId}**/website/pages/'
  },
  PAGE_EDITOR: {
    from: /content\/\d+\/edit/i,
    to: '/settings/**{portalId}**/website/pages/'
  },
  BLOG_EDITOR: {
    from: /blog\/\d+\/edit/i,
    to: '/settings/**{portalId}**/website/blogs'
  },
  BLOG_DETAIL_PAGE: {
    from: /content-detail\/\d+\/blog-post/i,
    to: '/settings/**{portalId}**/website/blogs'
  },
  SITE_DETAIL_PAGE: {
    from: /content-detail\/\d+\/(site-page|landing-page)/i,
    to: '/settings/**{portalId}**/website/pages/'
  },
  FORECASTING: {
    from: 'forecasting',
    to: '/settings/**{portalId}**/sales/forecasting'
  },
  QUOTES: {
    from: 'quotes',
    to: '/settings/**{portalId}**/sales/products/quotes'
  },
  LINE_ITEMS: {
    from: 'line-items',
    to: '/sales-products-settings/**{portalId}**/deals'
  },
  CUSTOM_OBJECTS: {
    from: /(sales|contacts)\/\d+\/objects/i,
    to: '/sales-products-settings/**{portalId}**/object/'
  }
};
export default settingsUrlMappings;