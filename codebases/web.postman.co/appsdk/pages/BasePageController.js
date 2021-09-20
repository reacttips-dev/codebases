import { observable, action, computed } from 'mobx';
import PageMetadataService from '../../js/services/PageMetadataService';

/**
 * Base class for page controllers
 */
export default class BasePageController {
  _title = null;
  _pageDescription = null;
  @observable _header = null;

  didCreate () {
  }

  didActivate () {
    return Promise.resolve();
  }

  didDeactivate () {
  }

  getTitle () {
    return this._title;
  }

  getPageDescription () {
    return this._pageDescription;
  }

  @computed
  get header () {
    return this._header;
  }

  setTitle (title) {
    this._title = title;
    PageMetadataService.setPageTitle(this.getTitle());
  }

  setPageDescription (description) {
    this._pageDescription = description;
    PageMetadataService.setPageDescription(this.getPageDescription());
  }

  /*
  * Use this method to add custom meta tag for any given page.
  * For reference on how one can make most use of this function check the following doc
  * https://postmanlabs.atlassian.net/wiki/spaces/WF/pages/2980513325/
  *
  * @param {Array<Object>} properties is an array of objects which would be used to update the meta tags of the page.
  * The object would have `name` or `property` and values passed to update the meta tags.
  * For eg- properties = [
  *   {
  *     'property': 'og:site_name',
  *     'value': 'this is random key'
  *   },
  *   {
  *     'property': 'og:description',
  *     'value': 'this is custom description set'
  *   },
  *   {
  *     'name': 'twitter:title',
  *     'value': 'this is custom twitter name'
  *   }
  * ]
  */
  setPageMetaTags (properties = []) {
    this.metaProperties = {
      title: this._title,
      description: this._pageDescription,
      pageUrl: window.location.href,
      customProperties: properties
    };
    PageMetadataService.setPageMetaTags(this.metaProperties);
  }

  /*
  * To set image tags for open graph and other social media platforms
  * @param {string} url Image url which would be set for the page.
  */
  setMetaImageToPage (url) {
    PageMetadataService.setMetaImageTag(url);
  }

  /*
  * Sets canonical link tag to the page, this would help in creating canonical page tag.
  * @param {string} url Url of the page which would be putting canonical reference.
  */
  setCanonicalPageTag (url) {
    PageMetadataService.setCanonicalPageTag(url);
  }

  /*
  * To remove all the meta tags of the current page, this function is called in the PageService
  * before we are changing the route to any new page.
  */
  _clearPageMetaTags () {
    PageMetadataService.removePageMetaTags(this.metaProperties);
  }

  @action
  setHeader (header = {}) {
    this._header = header;
  }

  @action
  showHeader () {
    this._header = {
      ...this._header,
      hide: false
    };
  }

  @action
  hideHeader () {
    this._header = {
      ...this._header,
      hide: true
    };
  }

}
