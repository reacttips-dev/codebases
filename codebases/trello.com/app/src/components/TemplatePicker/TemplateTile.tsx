import React, { useEffect } from 'react';
import Dotdotdot from 'react-dotdotdot';
import { useTemplateTileQuery } from './TemplateTileQuery.generated';
import styles from './TemplateTile.less';
import { smallestPreviewBiggerThan, Preview } from '@trello/image-previews';
import classNames from 'classnames';
import { UnsplashTracker } from '@trello/unsplash';
import { TrelloBlue500 } from '@trello/colors';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { BoardTemplateBadge } from 'app/src/components/BoardTemplateBadge';
import { sendErrorEvent } from '@trello/error-reporting';
import { Analytics } from '@trello/atlassian-analytics';
import { Null } from 'app/src/components/Null';

export interface TemplateTileProps {
  boardId: string;
  onTemplateClicked: (boardId: string) => void;
}

export const getBackgroundStyle = ({
  backgroundUrl,
  backgroundColor,
  preview,
}: {
  backgroundUrl?: string;
  backgroundColor?: string;
  preview?: Preview;
}) => {
  const css: React.CSSProperties = {};
  if (backgroundUrl) {
    css.backgroundImage = `url('${preview?.url || backgroundUrl}')`;
    css.backgroundSize = 'cover';
    css.backgroundPosition = 'center';
  } else {
    css.backgroundColor = backgroundColor || TrelloBlue500;
  }
  return css;
};

export const TemplateTile: React.FC<TemplateTileProps> = ({
  boardId,
  onTemplateClicked,
}) => {
  const { data, loading, error } = useTemplateTileQuery({
    variables: {
      boardId,
    },
  });

  const backgroundUrl = data?.board?.prefs?.backgroundImage;

  useEffect(() => {
    if (backgroundUrl) {
      UnsplashTracker.trackOncePerInterval(backgroundUrl);
    }
  }, [backgroundUrl]);

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-teamplates',
          feature: Feature.TemplatePicker,
        },
        extraData: {
          component: 'TemplateTile',
        },
      });
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !data?.board) {
      // network failures and non-200 responses
      // return `null` for data.board in our graphql
      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'fetchTemplate',
        source: 'templatePickerSection',
        containers: {
          board: {
            id: boardId,
          },
        },
      });
    }
  }, [loading, data?.board, boardId]);

  if (error || (!loading && !data?.board) || loading) {
    return null;
  }

  const title = data?.board?.name;
  const url = data?.board?.url;
  const backgroundColor = data?.board?.prefs?.backgroundColor;
  const backgroundImageScaled = data?.board?.prefs?.backgroundImageScaled;

  const preview = smallestPreviewBiggerThan(backgroundImageScaled, 300, 150);

  const backgroundStyle = getBackgroundStyle({
    backgroundColor: backgroundColor || undefined,
    backgroundUrl: backgroundUrl || undefined,
    preview: preview || undefined,
  });

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.TemplatePicker,
      }}
      errorHandlerComponent={Null}
    >
      <a
        href={url}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => onTemplateClicked(boardId)}
        className={classNames(styles.templateTile)}
        style={backgroundStyle}
      >
        <span className={styles.templateTileFade} />
        <div className={styles.templateTileDetails}>
          <BoardTemplateBadge />
          <Dotdotdot clamp={2} useNativeClamp>
            <h1 className={styles.templateTitle}>{title}</h1>
          </Dotdotdot>
        </div>
      </a>
    </ErrorBoundary>
  );
};
