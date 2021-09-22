import PopoverView from 'core/src/views/modules/popover';
import ClassShareView from 'core/src/views/modules/class-share';
import getTreatment from 'core/src/views/modules/flags';

const ClassSharePopover = PopoverView.extend({

  className: 'class-share-popover base-share',

  placement: 'top',

  onboarding: false,

  CORRECTED_HEIGHT: 315,
  DEFAULT_HEIGHT: 295,
  EXPANDED_HEIGHT: 587,

  TITLE_YOUR_CLASS: 'Share Your Class, Earn $10',
  TITLE_TEACHER: 'Share This Class, Earn $10',
  TITLE_STUDENT: 'Share This Class, Get Free Months',
  TITLE_NON_STRIPE_STUDENT: 'Share this Class with Your Friends',

  // gr_default_offer_2_3
  DESC_TEACHER: `Invite students to ${getTreatment('gr_default_offer_2_3') === 'on' ? '14 free days' : '1 free month'} of Premium Membership. Earn $10 for each sign up.`,
  
  // gr_default_offer_2_3
  DESC_STUDENT: `Invite your friends to try Premium Membership free for ${getTreatment('gr_default_offer_2_3') === 'on' ? '14 days' : '1 month'}. Earn one free month for each friend who signs up.`,
  DESC_NON_STRIPE_STUDENT: `Invite your friends to watch this class with ${getTreatment('gr_default_offer_2_3') === 'on' ? '14 free days' : '1 free month'} of Premium membership.`,

  initialize: function(options) {
    PopoverView.prototype.initialize.apply(this, arguments);

    _.extend(this, _.pick(options, ['defaultHeight', 'expandedHeight', 'onboarding', 'roster', 'userIsAffiliateReferrer']));
    this.options = options || {};

    _.bindAll(this, 'onOpen', 'onClose', 'expandPopover');

    this.listenTo(this, 'popover:open', this.onOpen);
    this.listenTo(this, 'popover:close', this.onClose);
  },

  onOpen: function() {
    const titleIfIsTeacher = SS.serverBootstrap.pageData.isTeacher ? this.TITLE_YOUR_CLASS : this.TITLE_TEACHER;
    const studetTitle = SS.serverBootstrap.pageData.isLoggedInNonStripeUser ? this.TITLE_NON_STRIPE_STUDENT : this.TITLE_STUDENT;
    const viewTitle = this.userIsAffiliateReferrer ? titleIfIsTeacher : studetTitle;
    const studentDescription = SS.serverBootstrap.pageData.isLoggedInNonStripeUser ? this.DESC_NON_STRIPE_STUDENT : this.DESC_STUDENT;
    const viewDescription = this.userIsAffiliateReferrer ? this.DESC_TEACHER : studentDescription;

    this.classShareView = new ClassShareView(_.extend(this.options, {
      el: $('.class-share-wrapper'),
      viewTitle: viewTitle,
      viewDescription: viewDescription,
      showCompact: this.options.showCompact,
      isEmail: !this.options.showCompact,
    }));

    if (this.options.showEmail) {
      this.$el.css('min-height', this.CORRECTED_HEIGHT);
    } else {
      this.$el.css('min-height', 0);
    }

    this.reposition();

    this.classShareView.$('.btn-close').on('click', this.close.bind(this));
    this.listenTo(this.classShareView, 'google:user:authorized', this.expandPopover);
    this.listenTo(this.classShareView, 'link:button:click', this.reposition);

    if (this.onboarding) {
      SS.EventTracker.track('Class Onboarding: Viewed Onboarding', null, {
        type: 'class-share-popover',
      });

      SS.currentUser.save({
        'completed_class_onboarding_time': 1,
      }, { patch: true });

      this.roster.set({
        'completed_onboarding_time': 1,
      });
      this.roster.save();

      SS.EventTracker.track('Class Onboarding: Completed', null, {
        sku: this.model.get('sku'),
        type: 'class-share-popover',
      });
    } else {
      SS.EventTracker.track('Viewed Referral Popup', null, {
        type: 'class-share-popover',
      });
    }
  },

  onClose: function() {
    if (this.onboarding) {
      this.onboarding = false;
      this.showOnHover = true;
    }
  },

  // We need to set the height manually and reposition the popover when the user
  // click "gmail contacts".
  expandPopover: function() {
    if (!this.options.showCompact) {
      $('.class-share-popover').css('min-height', this.EXPANDED_HEIGHT);
      this.reposition();
    }
  },
});

export default ClassSharePopover;

