import Utils from 'core/src/base/utils';

const AdminMenuHelper = {

  content: '#site-content',
  menu: '#site-menu',
  menuAction: '#site-menu-action',

  initialize: function() {
    if (this.shouldOpenAdminMenu()) {
      this.updateDOMClasses();
    }

    $(this.content).on(Utils.getTransitionEndEvent(), (e) => {
      const $el = $(e.currentTarget);
      if ($el.css('margin-left') !== '0px') {
        this.showMenu();
      }
    });

    $(this.menuAction).click(() => {
      // If we're closing
      if ($(this.content).hasClass('open')) {
        // Set sitemenu to hidden (to put to background)
        this.hideMenu();
      }

      // Update states
      $(`${this.content}, ${this.menuAction}`).toggleClass('open');

      const updatedCookieState = (this.shouldOpenAdminMenu()) ? 'closed' : 'open';
      $.cookie('ss_admin_panel', updatedCookieState, {expires: 60, path: '/'});
    });
  },

  shouldOpenAdminMenu: function() {
    return $.cookie('ss_admin_panel') === 'open';
  },

  updateDOMClasses: function() {
    this.showMenu();
    $(this.content).addClass('open');
    $(this.menuAction).addClass('open');
  },

  showMenu: function() {
    $(this.menu).removeClass('behind');
    $(this.menu).addClass('infront');
  },

  hideMenu: function() {
    $(this.menu).removeClass('infront');
    $(this.menu).addClass('behind');
  },

};

export default AdminMenuHelper;


