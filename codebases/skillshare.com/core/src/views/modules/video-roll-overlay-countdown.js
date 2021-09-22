import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { CookieProvider, EventsProvider } from '@skillshare/ui-components/components/providers';
import { PremiumEndCard } from '@skillshare/ui-components/PremiumEndCard';

import WishlistButtonHelper from 'core/src/helpers/wishlist-button-helper';
import VideoRollOverlayView from 'core/src/views/modules/video-roll-overlay';
import deepRetrieve from 'core/src/utils/deep-retrieve';
import template from 'text!core/src/templates/modules/video-roll-overlay.mustache';

const VideoRollOverlayCountdownView = VideoRollOverlayView.extend({
  className: 'video-roll-overlay premium-end-card',

  templateData: function() {
    return {
      isAffiliateReferrer: deepRetrieve(SS, 'serverBootstrap', 'pageData', 'userIsAffiliateReferrer'),
    };
  },

  template: template,

  renderPremiumEndCard: function() {
    if (!SS?.serverBootstrap?.pageData?.isMobileWeb) {
      const classData = this.getClassCardData();
      const trackEventHandler = SS.EventTracker.trackingCallback();
      const csrfToken = $.cookie('YII_CSRF_TOKEN');
      const classList = classData.slice(0,2);
      
      ReactDOM.render(
        <DefaultThemeProvider>
          <CookieProvider cookies={{ YII_CSRF_TOKEN: csrfToken }}>
            <EventsProvider trackEventHandler={trackEventHandler}>
              <PremiumEndCard
                header="Congratulations on finishing your class!"
                subheader="Try one of these classes next:"
                classesList={classList}
                via="premium-end-card"
              />
            </EventsProvider>
          </CookieProvider>
        </DefaultThemeProvider>,
        this.$('.js-class-end').get(0)
      );
    }
  },

  getClassCardData: function() {
    const relatedClasses = SS.serverBootstrap.pageData.aboutData.relatedClasses.list;

    const classData = relatedClasses.map(relatedClass => {
      const badges = [];
      if (relatedClass.isStaffPick) {
        badges.push({
          type: 'STAFF_PICK'
        })
      } else if (relatedClass.isSkillshareOriginal) {
        badges.push({
          type: 'ORIGINAL'
        })
      }

      return {
        id: relatedClass.id.toString(),
        sku: relatedClass.sku.toString(),
        title: relatedClass.title,
        url: relatedClass.url,
        studentCount: relatedClass.numStudents,
        largeCoverUrl: relatedClass.image,
        teacher: {
          name: relatedClass.teacher.fullName,
          username: relatedClass.teacher.username,
          vanityUsername: relatedClass.teacher.vanityUsername,
        },
        hideSave: true,
        badges,
        durationInSeconds: relatedClass.totalSecondsDuration,
        renderSignupView: SS.currentUser.isGuest() ? WishlistButtonHelper.renderSignupView.bind(WishlistButtonHelper) : undefined,
        fetchLists: WishlistButtonHelper.fetchListItems.bind(WishlistButtonHelper),
        onClickListItem: WishlistButtonHelper.onClickListItem.bind(WishlistButtonHelper),
        onCreateNewList: WishlistButtonHelper.onCreateNewList.bind(WishlistButtonHelper),
        viewer: {
          hasSaved: !!relatedClass.wishlistId
        }
      };
    });

    return classData;
  },

  afterRender: function() {
    this.renderPremiumEndCard();
    VideoRollOverlayView.prototype.afterRender.apply(this, arguments);
  },
});

export default VideoRollOverlayCountdownView;
