"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = currentUser;
function currentUser() {
  var _this = this;

  return {
    profile: function profile() {
      var url = "/me";

      return _this.request({
        url: url,
        method: "GET"
      });
    },

    updateProfile: function updateProfile(options) {
      var endpointUrl = "/me";
      var username = options.username,
          firstName = options.firstName,
          lastName = options.lastName,
          email = options.email,
          url = options.url,
          location = options.location,
          bio = options.bio,
          instagramUsername = options.instagramUsername;

      var body = {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        url: url,
        location: location,
        bio: bio,
        instagram_username: instagramUsername
      };

      Object.keys(body).forEach(function (key) {
        if (!body[key]) {
          delete body[key];
        }
      });

      return _this.request({
        url: endpointUrl,
        method: "PUT",
        body: body
      });
    }
  };
}