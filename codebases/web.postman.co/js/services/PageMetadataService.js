
/**
 * Adds or updated the existing meta property for the page as per the arguments passed to this function.
 * @param {string} attributeName the name of the property which would be used to add/update the meta tag
 * @param {string} attributeType whether it would be "property" or "name".
 * @param {string} attributeValue the value of the meta tag which would be updated.
 */
function addMetaPropertyTag (attributeName, attributeType, attributeValue) {
  // Look for existing meta tags with the given property
  let metaTag = document.querySelector(`meta[${attributeType}="${attributeName}"]`);
  if (metaTag) {
    metaTag.setAttribute('content', attributeValue);
    return;
  }

  metaTag = document.createElement('meta');
  metaTag.setAttribute(attributeType, attributeName);
  metaTag.setAttribute('content', attributeValue);
  document.getElementsByTagName('head')[0].appendChild(metaTag);
}

const PageMetadataService = {
  setPageTitle: function (title) {
    document.title = (title) ? title : 'Postman';
  },

  resetPageTitle: function () {
    document.title = 'Postman';
  },

  setPageDescription: function (description) {
    // Look for existing description meta tags
    let descriptionTag = document.querySelector('meta[name="description"]');

    // If an empty or no description is provided
    if (!description) {
      // cleanup existing description tag if it exists
      descriptionTag && descriptionTag.parentNode.removeChild(descriptionTag);

      // exit
      return;
    }

    // If there is an existing description meta tag
    // Update it with the description provided
    if (descriptionTag) {
      descriptionTag.setAttribute('content', description);
    }

    // create one otherwise
    else {
      addMetaPropertyTag('description', 'name', description);
    }
  },

  /*
  * Sets image to the page, this would help in creating image rich cards when any page is shared in social media.
  * @param {string} imageUrl Url of the image which would be shown when shared in social media like twitter.
  */
  setMetaImageTag: function (imageUrl) {
    /*
    * If image url is set for a given page then we want to create specific page meta tags
    */
    if (imageUrl) {
      addMetaPropertyTag('og:image', 'property', imageUrl);
      addMetaPropertyTag('twitter:image', 'name', imageUrl);
      addMetaPropertyTag('twitter:card', 'name', 'summary_large_image');
    } else {
      addMetaPropertyTag('twitter:card', 'name', 'summary');
    }
  },

  /*
  * Sets canonical link tag to the page, this would help in creating canonical page tag.
  * @param {string} canonicalUrl Url of the page which would be putting canonical reference.
  */
  setCanonicalPageTag: function (canonicalUrl) {
    /*
    * If canonical page url is set for a given page then we want to create specific page meta tags
    */
    if (canonicalUrl) {
      const linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'canonical');
      linkTag.setAttribute('key', canonicalUrl);
      linkTag.setAttribute('href', canonicalUrl);
      document.getElementsByTagName('head')[0].appendChild(linkTag);
    }
  },

  /*
  * Sets custom meta tags to the page, this used to improve the social share experience for page.
  * @param {object} properties all the custom properties which needs to be set.
  */
  setPageMetaTags: function (properties = {}) {

    /*
    * Adding default og tags which are relevant for normal pages.
    * ******* DO MAKE SURE TO ADD THE METATAG IN removePageMetaTags *********
    */
    addMetaPropertyTag('og:title', 'property', properties.title);
    addMetaPropertyTag('og:description', 'property', properties.description);
    addMetaPropertyTag('og:url', 'property', properties.pageUrl);
    addMetaPropertyTag('og:site_name', 'property', 'Postman');
    addMetaPropertyTag('og:type', 'property', 'website');

    /*
    * Adding default twitter tags which are relevant for normal pages.
    */
    addMetaPropertyTag('twitter:title', 'name', properties.title);
    addMetaPropertyTag('twitter:description', 'name', properties.description);
    addMetaPropertyTag('twitter:creator', 'name', '@getpostman');
    addMetaPropertyTag('twitter:site', 'name', '@getpostman');

    /*
    *  If there are custom properties required to be set then the consumer of this function can send those properties
    * as a key value pair. For example if certain pages need "twitter:site" and value as "@postman"
    * properties = {
    *  "customProperty" : [
    *   {
    *     'property': 'og:site_name',
    *     'value': 'this is random key'
    *   },
    *   {
    *     'name': 'twitter:site',
    *     'value': '@postman'
    *   }
    * ]
    * This would create a new metatag for the given page with the "twitter:site" else will update any existing metatag.
    */

    if (!properties.customProperties) {
      return;
    }
    for (let property of properties.customProperties) {
        if (property.name) {
          addMetaPropertyTag(property.name, 'name', property.value);
        } else {
          addMetaPropertyTag(property.property, 'property', property.value);
        }
    }
  },

  /*
  * To remove all the meta tags of the current page. By default we shall remove all the generic meta tags. Apart from
  * the generic meta tags there might be few custom meta tags which are added by the user, to remove those custom meta
  * tags pass the properties object. Properties object is the basePageController reference object which was used to
  * create custom properties.
  *
  * @params {object} properties Properties which were used in the BasePageController to create custom meta tags.
  */
  removePageMetaTags: function (properties) {
    let defaultTags = {
      'og:title': 'property',
      'og:description': 'property',
      'og:url': 'property',
      'og:site_name': 'property',
      'og:type': 'property',
      'og:image': 'property',
      'twitter:title': 'name',
      'twitter:description': 'name',
      'twitter:creator': 'name',
      'twitter:site': 'name',
      'twitter:image': 'name',
      'twitter:card': 'name'
    };

    // Removes all the default properties which we added
    for (let property in defaultTags) {
      if (defaultTags.hasOwnProperty(property)) {
        let metaTag = document.querySelector(`meta[${defaultTags[property]}="${property}"]`);
        metaTag && metaTag.parentNode.removeChild(metaTag);
      }
    }

    if (!properties || !properties.customProperties) {
      return;
    }

    // Removes all the custom properties
    for (let property of properties.customProperties) {
      if (property.name) {
        let metaTag = document.querySelector(`meta[name="${property.name}"]`);
        metaTag && metaTag.remove();
      } else {
        let metaTag = document.querySelector(`meta[property="${property.property}"]`);
        metaTag && metaTag.remove();
      }
    }
  },

  /*
  * To remove any canonical page tag which was add.
  */
  removeCanonicalPageTag: function () {
    let metaTags = document.querySelectorAll('link[rel="canonical"]');
    for (let metaTag of metaTags) {
      metaTag.remove();
    }
  },

  setPageAs404: function () {
    /*
    We are using prerender for server side rendering of pages requested by bots.
    when we have any invalid url, we want to serve the bot as 404 http status code which is recommended SEO practice,
    but by default any response served would be having 200 http status code.
    To overcome this issue, we need to set a new meta tag in the invalid pages which would help the headless browser to
    render appropriate http status code, like 404 for not found pages.
    Read more: https://docs.prerender.io/article/11-best-practices
     */
    let metaTagFor404Page = document.querySelector('meta[name="prerender-status-code"]');
    if (metaTagFor404Page) {
      return;
    }

    metaTagFor404Page = document.createElement('meta');
    metaTagFor404Page.setAttribute('name', 'prerender-status-code');
    metaTagFor404Page.setAttribute('content', '404');
    document.getElementsByTagName('head')[0].appendChild(metaTagFor404Page);
  },

  resetMetaTagFor404Page: function () {
    // We want to manually reset any meta tage for 404 pages if the previous route was 404.
    let metaTagFor404Page = document.querySelector('meta[name="prerender-status-code"]');
    metaTagFor404Page && metaTagFor404Page.remove();
  }
};

export default PageMetadataService;
