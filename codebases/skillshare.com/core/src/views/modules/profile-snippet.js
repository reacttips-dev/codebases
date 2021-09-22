import SSView from 'core/src/views/base/ss-view';
import UserListPopupView from 'core/src/views/popups/user-list-popup';

const ProfileSnippetView = SSView.extend({

  el: '.profile-snippet',

  events: {
    'click .stat.followers': 'onFollowersClick',
    'click .stat.following': 'onFollowingClick',
  },

  initialize: function() {
    this.listenTo(SS.currentUser, 'updateNumFollowing', function(count) {
      this.$('.stat.following .number').text((count === '0') ? ' -- ' : count);
    });

    SSView.prototype.initialize.apply(this, arguments);
  },

  onFollowersClick: function() {
    this.showPopup('followers');
  },

  onFollowingClick: function() {
    this.showPopup('following');
  },

  showPopup: function(type) {
    const currentUserUid = SS.currentUser.get('id');
    const { firstName } = SS.serverBootstrap.userData;
    const url = '/users/' + currentUserUid + '/' + type;
    const updateCount = type === 'following';

    const text = {
      'followers': {
        emptyMsg: 'No one is following ' + firstName + ' yet.',
        title: 'Followers',
      },
      'following': {
        emptyMsg: firstName + ' isn\'t following anyone yet',
        title: 'Following',
      },
    };

    new UserListPopupView({
      url: url,
      title: text[type].title,
      emptyMessage: text[type].emptyMsg,
      updateCount: updateCount,
    });
  },
});

export default ProfileSnippetView;


