import * as React from 'react';
import { TrackedButton } from 'bundles/common/components/withSingleTracked';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/index';
import classNames from 'classnames';

type ShowMoreButtonProps = {
  count: number;
};

type DefaultButtonProps = {
  onClick: () => {};
  className?: string;
  children?: JSX.Element | string;
  forumPostId: string;
};

function ShowMoreControlButton({
  children,
  className,
  onClick,
  forumPostId,
  trackingName,
}: DefaultButtonProps & { trackingName: string }) {
  return (
    <span className={classNames(className, 'showMoreButton')}>
      <TrackedButton
        onClick={onClick}
        size="zero"
        type="noStyle"
        trackingName={trackingName}
        trackingData={{ forumPostId }}
      >
        {children}
      </TrackedButton>
    </span>
  );
}

export function ShowButton({ count, onClick, forumPostId }: ShowMoreButtonProps & DefaultButtonProps) {
  return (
    <ShowMoreControlButton
      className="showButton"
      onClick={onClick}
      forumPostId={forumPostId}
      trackingName="forum_post_show_N_replies_button"
    >
      <FormattedMessage message={_t('Show {count, plural, =1 {1 reply} other {{count} replies}}')} count={count} />
    </ShowMoreControlButton>
  );
}

export function HideButton({ onClick, forumPostId }: DefaultButtonProps) {
  return (
    <ShowMoreControlButton
      className="hideButton"
      onClick={onClick}
      forumPostId={forumPostId}
      trackingName="forum_post_hide_replies_button"
    >
      {_t('Hide replies')}
    </ShowMoreControlButton>
  );
}

export default function ShowMore({
  stepCount,
  totalCount,
  currentPosition,
  onHide,
  onShow,
  forumPostId,
}: {
  stepCount: number;
  totalCount: number;
  currentPosition: number;
  onHide: (n?: number) => {};
  onShow: (n: number) => {};
  forumPostId: string;
}) {
  const hasBeenClicked = currentPosition > 1;
  const shouldPaginate = totalCount > 1;
  const shouldShowMore = shouldPaginate && currentPosition < totalCount;

  if (!shouldPaginate) {
    return null;
  }

  return (
    <div>
      {hasBeenClicked && shouldShowMore && (
        <ShowMoreControlButton
          trackingName="forum_post_show_more_replies_button"
          forumPostId={forumPostId}
          onClick={() => onShow(currentPosition + stepCount)}
        >
          {_t('Show more replies')}
        </ShowMoreControlButton>
      )}
      {!hasBeenClicked && shouldShowMore && (
        <ShowButton
          count={totalCount - 1}
          forumPostId={forumPostId}
          onClick={() => onShow(currentPosition + stepCount)}
        />
      )}
      {hasBeenClicked && <HideButton forumPostId={forumPostId} onClick={() => onHide(stepCount)} />}
    </div>
  );
}
