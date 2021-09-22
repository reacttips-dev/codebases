import Button from 'core/src/views/modules/button';
import LikeButtonView from 'core/src/views/modules/buttons/like-button';

const NotesLikesMixin = {
  initializeLikeButton: function() {
    this.$noteStatLikes = this.$('.note-stat-likes');
    const data = {
      voteable_id: this.model.get('id'),
      voteable_type: 'Note',
    };

    const userVote = this.model.get('userVote');
    let buttonInitialState = Button.states.INACTIVE;
    if (userVote && userVote.value === 1) {
      _.extend(data, {
        voteId: this.model.get('userVote').id,
      });
      buttonInitialState = Button.states.ACTIVE;
    }

    this.likeButtonView = new LikeButtonView({
      container: this.$('.note-like'),
      parentModel: this.model,
      modelData: data,
      type: 'label',
      styles: 'alternate',
      initialState: buttonInitialState,
    });
    this.listenTo(this.model, 'change:numLikes', this.onLikeUpdate);
  },
  onLikeUpdate: function(model, numLikes) {
    const userVote = this.model.get('userVote');
    if (userVote && userVote.value === 1) {
      this.$noteStatLikes.addClass('liked');
    } else {
      this.$noteStatLikes.removeClass('liked');
    }

    if (numLikes < 1) {
      this.$noteStatLikes.hide();
      return;
    }

    this.$noteStatLikes.html(numLikes).show();
  },
};
export default NotesLikesMixin;

