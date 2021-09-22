// DEPRECATED. Please don't use this or make changes to this unless you know
// what you are doing.
import Backbone from 'backbone';

import Instructors from 'js/collections/instructors';
import Topics from 'js/collections/topics';
import _tPartnerName from 'i18n!js/json/nls/universities';
import Coursera from 'js/lib/coursera';
import path from 'js/lib/path';
import util from 'js/lib/util';

const University = Backbone.Model.extend({
  defaults: {},

  get(key) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);
    switch (key) {
      case 'name':
        return _tPartnerName(parentValue);
      default:
        return parentValue;
    }
  },

  getUnlocalizedName() {
    return this.constructor.__super__.get.apply(this, 'name');
  },

  initialize() {
    this.updateComputed();
    this.on('change', this.updateComputed, this);
  },

  updateComputed() {
    if (!this.get('topics') || !(this.get('topics') instanceof Topics)) {
      this.set('topics', new Topics(this.get('topics')), { silent: true });
    }
    if (!this.get('instructors') || !(this.get('instructors') instanceof Instructors)) {
      this.set('instructors', new Instructors(this.get('instructors')), { silent: true });
    }
  },

  getPrettyWebsiteUrl() {
    return util.prettifyUrl(this.get('website'));
  },

  getLink() {
    return this.get('home_link') || path.join(Coursera.config.dir.home, this.get('short_name'));
  },

  getSquareLogo() {
    return this.get('square_logo');
  },

  /**
   * Get description with some logic built in to allow for special tranaslations that aren't
   * supported by default in our translations platform.
   * NOTE: talk to lewis to learn more about this.
   * NOTE: don't modify this unless you know what you're doing.
   * NOTE: Refer to SPLZS-643 for more information on translations done.
   * @param  {string} identifier some sort of identifier that this function can match on.
   * @return {string} description of this uniersity
   */
  getDescription(identifier) {
    if (identifier === 'whartonchinese') {
      return `宾夕法尼亚大学（简称为宾大）是一所位于美国宾夕法尼亚州费城的私立大学。
宾夕法尼亚大学不仅是常青藤盟校之一，而且是美国第四古老的高等教育机构
，它被认为是美国第一所同时提供本科和研究生教育的大学。`;
    } else {
      return this.get('description');
    }
  },
});

export default University;
