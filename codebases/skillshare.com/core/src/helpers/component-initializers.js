import InfoPopoverView from 'core/src/views/modules/info-popover';
import UserPopoverView from 'core/src/views/modules/user-popover';
import TagPopoverView from 'core/src/views/modules/tag-popover';

const ComponentInitializers = {

  initPopovers: function(scope) {
    this.initInfoPopovers(scope);
    this.initUserPopovers(scope);
    this.initTagPopovers(scope);
  },

  initInfoPopovers: function(scope) {
    scope.$('.info-popover-anchor:not(.initialized)').each(function(index, element) {
      new InfoPopoverView({
        anchor: $(element),
      });
    });
  },

  initUserPopovers: function(scope) {
    scope.$('*[data-ss-username]:not(.initialized)').each(function(index, element) {
      const $el = $(element);

      const loc = document.location.pathname.replace(/\//,'').split('/')[0];
      let via = null;
      const viaRoot = $el.data('ss-via');

      if (viaRoot) {
        via = `${viaRoot}-teacher-popover-${loc}`;
      }

      // Setting up the correct route for either a default user-card, or a teacher card
      const route = $el.data('ss-teacher-card') ? '/users/renderPopoverTeacherCard' : '/users/renderPopover';

      new UserPopoverView({
        anchor: $el,
        endpointData: {
          username: $el.data('ss-username'),
          via,
        },
        placement: $el.data('ss-placement') || 'top',
        endpoint: route,
      });
    });
  },

  initTagPopovers: function(scope) {
    scope.$('*[data-ss-tag]:not(.initialized)').each(function(index, element) {
      const $el = $(element);
      const route = '/tags/renderPopover';
      new TagPopoverView({
        anchor: $el,
        endpointData: { tagSlug: $el.data('ss-tag') },
        placement: $el.data('ss-placement') || 'top',
        endpoint: route,
      });
    });
  },

};

export default ComponentInitializers;

