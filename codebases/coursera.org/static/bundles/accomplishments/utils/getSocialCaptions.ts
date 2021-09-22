import { SocialCaptions } from 'bundles/sharing-common/types/sharingSharedTypes';

import _t from 'i18n!nls/accomplishments';

export default ({ productName, partnerName }: $TSFixMe): SocialCaptions => {
  const productNameTrimmed = productName && productName.trim();

  return {
    twitter: () =>
      _t('I completed #{productName}! Check out my certificate', {
        productName: productNameTrimmed,
      }),
    whatsapp: (shareLink) =>
      _t('I completed #{productName} on Coursera! Check out my certificate: #{shareLink}', {
        productName: productNameTrimmed,
        shareLink,
      }),
    emailSubject: () =>
      _t('I completed #{productName}', {
        productName,
      }),
    emailBody: (shareLink) =>
      _t(
        'I recently completed #{productName} from #{partnerName} on Coursera. View my certificate here: #{shareLink}',
        {
          productName: productNameTrimmed,
          partnerName,
          shareLink,
        }
      ),
  };
};
