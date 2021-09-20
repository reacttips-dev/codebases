const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { Analytics } = require('@trello/atlassian-analytics');
const { Feature } = require('app/scripts/debug/constants');
const { sendErrorEvent } = require('@trello/error-reporting');

const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'org_filtering',
);
const template = t.renderable(({ name, isDeleteable }) => {
  t.form('.js-add-tag-form', () => {
    t.label(() => {
      t.format('name');
      t.input('.js-add-tag-name.js-autofocus', {
        type: 'text',
        value: name,
      });
    });
    t.input('.nch-button.nch-button--primary', {
      type: 'submit',
      value: t.l('save'),
    });
    if (isDeleteable) {
      t.input('.nch-button.nch-button--danger.u-float-right.js-delete-tag', {
        type: 'button',
        value: t.l('delete'),
      });
    }
  });
});

class SetTagView extends View {
  events() {
    return {
      'submit .js-add-tag-form'(e) {
        try {
          e.preventDefault();
          if (this.options.boardView) {
            Analytics.sendTrackEvent({
              action: 'saved',
              actionSubject: 'collection',
              source: 'boardMenuDrawer',
            });
          } else {
            Analytics.sendTrackEvent({
              action: 'saved',
              actionSubject: 'collection',
              source: 'workspaceBoardsScreen',
            });
          }
          const name = this.$('.js-add-tag-name').val().trim();
          this.onSubmit(name);
        } catch (err) {
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-panorama',
              feature: Feature.Collections,
            },
          });
        }
      },
      'click .js-delete-tag'(e) {
        try {
          Util.stop(e);
          this.onDelete();
        } catch (err) {
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-panorama',
              feature: Feature.Collections,
            },
          });
        }
      },
    };
  }

  getName() {
    return '';
  }

  render() {
    this.$el.html(
      template({
        name: this.getName(),
        isDeleteable: this.onDelete,
      }),
    );

    return this;
  }
}

module.exports = SetTagView;
