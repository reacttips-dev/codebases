import React, { useCallback, useMemo } from 'react';
import { forTemplate } from '@trello/i18n';

import styles from './MemberSection.less';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { Popover, PopoverScreen, usePopover } from '@trello/nachos/popover';
import { useMemberPopoverLazyQuery } from './MirrorCard/MemberPopoverQuery.generated';
import { CloseButton } from 'app/src/components/CloseButton';
import { CloseIcon } from '@trello/nachos/icons/close';
import { getLastMemberId } from 'app/gamma/src/util/last-session';
import { Gutter } from './Gutter';

const format = forTemplate('card_detail');

enum Screen {
  MemberProfile,
  MemberAvatar,
}

interface Member {
  id: string;
  bio: string;
  fullName?: string | null;
  username?: string | null;
  email?: string | null;
  nonPublic?: {
    fullName?: string | null;
  } | null;
}

interface MemberSectionProps {
  members: Member[];
}

export const Member = ({ member, size }: { member: Member; size?: number }) => {
  const [loadMember, { data }] = useMemberPopoverLazyQuery({
    variables: {
      id: member.id,
    },
  });

  const {
    triggerRef,
    popoverProps,
    toggle,
    push,
    hide,
  } = usePopover<HTMLDivElement>({
    initialScreen: Screen.MemberProfile,
    onShow: () => {
      loadMember();
    },
  });

  const preventPropagationToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggle();
    },
    [toggle],
  );

  const preventPropagationHide = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hide();
    },
    [hide],
  );

  const idMe = getLastMemberId();
  const fullName = member.nonPublic?.fullName || member.fullName;

  return (
    <>
      <MemberAvatar
        className={styles.avatar}
        idMember={member.id}
        ref={triggerRef}
        onClick={preventPropagationToggle}
        size={size}
      />
      <Popover {...popoverProps}>
        <PopoverScreen id={Screen.MemberProfile}>
          <MemberAvatar
            className={styles.popoverSmallAvatar}
            idMember={member.id}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => push(Screen.MemberAvatar)}
            size={50}
          />
          <div className={styles.memberDetails}>
            {fullName && (
              <>
                <h4 className={styles.memberName}>
                  <a href={`/${member.username}`}>{fullName}</a>
                </h4>
                <div className={styles.memberUsername}>@{member.username}</div>
              </>
            )}
            {!fullName && (
              <div className={styles.memberName}>
                @<a href={`/${member.username}`}>{member.username}</a>
              </div>
            )}
            {data?.member?.email && member.id !== idMe && (
              <div className={styles.memberEmail}>{data.member.email}</div>
            )}
            {member.bio.length > 0 && (
              <div className={styles.memberBio}>{member.bio}</div>
            )}
          </div>
          <CloseButton
            className={styles.closePopoverButton}
            onClick={preventPropagationHide}
            closeIcon={<CloseIcon size="small" />}
          />
        </PopoverScreen>
        <PopoverScreen
          id={Screen.MemberAvatar}
          title={fullName || `@${member.username}`}
        >
          <div className={styles.popoverLargeAvatarContainer}>
            <MemberAvatar
              avatarClassName={styles.popoverLargeAvatar}
              idMember={member.id}
              size={170}
            />
          </div>
        </PopoverScreen>
      </Popover>
    </>
  );
};

export const MemberSection = ({ members }: MemberSectionProps) => {
  const sortedMembers = useMemo(() => {
    const m = [...members].sort((a, b) => {
      const aName = (
        a.nonPublic?.fullName ||
        a.fullName ||
        ''
      ).toLocaleLowerCase();
      const bName = (
        b.nonPublic?.fullName ||
        b.fullName ||
        ''
      ).toLocaleLowerCase();

      if (aName < bName) {
        return -1;
      } else if (bName < aName) {
        return 1;
      }
      return 0;
    });

    return m;
  }, [members]);

  return (
    <Gutter>
      <div className={styles.memberSection}>
        <h3 className={styles.heading}>{format('members')}</h3>
        <div className={styles.members}>
          {sortedMembers.map((member) => (
            <Member member={member} key={member.id} />
          ))}
        </div>
      </div>
    </Gutter>
  );
};
