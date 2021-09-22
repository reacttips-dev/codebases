/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import { VideoIcon } from '@coursera/cds-icons';
import type { LinkProps } from '@coursera/cds-core';
import { Typography, Link, useTheme, Grid } from '@coursera/cds-core';
import _t from 'i18n!nls/video-highlighting';
import type { Highlight } from 'bundles/video-highlighting/types';
import type { Course } from 'bundles/video-highlighting/review-page/types';
import withSingleTracked from 'bundles/common/components/withSingleTracked';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getCourseRootPath } from 'bundles/ondemand/utils/url';
import { formatTime } from 'bundles/interactive-transcript/utils/TranscriptUtils';

const formatNoteClipDescription = (note: Highlight) => {
  const { noteStartTs, noteEndTs, captureTs } = note;
  if (noteStartTs && noteEndTs) {
    return `${formatTime(noteStartTs)} - ${formatTime(noteEndTs)}`;
  }
  return `${formatTime(captureTs)}`;
};
const constructItemLink = (courseSlug: string, itemId: string, noteTs: number): string =>
  `${getCourseRootPath(courseSlug)}/lecture/${itemId}?t=${Math.trunc(noteTs)}`;

type Props = {
  note: Highlight;
  course: Course;
};

const VideoSnapshot = ({ snapshotUrl }: { snapshotUrl: string }) => {
  const theme = useTheme();

  const videoThumbnailCss = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    background: ${theme.palette.black[500]};
    transition: opacity 0.2s linear;
    :hover {
      opacity: 0.6;
    }
  `;

  const videoTextCss = css`
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  `;

  return (
    <div
      css={css`
        width: 197px;
        position: relative;
      `}
    >
      <div css={videoThumbnailCss}>
        <Typography color="invertBody" css={videoTextCss}>
          {_t('Go to video')}
        </Typography>
      </div>
      <img
        css={css`
          width: 100%;
          border: 1px solid ${theme.palette.gray[400]};
        `}
        src={snapshotUrl}
        alt="note"
      />
    </div>
  );
};

const TrackedLink = withSingleTracked({ type: 'BUTTON' })<LinkProps>(Link);

const NoteInformation = ({ note, course }: Props) => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Grid container alignItems="center" wrap="nowrap">
        {!note.snapshotUrl && (
          <div
            css={css`
              flex-shrink: 0;
              height: ${theme.spacing(24)};
            `}
          >
            <VideoIcon size="large" />
          </div>
        )}
        <div
          css={css`
            margin: ${theme.spacing(0, 0, 0, note.snapshotUrl ? 0 : 8)};
          `}
        >
          {note.snapshotUrl && (
            <div
              data-e2e="snapshot-container"
              css={css`
                margin: ${theme.spacing(0, 0, 16, 0)};
              `}
            >
              <TrackedA
                trackingName="highlight_link"
                data={{ itemId: note.itemId }}
                href={constructItemLink(course.slug, note.itemId ?? '', note.noteStartTs)}
                target="_blank"
                role="link"
                rel="noopener noreferrer"
              >
                <VideoSnapshot snapshotUrl={note.snapshotUrl} />
              </TrackedA>
            </div>
          )}

          <TrackedLink
            variant="quiet"
            trackingName="highlight_link"
            trackingData={{ itemId: note.itemId }}
            href={constructItemLink(course.slug, note.itemId ?? '', note.noteStartTs)}
            target="_blank"
            role="link"
            rel="noopener noreferrer"
            typographyVariant="body1"
          >
            {note.itemName}
          </TrackedLink>
        </div>
      </Grid>

      <Typography
        css={css`
          margin: ${theme.spacing(4, 0, 0, note.snapshotUrl ? 0 : 32)};

          ${theme.breakpoints.down('sm')} {
            margin: ${theme.spacing(4, 0, 16, note.snapshotUrl ? 0 : 32)};
          }
        `}
        variant="body2"
        color="supportText"
        aria-label={_t('Duration')}
        dir="ltr"
      >
        {formatNoteClipDescription(note)}
      </Typography>
    </React.Fragment>
  );
};

export default NoteInformation;
