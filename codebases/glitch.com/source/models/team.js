/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const defaults = require('lodash/defaults');
const Model = require('../model');

// eslint-disable-next-line func-names
const Team = function(I, self) {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);
    defaults(I, {
        id: 0,
        name: 'hello-team',
        url: 'hello-team',
        description: '',
        hasCoverImage: false,
        hasAvatarImage: false,
        isVerified: false,
    });

    self.attrObservable(
        'id',
        'name',
        'url',
        'description',
        'backgroundColor',
        'createdAt',
        'updatedAt',
        'hasCoverImage',
        'location',
        'isVerified',
        'hasAvatarImage',
    );

    self.extend({
        // eslint-disable-next-line dot-notation
        avatarUrl(size, app = global['application']) {
            // app assignment is just for unit test
            size = size || 'small';
            if (self.hasAvatarImage() && app.environment() === 'development') {
                return `https://s3.amazonaws.com/hyperdev-development/team-avatar/${self.id()}/${size}`;
                // eslint-disable-next-line no-else-return
            } else if (self.hasAvatarImage()) {
                return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-avatar/${self.id()}/${size}`;
            } else {
                return 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819';
            }
        },

        // coverUrl: (size) ->
        //   size = size or 'large'
        //   if self.hasCoverImage()
        //     "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-cover/#{self.id()}/#{size}"
        //   else
        //     "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625"

        // TODO: make this env specific?
        teamPageUrl() {
            return `/@${self.url()}`;
        },
    });

    return self;
};

module.exports = Team;