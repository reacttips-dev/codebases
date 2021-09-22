import React from 'react';

import initBem from 'js/lib/bem';
import ProfileImage from 'bundles/phoenix/components/ProfileImage';
import { SvgUser } from '@coursera/coursera-ui/svg';

import 'css!./__styles__/ProfileImageCA';

const PROFILE_IMAGE_SIZE = 32;

const bem = initBem('ProfileImageCA');

type Props = {
  profile: {
    fullName?: string | null;
    photoUrl?: string | null;
    isAnonymous?: boolean;
  };
  size?: number;
  alt?: string;
};

const ProfileImageCA = ({
  profile: { fullName, photoUrl, isAnonymous } = {},
  size = PROFILE_IMAGE_SIZE,
  alt,
}: Props) => {
  return (
    <div className={bem()}>
      {isAnonymous ? (
        <div className={bem('anonymous-icon')} style={{ width: size, height: size, borderRadius: size / 2 }}>
          <SvgUser size={size / 2} />
        </div>
      ) : (
        <ProfileImage
          fullName={fullName}
          profileImageUrl={photoUrl || null}
          width={size || PROFILE_IMAGE_SIZE}
          height={size || PROFILE_IMAGE_SIZE}
          alt={alt}
        />
      )}
    </div>
  );
};

export default ProfileImageCA;
