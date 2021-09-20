import React from 'react';
import {
  Analytics,
  SourceType,
  ActionSubjectIdType,
} from '@trello/atlassian-analytics';
import styles from './SocialShareLinks.less';
import { forNamespace } from '@trello/i18n';
const format = forNamespace('social share links');

enum Platform {
  facebook = 'Facebook',
  twitter = 'Twitter',
  linkedin = 'LinkedIn',
  email = 'Email',
}

export const SocialShareLinks: React.FunctionComponent<{
  tweet: string;
  emailBody: string;
  url: string;
  analyticsSource: SourceType;
  hashtags?: string[];
  boardId?: string;
}> = ({ tweet, emailBody, url, analyticsSource, hashtags, boardId = '' }) => {
  const sendAnalyticsUIEvent = (analyticsSubject: ActionSubjectIdType) => {
    Analytics.sendClickedButtonEvent({
      buttonName: analyticsSubject,
      source: analyticsSource,
      containers: { board: { id: boardId } },
    });
  };

  return (
    <ul className={styles.socialShareLinksList}>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
            tweet,
          )}${hashtags && `&hashtags=` + hashtags.join(',')}`}
          target="_blank"
          rel="noopener noreferrer"
          title={format('share on', { platform: Platform.twitter })}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => sendAnalyticsUIEvent('twitterButton')}
        >
          <img
            src={require('resources/images/social-icons/twitter-icon.svg')}
            alt={format('share on', { platform: Platform.twitter })}
          />
        </a>
      </li>
      <li>
        <a
          href={`https://www.facebook.com/sharer.php?u=${url}&display=page`}
          target="_blank"
          rel="noopener noreferrer"
          title={format('share on', { platform: Platform.facebook })}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => sendAnalyticsUIEvent('facebookButton')}
        >
          <img
            src={require('resources/images/social-icons/facebook-icon.svg')}
            alt={format('share on', { platform: Platform.facebook })}
          />
        </a>
      </li>

      <li>
        <a
          href={`https://www.linkedin.com/shareArticle?&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          title={format('share on', { platform: Platform.linkedin })}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => sendAnalyticsUIEvent('linkedinButton')}
        >
          <img
            src={require('resources/images/social-icons/linkedin-icon.svg')}
            alt={format('share on', { platform: Platform.linkedin })}
          />
        </a>
      </li>
      <li>
        <a
          href={`mailto:?body=${encodeURIComponent(emailBody)}%0D%0A${url}`}
          target="_blank"
          rel="noopener noreferrer"
          title={format('email')}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => sendAnalyticsUIEvent('emailButton')}
        >
          <img
            src={require('resources/images/social-icons/email-icon.svg')}
            alt={format('email')}
          />
        </a>
      </li>
    </ul>
  );
};
