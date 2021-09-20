import React, { useEffect } from 'react';
import Dotdotdot from 'react-dotdotdot';
import { useCreateBoardQuery } from './CreateBoardQuery.generated';
import { UnsplashTracker } from '@trello/unsplash';
import { Spinner } from '@trello/nachos/spinner';
import { forTemplate } from '@trello/i18n';
import {
  useBackgroundStyle,
  templateUrlSlug,
} from 'app/src/components/Templates/Helpers';
import { BoardInfoContainer } from './BoardInfoContainer';
import { Button } from '@trello/nachos/button';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { Analytics, ActionSubjectIdType } from '@trello/atlassian-analytics';

import styles from './CreateBoard.less';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';

const format = forTemplate('templates');

const loadingSpinner = (
  <div className={styles.spinnerContainer}>
    <Spinner />
  </div>
);

interface CreateBoard {
  boardId: string;
}

export const CreateBoard: React.FunctionComponent<CreateBoard> = ({
  boardId,
}) => {
  const { data, error, loading: loadingTemplateData } = useCreateBoardQuery({
    variables: { boardId },
  });

  const board = data?.board || null;
  const boardName = board?.name || null;
  const backgroundColor = board?.prefs?.backgroundColor || undefined;
  const backgroundUrl = board?.prefs?.backgroundImage || undefined;
  const shortLink = board?.shortLink || null;
  const desc = board?.desc || '';
  const members = board?.members || [];
  const org = board?.organization || null;
  const templateGallery = board?.templateGallery || null;
  const templateCategory = templateGallery?.category || null;
  const blurb = templateGallery?.blurb || '';

  let author = '';
  if (templateGallery?.byline) {
    author = templateGallery?.byline;
  } else if (org?.displayName) {
    author = org.displayName;
  } else if (members[0]?.nonPublic?.fullName) {
    author = members[0].nonPublic.fullName;
  } else if (members[0]?.fullName) {
    author = members[0].fullName;
  }

  let externalLinkUrl = `/b/${shortLink}`;
  if (templateGallery?.category && boardName && shortLink) {
    externalLinkUrl = `/templates/${templateUrlSlug(
      templateGallery?.category || '',
      boardName,
      shortLink,
    )}`;
  }

  const { loading, templateBackgroundStyle } = useBackgroundStyle(
    boardId,
    backgroundColor,
    backgroundUrl,
  );

  const handleClick = (source: ActionSubjectIdType) => {
    Analytics.sendClickedLinkEvent({
      source: 'useTemplateInlineDialog',
      linkName: source,
    });
  };

  useEffect(() => {
    if (backgroundUrl) {
      UnsplashTracker.trackOncePerInterval(backgroundUrl);
    }
  }, [backgroundUrl]);

  if (loadingTemplateData) {
    return loadingSpinner;
  } else if (error) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.templateInfo}>
        <div className={styles.templateInfoHeader}>
          {!loading && (
            <RouterLink
              href={externalLinkUrl}
              target={'_blank'}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => handleClick('templateThumbnailLink')}
            >
              <div
                className={styles.background}
                style={templateBackgroundStyle}
              />
            </RouterLink>
          )}
          <div className={styles.titleCreatorExternalLinkContainer}>
            <div className={styles.titleCreatorHeader}>
              <RouterLink
                className={styles.externalTemplateLinkTitle}
                href={externalLinkUrl}
                target={'_blank'}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleClick('templateNameLink')}
              >
                <div className={styles.templateTitle}>{boardName}</div>
              </RouterLink>
              <p className={styles.templateCreator}>
                {format('by', { author })}
              </p>
            </div>
            <RouterLink
              href={externalLinkUrl}
              target={'_blank'}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => handleClick('templateExternalLink')}
              className={styles.externalLink}
            >
              <Button
                className={styles.externalLinkIcon}
                iconBefore={<ExternalLinkIcon color="gray" size="large" />}
              />
            </RouterLink>
          </div>
        </div>
        <Dotdotdot clamp={3} useNativeClamp>
          <p className={styles.templateDescription}>{blurb || desc}</p>
        </Dotdotdot>
      </div>
      <div className={styles.boardInfoContainer}>
        <BoardInfoContainer
          boardId={boardId}
          templateCategory={templateCategory}
          sourceBoardName={boardName}
        />
      </div>
    </div>
  );
};
