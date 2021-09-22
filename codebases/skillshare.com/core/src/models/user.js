

const UserModel = Backbone.Model.extend({

  urlRoot: '/users',

  isGuest: function() {
    return this.id ? false : true;
  },

  isMember: function() {
    return this.get('isMember') === 1;
  },

  isPremiumMember: function() {
    return this.get('isPremiumMember') === 1;
  },

  isAdmin: function() {
    return this.get('isAdmin') === 1;
  },

  canGetPromotion: function() {
    return this.get('canGetPromotion') === 1;
  },

});

export default UserModel;


