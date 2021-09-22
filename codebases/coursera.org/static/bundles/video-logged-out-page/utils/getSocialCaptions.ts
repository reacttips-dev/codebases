import { SocialCaptions } from 'bundles/sharing-common/types/sharingSharedTypes';

import _t from 'i18n!nls/video-logged-out-page';

type GetSocialCaptionsArgs = {
  courseName?: string;
  partnerName?: string;
  videoTitle?: string;
};

// Get social caption messages for sharing links across the xdp
export default ({ courseName, partnerName, videoTitle }: GetSocialCaptionsArgs): SocialCaptions => {
  return {
    twitter: () => {
      return _t('Check out this video from #{partnerName}: #{courseName} on @Coursera.', {
        courseName,
        partnerName,
        videoTitle,
      });
    },
    whatsapp: (shareLink) => {
      return _t(
        'I found a great video from a course called #{courseName}. ' +
          'I think you’ll really like it. It’s from #{partnerName} on Coursera, ' +
          'an online learning platform that partners with top universities and companies around the world Check it out: #{shareLink}',
        {
          courseName,
          partnerName,
          shareLink,
        }
      );
    },
    emailSubject: () => {
      return _t('I found an interesting video for you on Coursera!');
    },
    emailBody: (shareLink) => {
      return _t(
        'I thought you might like this video from #{courseName} offered by #{partnerName}: on Coursera. #{shareLink}\n\n' +
          'Coursera also offers online courses and Professional Certificates from 190+ world-class universities and companies, including Yale, the University of Pennsylvania, Google, IBM, and more.\n\n' +
          'Let me know what you think!',
        {
          courseName,
          partnerName,
          shareLink,
        }
      );
    },
  };
};
