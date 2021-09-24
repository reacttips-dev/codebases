import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {formatCount} from '../../../../shared/utils/format';
import {grid} from '../../../../shared/utils/grid';
import Text from '../../../../shared/library/typography/text';
import {TARMAC, CHARCOAL} from '../../../../shared/style/colors';

const Layout = glamorous.div({
  padding: `${grid(1)}px 10px`,
  flex: 1
});

const Stat = glamorous(Text)(
  {
    display: 'inline-block',
    marginRight: 6,
    marginLeft: 6
  },
  ({clickable}) => ({
    cursor: clickable === true ? 'pointer' : 'auto',
    ' &:hover': {
      color: clickable === true ? CHARCOAL : TARMAC
    }
  })
);

class Stats extends Component {
  static propTypes = {
    upvotes: PropTypes.number,
    comments: PropTypes.number,
    views: PropTypes.number,
    onCommentsToggle: PropTypes.func
  };

  render() {
    const {upvotes, comments, views, onCommentsToggle} = this.props;

    const hasUpvotes = Boolean(upvotes);
    const hasComments = Boolean(comments);
    const hasViews = Boolean(views);

    return (
      <Layout>
        {hasUpvotes && (
          <React.Fragment>
            <Stat>
              {formatCount(upvotes)} {upvotes > 1 ? 'upvotes' : 'upvote'}
            </Stat>
            {(hasComments || hasViews) && <span>&middot;</span>}
          </React.Fragment>
        )}
        {hasComments && (
          <React.Fragment>
            <Stat clickable={true} onClick={onCommentsToggle}>
              {formatCount(comments)} {comments > 1 ? 'comments' : 'comment'}
            </Stat>
            {hasViews && <span>&middot;</span>}
          </React.Fragment>
        )}
        {hasViews && (
          <Stat>
            {formatCount(views)} {views > 1 ? 'views' : 'view'}
          </Stat>
        )}
      </Layout>
    );
  }
}

export default Stats;
