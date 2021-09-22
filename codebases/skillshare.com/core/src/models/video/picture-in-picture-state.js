const PictureInPictureState = Backbone.Model.extend({

    constants: {
      INACTIVE: 0,
      ACTIVE: 1,
    },

    setInactive: function() {
      this.set('state', this.constants.INACTIVE);
    },

    setActive: function() {
        this.set('state', this.constants.ACTIVE);
      },

    isInactive: function() {
      return this.get('state') === this.constants.INACTIVE;
    },

    isActive: function() {
      return this.get('state') === this.constants.ACTIVE;
    },

  });

  export default PictureInPictureState;
