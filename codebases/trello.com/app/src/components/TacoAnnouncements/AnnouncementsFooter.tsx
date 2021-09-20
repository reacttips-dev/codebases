import React from 'react';
import cx from 'classnames';
import { BoardIcon } from '@trello/nachos/icons/board';
import { TwitterIcon } from '@trello/nachos/icons/twitter';
import { FacebookIcon } from '@trello/nachos/icons/facebook';
import { InstagramIcon } from '@trello/nachos/icons/instagram';
import { forNamespace, forTemplate } from '@trello/i18n';
import styles from './AnnouncementsFooter.less';
import { Analytics } from '@trello/atlassian-analytics';

const format = forTemplate('header_announcements');
const socialUrls = forNamespace('social');

const trackSocialClick = (socialUrl: string) => () => {
  Analytics.sendClickedLinkEvent({
    linkName: 'socialMediaLink',
    source: 'tacoAnnouncementInlineDialog',
    attributes: {
      socialUrl,
    },
  });
};

interface AnnouncementsFooterProps {
  highlightedUrl?: string | null;
}

export const AnnouncementsFooter: React.FC<AnnouncementsFooterProps> = ({
  highlightedUrl,
}) => {
  const blogUrl = new URL(socialUrls('blog'));
  blogUrl.searchParams.append('utm_campaign', 'none');
  blogUrl.searchParams.append('utm_source', 'direct');
  blogUrl.searchParams.append('utm_medium', 'inapp');

  if (highlightedUrl) {
    const url = new URL(highlightedUrl);
    if (url.host.includes('blog.trello.com')) {
      if (url.searchParams.has('utm_campaign')) {
        blogUrl.searchParams.set(
          'utm_campaign',
          url.searchParams.get('utm_campaign')!,
        );
      } else {
        const paths = url.pathname.split('/');
        if (paths.length > 0) {
          blogUrl.searchParams.set('utm_campaign', paths[paths.length - 1]);
        }
      }

      if (url.searchParams.has('utm_source')) {
        blogUrl.searchParams.set(
          'utm_source',
          url.searchParams.get('utm_source')!,
        );
      }
    }
  }

  return (
    <footer className={styles.footerLinks}>
      <p className={cx(styles.quiet, styles.footerMessage)}>
        {format('for-more-updates-check-out-ellipsis')}
      </p>

      <a
        className={styles.blogLink}
        target="_blank"
        rel="noopener noreferrer"
        href={blogUrl.toString()}
        onClick={trackSocialClick('blog')}
      >
        <BoardIcon dangerous_className={styles.blogIcon} size="large" />
        <span className={styles.underline}>{format('trello-blog')}</span>
      </a>

      <a
        className={styles.socialMediaLink}
        target="_blank"
        rel="noopener noreferrer"
        href={socialUrls('twitter')}
        onClick={trackSocialClick('twitter')}
      >
        <TwitterIcon size="large" />
      </a>
      <a
        className={styles.socialMediaLink}
        target="_blank"
        rel="noopener noreferrer"
        href={socialUrls('facebook')}
        onClick={trackSocialClick('facebook')}
      >
        <FacebookIcon size="large" />
      </a>
      <a
        className={styles.socialMediaLink}
        target="_blank"
        rel="noopener noreferrer"
        href={socialUrls('instagram')}
        onClick={trackSocialClick('instagram')}
      >
        <InstagramIcon size="large" />
      </a>
    </footer>
  );
};
