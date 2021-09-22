function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ProviderViews = require('@uppy/provider-views');

module.exports = /*#__PURE__*/function (_ProviderViews) {
  _inheritsLoose(DriveProviderViews, _ProviderViews);

  function DriveProviderViews() {
    return _ProviderViews.apply(this, arguments) || this;
  }

  var _proto = DriveProviderViews.prototype;

  _proto.toggleCheckbox = function toggleCheckbox(e, file) {
    e.stopPropagation();
    e.preventDefault(); // Shared Drives aren't selectable; for all else, defer to the base ProviderView.
    // @todo isTeamDrive is left for backward compatibility. We should remove it in the next
    // major release.

    if (!file.custom.isTeamDrive && !file.custom.isSharedDrive) {
      _ProviderViews.prototype.toggleCheckbox.call(this, e, file);
    }
  };

  return DriveProviderViews;
}(ProviderViews);