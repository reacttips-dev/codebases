import SSView from 'core/src/views/base/ss-view';
import LearnModeNotesCollectionView from 'core/src/views/collection-views/learn-mode-notes-collection-view';
import NumberHelpers from 'core/src/helpers/number-helpers';
import template from 'text!core/src/templates/class-details/shared/_learn-mode-session-item-view.mustache';

const LearnModeSessionItemView = SSView.extend({

  className: 'learn-mode-session',

  template: template,

  templateData: function() {
    return _.extend({}, this.model.attributes, {
      numNotesString: NumberHelpers.pluralize(this.model.notes.length, 'Note'),
    });
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['collectionView']));
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);
    const learnModeNotesCollectionView = new LearnModeNotesCollectionView({
      el: this.$('.learn-mode-notes-collection-wrapper'),
      collection: this.model.notes,
    });
    this.listenTo(learnModeNotesCollectionView, 'click:videoTime', this.onVideoTime);
    this.listenTo(this.model.notes, 'remove', this.onNoteRemove);
  },

  onNoteRemove: function() {
    if (this.model.notes.length === 0) {
      this.remove();
    }
  },

  onVideoTime: function(note) {
    this.collectionView.trigger('click:videoTime', note);
  },

});

export default LearnModeSessionItemView;

