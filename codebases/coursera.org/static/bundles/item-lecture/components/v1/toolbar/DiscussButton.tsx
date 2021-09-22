import React from 'react';

import VideoToolbarButton from 'bundles/item-lecture/components/v1/toolbar/VideoToolbarButton';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getWeekDiscussionsUrl } from 'bundles/discussions/utils/discussionsUrl';

import { color } from '@coursera/coursera-ui';
import { SvgExternalLink } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/item-lecture';

type Props = {
  weekNumber: number;
};

const DiscussButton = ({ weekNumber }: Props) => {
  return (
    <VideoToolbarButton
      trackingName="week_forums"
      tag="a"
      htmlAttributes={{
        'aria-label': _t('Discuss, Opens in a new tab'),
        href: getWeekDiscussionsUrl(weekNumber),
        target: '_blank',
        rel: 'noopener noreferrer',
      }}
      type="secondary"
      label={_t('Discuss')}
      svgElement={
        <SvgExternalLink color={color.secondaryText} hoverColor={color.white} size={20} suppressTitle={true} />
      }
    />
  );
};

export default DiscussButton;
