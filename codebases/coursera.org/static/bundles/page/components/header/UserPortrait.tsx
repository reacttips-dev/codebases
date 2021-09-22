import React from 'react';
import initBem from 'js/lib/bem';

import { Box, color } from '@coursera/coursera-ui';
import { SvgUserFilled, SvgChevronDown, SvgChevronUp } from '@coursera/coursera-ui/svg';
// TODO (jcheung) find out whether withSvgStack should be exported from @coursera/coursera-ui
import withSvgStack from 'bundles/coursera-ui/components/hocs/withSvgStack';
import ProfileImage from 'bundles/phoenix/components/ProfileImage';

import 'css!./__styles__/UserPortrait';

const SvgUserFilledStack = withSvgStack(SvgUserFilled);

const bem = initBem('UserPortrait');

const ICON_SIZE = 40;
const ICON_RATIO = 0.6;
const CARET_SIZE = 16;

type Props = {
  user: {
    full_name: string;
    photo_120: string;
  };
  showFirstName?: boolean;
  showFullName?: boolean;
  showCaret?: boolean;
  isCaretUp?: boolean;
};

const UserPortrait = ({ user, showFirstName, showCaret, showFullName, isCaretUp }: Props) => {
  const { full_name: fullName, photo_120: photoUrl } = user;
  const firstName = fullName && fullName.split(' ')[0];

  return (
    <Box rootClassName={bem(undefined, undefined, 'pii-hide')} alignItems="center">
      {photoUrl && (
        <ProfileImage
          {...{
            fullName,
            profileImageUrl: photoUrl,
            width: ICON_SIZE,
            height: ICON_SIZE,
          }}
        />
      )}

      {!photoUrl && (
        <SvgUserFilledStack
          {...{
            size: Math.round(ICON_SIZE * ICON_RATIO),
            color: color.white,
            stackColor: color.accent,
            stackToIconRatio: ICON_RATIO,
          }}
        />
      )}

      {showFirstName && (
        <span data-e2e="UserPortraitFirstName" className={bem('first-name', undefined, 'body c-ph-username')}>
          {firstName}
        </span>
      )}
      {showFullName && (
        <span data-e2e="UserPortraitFullName" className={bem('full-name', undefined, 'body c-ph-username')}>
          {fullName}
        </span>
      )}
      {showCaret && isCaretUp ? (
        <SvgChevronUp size={CARET_SIZE} suppressTitle={true} />
      ) : (
        <SvgChevronDown size={CARET_SIZE} suppressTitle={true} />
      )}
    </Box>
  );
};

export default UserPortrait;
