import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {grid} from '../../../utils/grid';
import Link from '../../typography/link';
import EmptyAvatarIcon from '../../icons/empty-avatar.svg';
import UserPopover from '../../popovers/user';
import LazyLoadImage from '../../../../shared/utils/lazy-loading-images';

const Container = glamorous.div(
  {
    position: 'relative',
    '& a': {
      display: 'inline-block'
    },
    '& img': {
      width: grid(8),
      height: grid(8),
      borderRadius: '50%'
    }
  },
  ({size, padding}) => ({
    paddingRight: padding ? padding * 2 : padding,
    paddingTop: padding,
    paddingBottom: padding,
    '& img': {
      width: size,
      height: size
    },
    '> svg': {
      width: size,
      height: size
    }
  })
);

export default class Avatar extends Component {
  static propTypes = {
    withPopover: PropTypes.bool,
    user: PropTypes.object,
    onActivate: PropTypes.func,
    onClick: PropTypes.func,
    size: PropTypes.number,
    padding: PropTypes.number,
    lazyLoadImage: PropTypes.bool
  };

  static defaultProps = {
    withPopover: false,
    size: grid(8),
    lazyLoadImage: true
  };

  renderLinkElement = () => {
    const {imageUrl, thumbUrl, displayName, path, onClick} = this.props.user;
    const {lazyLoadImage} = this.props;
    const image = thumbUrl ? thumbUrl : imageUrl;
    return (
      <>
        {path &&
          (lazyLoadImage ? (
            <Link href={path} onClick={onClick} title="Visit Profile">
              <LazyLoadImage>
                <img src={image} alt={displayName} />
              </LazyLoadImage>
            </Link>
          ) : (
            <Link href={path} onClick={onClick} title="Visit Profile">
              <img src={image} alt={displayName} />
            </Link>
          ))}
        {!path &&
          (lazyLoadImage ? (
            <LazyLoadImage>
              <img src={image} alt={displayName} />
            </LazyLoadImage>
          ) : (
            <img src={image} alt={displayName} />
          ))}
      </>
    );
  };

  render() {
    const {withPopover, user, onActivate, onClick, size, padding} = this.props;

    return (
      <Container size={size} padding={padding}>
        {user ? (
          <>
            {withPopover && (
              <UserPopover user={user} onActivate={onActivate} onClick={onClick}>
                {this.renderLinkElement()}
              </UserPopover>
            )}
            {!withPopover && this.renderLinkElement()}
          </>
        ) : (
          <EmptyAvatarIcon />
        )}
      </Container>
    );
  }
}
