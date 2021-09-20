import cx from 'classnames';
import { CanonicalAvatar } from '@atlassian/trello-canonical-components';
import { forTemplate } from '@trello/i18n';
import { avatarsFromAvatarUrl, Avatars } from '@trello/members';
import React from 'react';
import { useNonPublicIfAvailable } from 'app/common/lib/util/non-public-fields-filter';
import styles from './MemberAvatar.less';
import { ProductFeatures } from '@trello/product-features';
import {
  useMemberAvatarQuery,
  MemberAvatarQuery,
} from './MemberAvatarQuery.generated';
import { AvatarSources } from 'app/gamma/src/types/models';
import { MemberIcon } from '@trello/nachos/icons/member';
import { forwardRefComponent } from 'app/src/forwardRefComponent';
const format = forTemplate('member');

// Order matters here, if you add a new one,
// ensure it remains in ascending order
const AVATAR_SIZES = [30, 50, 170];

interface MemberAvatarUnconnectedProps {
  avatarSource?: AvatarSources;
  className?: string;
  avatarClassName?: string;
  fullName?: string | null;
  username?: string;
  avatars?: Avatars;
  initials?: string | null;
  size?: number; // pixels
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gold?: boolean;
  hoverable?: boolean;
  deactivated?: boolean;
}

export const MemberAvatarUnconnected = forwardRefComponent<
  HTMLDivElement,
  MemberAvatarUnconnectedProps
>(
  'MemberAvatarUnconnected',
  (
    {
      avatarSource,
      className,
      avatarClassName,
      fullName: inputFullName,
      username,
      avatars,
      initials,
      size = 30,
      onClick,
      gold,
      hoverable,
      deactivated,
    }: MemberAvatarUnconnectedProps,
    ref,
  ) => {
    const fullName = inputFullName ?? '';
    const interactive = hoverable || !!onClick;
    const resolution = AVATAR_SIZES.find((s) => s >= size);
    const resolution2x = AVATAR_SIZES.find((s) => s >= size * 2) || resolution;
    if (resolution === undefined || resolution2x === undefined) {
      throw new Error('Invalid member avatar size');
    }
    const showDefaultAtlassianIcon = !(initials || avatars);
    const img = avatars && avatars[resolution];
    const img2x = avatars && avatars[resolution2x];
    return (
      <div
        className={cx(
          className,
          styles.memberAvatar,
          initials && initials.length > 2 && styles.longInitials,
        )}
        title={username ? `${fullName} (${username})` : fullName}
        onClick={onClick}
        role={onClick && 'button'}
        ref={ref}
      >
        <CanonicalAvatar
          avatarSource={avatarSource}
          className={cx(
            interactive && styles.hoverable,
            avatars ? styles.withImage : null,
            (img || img2x) && styles.transparentBackground,
            avatarClassName,
          )}
          img={img}
          img2x={img2x}
          initials={initials}
          size={size}
          deactivated={deactivated}
          title={username ? `${fullName} (${username})` : fullName}
        >
          {showDefaultAtlassianIcon && (
            <MemberIcon size={size > 20 ? 'large' : undefined} color="quiet" />
          )}
        </CanonicalAvatar>
        {gold && (
          <span
            className={styles.gold}
            title={format('this-member-has-trello-gold')}
          />
        )}
      </div>
    );
  },
);

interface MemberAvatarProps {
  avatarSource?: AvatarSources;
  className?: string;
  avatarClassName?: string;
  deactivated?: boolean;
  idMember: string;
  size?: number; // pixels
  onClick?: React.EventHandler<React.SyntheticEvent>;
  hoverable?: boolean;
  memberData?: NonNullable<MemberAvatarQuery>['member'];
}

export const MemberAvatar = forwardRefComponent<
  HTMLDivElement,
  MemberAvatarProps
>(
  'MemberAvatar',
  (
    {
      avatarSource,
      className = '',
      size = 30,
      avatarClassName,
      deactivated,
      idMember,
      onClick,
      hoverable,
      memberData,
    }: MemberAvatarProps,
    ref,
  ) => {
    const { data } = useMemberAvatarQuery({
      variables: { memberId: idMember },
      // be defensive about empty strings coming in as the id
      skip: !idMember || !!memberData,
    });
    const member = memberData || data?.member;

    // Convert query results into data for the underlying CanonicalAvatar
    const username = member?.username;
    const fullName = member && useNonPublicIfAvailable(member, 'fullName');
    const initials = member && useNonPublicIfAvailable(member, 'initials');
    const avatarUrl = member && useNonPublicIfAvailable(member, 'avatarUrl');
    const avatars = avatarUrl ? avatarsFromAvatarUrl(avatarUrl) : undefined;
    const gold = member?.products
      ? ProductFeatures.isFeatureEnabled('crown', member.products[0])
      : false;

    return (
      <MemberAvatarUnconnected
        className={className}
        avatarSource={avatarSource}
        avatarClassName={avatarClassName}
        onClick={onClick}
        hoverable={hoverable}
        deactivated={deactivated}
        username={username}
        fullName={fullName}
        initials={initials}
        avatars={avatars}
        gold={gold}
        size={size}
        ref={ref}
      />
    );
  },
);
