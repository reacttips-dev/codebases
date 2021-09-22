module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-glamor/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-twitter/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-nprogress/gatsby-browser.js'),
      options: {"plugins":[],"color":"#61dafb"},
    },{
      plugin: require('../node_modules/gatsby-plugin-google-analytics/gatsby-browser.js'),
      options: {"plugins":[],"trackingId":"UA-41298772-1"},
    },{
      plugin: require('../node_modules/gatsby-plugin-catch-links/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"React Docs","short_name":"React","lang":"en","start_url":"/","background_color":"#20232a","theme_color":"#20232a","display":"standalone","icon":"static/logo-512x512.png","legacy":true,"cache_busting_mode":"query","include_favicon":true,"theme_color_in_head":true,"cacheDigest":"f4d46f030265b4c48a05c999b8d93791"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
