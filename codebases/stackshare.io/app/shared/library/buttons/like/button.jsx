import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {formatCount} from '../../../../shared/utils/format';
import StarIcon from '../../icons/star';
import UpvoteIcon from '../../icons/upvote';
import {FONT_FAMILY, WEIGHT} from '../../../style/typography';
import {CATHEDRAL, CONCRETE, FOCUS_BLUE, WHITE} from '../../../style/colors';

export const STAR = 'star';
export const UPVOTE = 'upvote';

const Button = glamorous.div(
  {
    label: 'button',
    display: 'inline-block',
    borderRadius: 2
  },
  ({privateMode}) => ({
    cursor: privateMode ? 'default' : 'pointer'
  }),
  ({liked}) => ({
    backgroundColor: liked ? FOCUS_BLUE : WHITE,
    border: liked ? `1px solid ${FOCUS_BLUE}` : `1px solid ${CONCRETE}`,
    color: liked ? WHITE : CATHEDRAL
  })
);

const Layout = glamorous.div({
  label: 'layout',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 5,
  paddingLeft: 8,
  paddingRight: 8
});

const Count = glamorous.span({
  label: 'count',
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  fontWeight: WEIGHT.BOLD,
  lineHeight: 1.83,
  letterSpacing: 0.5
});

export default class LikeButton extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    privateMode: PropTypes.bool,
    liked: PropTypes.bool.isRequired,
    type: PropTypes.oneOf([UPVOTE, STAR]),
    onToggle: PropTypes.func
  };

  render() {
    const {liked, onToggle, type, count, privateMode = false} = this.props;
    return (
      <Button onClick={onToggle} privateMode={privateMode} liked={liked}>
        <Layout>
          {type === STAR && <StarIcon active={liked} />}
          {type === UPVOTE && <UpvoteIcon active={liked} />}
          <Count>{formatCount(count)}</Count>
        </Layout>
      </Button>
    );
  }
}
