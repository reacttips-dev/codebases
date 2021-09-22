module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-catch-links/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-twitter/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-image/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-canonical-urls/gatsby-browser.js'),
      options: {"plugins":[],"siteUrl":"https://www.gatsbyjs.com","stripQueryString":true},
    },{
      plugin: require('../node_modules/gatsby-plugin-typography/gatsby-browser.js'),
      options: {"plugins":[],"pathToConfigModule":"src/utils/typography"},
    },{
      plugin: require('../node_modules/gatsby-plugin-mdx/gatsby-browser.js'),
      options: {"plugins":[],"extensions":[".md",".mdx"],"gatsbyRemarkPlugins":["gatsby-remark-embed-video",{"resolve":"gatsby-remark-images","options":{"maxWidth":786,"backgroundColor":"#ffffff"}},{"resolve":"gatsby-remark-responsive-iframe","options":{"wrapperStyle":"margin-bottom: 1.5rem"}},"gatsby-remark-autolink-headers","gatsby-remark-copy-linked-files","gatsby-remark-smartypants"],"defaultLayouts":{},"lessBabel":false,"remarkPlugins":[],"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/usr/src/app/www/cloud/gatsbyjs.com"},
    },{
      plugin: require('../node_modules/gatsby-remark-autolink-headers/gatsby-browser.js'),
      options: {"plugins":[],"offsetY":0,"className":"anchor"},
    },{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":786,"backgroundColor":"#ffffff","linkImagesToOriginal":true,"showCaptions":false,"markdownCaptions":false,"sizeByPixelDensity":false,"quality":50,"withWebp":false,"tracedSVG":false,"loading":"lazy","disableBgImageOnAlpha":false,"disableBgImage":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-nprogress/gatsby-browser.js'),
      options: {"plugins":[],"color":"#663399","showSpinner":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-gatsby-cloud/gatsby-browser.js'),
      options: {"plugins":[],"mergeSecurityHeaders":false,"headers":{"/frameable":[],"/site-create":[],"/dashboard/previews/login":[]}},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Gatsby","short_name":"Gatsby","start_url":"/","background_color":"#ffffff","theme_color":"#663399","display":"minimal-ui","icon":"./static/favicon.production.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"3ad5294f3fa6c06e2d07ab07c76df2cf"},
    },{
      plugin: require('../node_modules/gatsby-source-wordpress/gatsby-browser.js'),
      options: {"plugins":[],"url":"https://gatsbycontent.wpengine.com/graphql","verbose":true,"schema":{"queryDepth":5,"typePrefix":"Wp","timeout":30000,"perPage":25,"circularQueryLimit":5,"requestConcurrency":15,"previewRequestConcurrency":5},"develop":{"nodeUpdateInterval":3000,"hardCacheMediaFiles":true,"hardCacheData":false},"production":{"hardCacheMediaFiles":false,"allow404Images":false},"debug":{"graphql":{"showQueryOnError":false,"showQueryVarsOnError":true,"copyQueryOnError":true,"panicOnError":true,"onlyReportCriticalErrors":true,"copyNodeSourcingQueryAndExit":false,"writeQueriesToDisk":false,"printIntrospectionDiff":false},"preview":false,"timeBuildSteps":false,"disableCompatibilityCheck":false,"throwRefetchErrors":false}},
    },{
      plugin: require('../node_modules/gatsby-plugin-sentry/gatsby-browser.js'),
      options: {"plugins":[],"dsn":"https://7882c902f1bc41f39cd9e533092d6581@sentry.io/1405194","environment":"production","enabled":true},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
