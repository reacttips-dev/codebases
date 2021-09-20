/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');

class EmojiUploaderView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'upload emoji';
  }

  events() {
    return {
      'click .js-upload-emoji': 'uploadEmoji',
      'change .js-upload-emoji-file': 'fileChange',
      'input .js-emoji-name': 'nameChange',
    };
  }

  initialize({ completerView }) {
    this.completerView = completerView;
    this.hasGold = this.model.hasPremiumFeature('customEmoji');
    this.hasBCGold = false;
    this.teamEnabledFeature = this.options.card
      ?.getBoard()
      ?.getOrganization()
      ?.hasPremiumFeature('customEmoji');
    this.canUpload = this.hasGold || this.hasBCGold || this.teamEnabledFeature;

    return (() => {
      const result = [];
      for (const org of Array.from(this.model.organizationList.models)) {
        this.hasBCGold = org.isFeatureEnabled('goldMembers');
        if (this.hasBCGold) {
          break;
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  render() {
    const data = this.model.toJSON();
    data.emojiName = this.options.emojiName;
    data.hasGold = this.hasGold;
    data.hasBCGold = this.hasBCGold;
    data.showTeamUpsell = !this.teamEnabledFeature && !this.hasBCGold;
    data.canUpload = this.canUpload;

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_emoji_uploader'),
        data,
      ),
    );

    this._validate();
    this.renderEmoji();

    return this;
  }

  getName() {
    return this.$('.js-emoji-name')
      .val()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
  }

  renderEmoji() {
    this.$('.js-emoji-preview-name').text(`:${this.getName() || '???'}:`);

    const $file = this.$('.js-upload-emoji-file');
    const file = __guard__($file.prop('files'), (x) => x[0]);
    if (new RegExp(`^image/.*`).test(file != null ? file.type : undefined)) {
      const reader = new FileReader();
      reader.onload = (file) => {
        this.$('.js-emoji-conversion').removeClass('hide');
        return this.$('.js-emoji-preview').attr('src', file.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.$('.js-emoji-conversion').addClass('hide');
    }

    return this;
  }

  fileChange(e) {
    const $name = this.$('.js-emoji-name');
    const $file = this.$('.js-upload-emoji-file');
    if ($name.val() === '') {
      let name;
      const file = __guard__($file.prop('files'), (x) => x[0]);
      if (file != null) {
        ({ name } = file);
      } else if ($file.val()) {
        // Proably IE, try to get the file from the path
        name = __guard__(
          new RegExp(`[^\\/]+$`).exec($file.val()),
          (x1) => x1[0],
        );
      }

      if (name == null) {
        name = '';
      }
      name = name.split('.')[0]; // Remove the extension(s)
      name = name.toLowerCase().replace(/[^a-z0-9_]/g, '');

      $name.val(name);
      this.$('.js-emoji-name').focus().select();
    }

    this.renderEmoji();
    return this._validate();
  }

  nameChange(e) {
    this.renderEmoji();
    return this._validate();
  }

  _validate(e) {
    const name = this.getName();

    const $file = this.$('.js-upload-emoji-file');

    const nameValid = /^[a-z0-9_\s]+$/.test(name);
    const fileValid =
      __guard__($file.prop('files'), (x) => x.length) > 0 || $file.val();
    const valid = nameValid && fileValid && this.canUpload;

    this.$('.js-invalid-name').toggleClass('hide', nameValid || name === '');
    return this.$('.js-upload-emoji').toggleClass('disabled', !valid);
  }

  uploadEmoji(e) {
    Util.stop(e);
    if ($('.js-upload-emoji').hasClass('disabled')) {
      return;
    }

    this.$('.error').addClass('hide');

    const $file = this.$('.js-upload-emoji-file');
    const file = __guard__($file.prop('files'), (x) => x[0]);
    const name = this.getName();

    const onSuccess = () => {
      this.completerView.insertEmoji(name);
      return PopOver.hide();
    };

    if (!file && $file.val()) {
      // Yuck, it's IE.  Let's submit the form.
      Util.uploadFile(Auth.myToken(), $file, onSuccess);
      return;
    }

    if (file != null && !Util.validFileSize(file)) {
      Alerts.flash('file too large', 'error', 'emoji-uploader');
      return;
    }

    if (file == null || !name) {
      return;
    }

    const reader = new FileReader();
    const fd = new FormData();
    fd.append('token', Auth.myToken());
    fd.append('file', file);
    fd.append('name', name);
    const idOrganization = this.options.card?.getBoard()?.getOrganization()?.id;
    if (idOrganization) {
      fd.append('idOrganization', idOrganization);
    }

    reader.onload = (file) => {
      return this.model.customEmojiList.create(
        {
          url: file.target.result,
          name,
        },
        {
          data: fd,
          processData: false,
          contentType: false,
          success: onSuccess,
          error() {
            return this.$('.error').removeClass('hide');
          },
        },
      );
    };

    return reader.readAsDataURL(file);
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
EmojiUploaderView.initClass();
module.exports = EmojiUploaderView;
