import PropTypes from 'prop-types';
import avatarHelpers from 'helpers/avatar-helpers';
import styles from './index.scss';
import { useState } from 'react';

export function Avatar({
  firstName,
  lastName,
  avatarUrl,
  userId,
  sizeSelection,
}) {
  const [hasError, setHasError] = useState(false);

  // Error handler that will capture any image loading error and set
  // the users' whose image avatar cannot be loaded to their identicon.
  const handleProfileImageLoadingError = () => setHasError(true);
  const hasValidAvatar = !!avatarUrl && !hasError;

  const imgSrc = hasValidAvatar
    ? avatarUrl
    : avatarHelpers.makeIdenticon(
        userId,
        avatarHelpers.translateSizeSelectionToInt(sizeSelection)
      );

  const dataTstAttr = hasValidAvatar ? 'profile-pic' : 'default-identicon';
  const name = `${firstName} ${lastName}`;

  return (
    <div className={styles.avatar}>
      <img
        src={imgSrc}
        alt={'user avatar'}
        data-tst={dataTstAttr}
        title={name || 'anonymous'}
        className={styles[`avatar-img-${sizeSelection}`]}
        onError={handleProfileImageLoadingError}
      />
    </div>
  );
}

Avatar.defaultProps = {
  sizeSelection: 'default',
};

Avatar.propTypes = {
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  photo_url: PropTypes.string,
  id: PropTypes.string,
  sizeSelection: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'default']),
};

export default Avatar;
