import PageSession from 'core/src/utils/page-session';

const FollowForm = Backbone.View.extend({
  followLink: null,

  events: {
    'click .btn-follow': 'submit',
    'hover .btn-follow': 'hover',
  },

  initialize: function() {
    _.bindAll(this, 'onSuccess', 'update');
    this.followLink = this.$('.btn-follow');
    //  We use the prefix f to denote the follow btn type
    //  We should think about a 'type' option
    this.followableId = 'f' + this.$('input[name="id"]').val();
    this.followEndpoint = this.$('input[name="follow-endpoint"]').val();
    this.unfollowEndpoint = this.$('input[name="unfollow-endpoint"]').val();
    this.model = new Backbone.Model();
    this.model.url = this.$el.attr('action');
    this.model.set('isFollowing', this.$el.hasClass('following'));
    PageSession.remember(this, this.followableId);
  },

  submit: function() {
    this.model.fetch({
      data: this.$el.serialize(),
    }).done(this.onSuccess);
  },

  onSuccess: function(response) {
    if (Number(response) === 301) {
      const loc = window.location;
      window.location.replace(loc.protocol + '//' + loc.hostname + '/login');
    } else {
      PageSession.notify(this.followableId);
    }
  },

  //  We should be using the model to sync with the server
  //  But because we're using PageSession to notify, this method can
  //  be called from a notification, and hence its model won't be updated
  //  Ideally, this is all model-owned and we listen to change, but we
  //  need a way of informing models of the same kind that they should update
  update: function() {
    let btnText;
    let gaAction;

    // since we're updating the isFollowing value, invert it, then set
    // it on the model again
    const isFollowing = !this.model.get('isFollowing');
    this.model.set('isFollowing', isFollowing);
    this.$el.toggleClass('following');

    if (isFollowing) {
      this.$el.attr('action', this.unfollowEndpoint);
      this.model.url = this.unfollowEndpoint;
      gaAction = 'Click Unfollow';
      btnText = 'Unfollow';
    } else {
      this.$el.attr('action', this.followEndpoint);
      this.model.url = this.followEndpoint;
      gaAction = 'Click Follow';
      btnText = 'Follow';
    }

    this.followLink.attr('ga-action', gaAction);
    this.$('.btn-follow').html(btnText);
  },

  hover: function() {
    //  If we're already in follow mode
    // if (this.model.get('isFollowing') === true) {
    //     var btnText = (e.type === 'mouseenter' ? 'Unfollow' : 'Following');
    //     this.$('.btn-follow').html(btnText);
    // }
  },
});

export default FollowForm;
