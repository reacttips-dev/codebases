import React from 'react';
import { forNamespace } from '@trello/i18n';
import { PublicIcon } from '@trello/nachos/icons/public';
import { OrganizationVisibleIcon } from '@trello/nachos/icons/organization-visible';
import { SocialShareLinks } from 'app/src/components/SocialShareLinks';
import styles from './ShareTemplatePopover.less';
import { LinkCopy } from 'app/src/components/LinkCopy';
import { Analytics } from '@trello/atlassian-analytics';

const format = forNamespace('share template popover', {
  shouldEscapeStrings: false,
});

const TemplatePopover: React.FunctionComponent<{
  boardId: string;
  linkOnClick: () => void;
  teamId: string;
  url: string;
  visibility: string;
  name: string;
  visibilityText?: string;
}> = ({
  boardId,
  linkOnClick,
  teamId,
  url,
  visibility,
  name,
  visibilityText,
}) => {
  let icon;
  if (visibility === 'public') {
    icon = (
      <PublicIcon dangerous_className={styles.visibilityIcon} color="green" />
    );
  } else {
    icon = (
      <OrganizationVisibleIcon
        dangerous_className={styles.visibilityIcon}
        color="yellow"
      />
    );
  }

  return (
    <>
      <p>{format('share a view only link with your team')}</p>
      <LinkCopy
        url={url}
        analyticsSource={'shareTemplateInlineDialog'}
        boardId={boardId}
        teamId={teamId}
      />
      <SocialShareLinks
        url={url}
        tweet={format('share template tweet', { templateName: name })}
        emailBody={format('share template email', {
          templateName: name,
        })}
        analyticsSource={'shareTemplateInlineDialog'}
        hashtags={['trellotemplates']}
        boardId={boardId}
      />
      {visibilityText && (
        <>
          <hr />
          <div>
            {icon}
            <span className={styles.visibilityText}>{visibilityText}</span>
          </div>
        </>
      )}
      <hr />
      <a
        href="https://help.trello.com/article/1187-creating-template-boards"
        className={styles.learnMoreLink}
        onClick={linkOnClick}
        rel="noopener noreferrer"
        target="_blank"
        title={format('learn more about templates')}
      >
        {format('learn more about templates')}
      </a>
    </>
  );
};

const TemplateGoldPopover: React.FunctionComponent<{
  url: string;
  boardId: string;
  linkOnClick: () => void;
  teamId: string;
  name: string;
}> = ({ boardId, teamId, url, linkOnClick, name }) => (
  <>
    <LinkCopy
      url={url}
      analyticsSource={'shareTemplateInlineDialog'}
      boardId={boardId}
      teamId={teamId}
      isTemplate
    />
    <SocialShareLinks
      url={url}
      tweet={format('share template tweet', { templateName: name })}
      emailBody={format('share template email', {
        templateName: name,
      })}
      analyticsSource={'shareTemplateInlineDialog'}
      hashtags={['trellotemplates']}
      boardId={boardId}
    />
    <hr />
    <div>
      <PublicIcon dangerous_className={styles.visibilityIcon} color="green" />
      <span className={styles.visibilityText}>
        {format('anyone on the internet can see this template')}
      </span>
    </div>
  </>
);

export const ShareTemplatePopover: React.FunctionComponent<{
  name?: string;
  orgName?: string;
  enterpriseName?: string;
  url?: string;
  storyPageUrl?: string;
  visibility?: string;
  boardId?: string;
  teamId?: string;
  username?: string;
}> = ({
  name = '',
  orgName,
  enterpriseName,
  url = '',
  storyPageUrl,
  visibility = '',
  boardId = '',
  teamId = '',
  username,
}) => {
  if (visibility === 'public' && username) {
    return (
      <div className={styles.popoverContent}>
        <TemplateGoldPopover
          name={name}
          url={storyPageUrl || url}
          boardId={boardId}
          teamId={teamId}
          // eslint-disable-next-line react/jsx-no-bind
          linkOnClick={() => {
            Analytics.sendClickedLinkEvent({
              linkName: 'goldLink',
              source: 'shareTemplateInlineDialog',
              containers: {
                board: {
                  id: boardId,
                },
              },
            });
          }}
        />
      </div>
    );
  }

  let visibilityText;
  // not handling private visiblity because we don't show popover on private templates
  if (enterpriseName && visibility === 'enterprise') {
    visibilityText = format('all members of org can see this template', {
      orgName: enterpriseName,
    });
  } else if (orgName && visibility === 'org') {
    visibilityText = format('all members of org can see this template', {
      orgName,
    });
  } else if (visibility === 'public') {
    visibilityText = format('anyone on the internet can see this template');
  }

  return (
    <div className={styles.popoverContent}>
      <TemplatePopover
        url={storyPageUrl || url}
        boardId={boardId}
        teamId={teamId}
        visibility={visibility}
        visibilityText={visibilityText}
        name={name}
        // eslint-disable-next-line react/jsx-no-bind
        linkOnClick={() => {
          Analytics.sendClickedLinkEvent({
            linkName: 'templatesHelpLink',
            source: 'shareTemplateInlineDialog',
            containers: {
              board: {
                id: boardId,
              },
            },
          });
        }}
      />
    </div>
  );
};
