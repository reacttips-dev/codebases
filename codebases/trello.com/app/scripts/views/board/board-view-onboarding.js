const InviteeOrientationView = require('app/scripts/views/board/invitee-orientation-view');

module.exports.renderInviteeOrientation = function () {
  this.$('.board-canvas').append(
    '<div class="invitee-orientation-mount-point"></div>',
  );

  const inviteeOrientationView = this.subview(
    InviteeOrientationView,
    this.model,
    { modelCache: this.modelCache },
  );

  return this.ensureSubview(
    inviteeOrientationView,
    this.$('.invitee-orientation-mount-point'),
  );
};
