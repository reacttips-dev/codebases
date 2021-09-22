import Backbone from 'backbone';
import _ from 'underscore';
import Topics from 'js/collections/topics';
import Coursera from 'js/lib/coursera';
import util from 'js/lib/util';
import path from 'js/lib/path';

const instructor = Backbone.Model.extend({
  initialize() {
    this.updateComputed();
    this.on('change', this.updateComputed, this);
  },

  updateComputed() {
    if (!this.get('topics') || !(this.get('topics') instanceof Topics)) {
      this.set('topics', new Topics(this.get('topics')), {
        silent: true,
      });
    }

    this.set(
      'full_name',
      util.concatName({
        first_name: this.get('first_name'),
        middle_name: this.get('middle_name'),
        last_name: this.get('last_name'),
      }),
      {
        silent: true,
      }
    );
  },

  getDecoratedName() {
    let decoratedName = '';
    if (this.get('prefix_name')) {
      decoratedName += this.get('prefix_name') + ' ';
    }
    decoratedName += this.get('full_name');
    if (this.get('suffix_name')) {
      decoratedName += ', ' + this.get('suffix_name');
    }
    return decoratedName;
  },

  getPrettyWebsiteUrl() {
    return util.prettifyUrl(this.get('website'));
  },

  getLink() {
    const id = this.get('short_name') || '~' + this.get('id');
    return path.join(Coursera.config.url.base, 'instructor', id);
  },

  shouldDisplay() {
    return this.getDecoratedName();
  },

  sync(callback) {
    const self = this;

    if (!_.isUndefined(self.get('bio'))) {
      callback();
    } else if (this.get('short_name') || this.get('profile_id')) {
      Coursera.api
        .get('user/instructorprofile', {
          data: {
            id: this.get('profile_id'),
            short_name: this.get('short_name'),
          },
        })
        .done(function (data) {
          self.set(data[0]);
          callback();
        })
        .fail(function (jqXHR) {
          callback(jqXHR.status);
        });
    }
  },
});

export default instructor;
