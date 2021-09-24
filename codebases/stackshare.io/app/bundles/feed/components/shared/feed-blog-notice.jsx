import Notice, {BOX, LEFT} from '../../../../shared/library/notices/notice';
import glamorous from 'glamorous';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer';
import {compose} from 'react-apollo';
import {FOCUS_BLUE} from '../../../../shared/style/colors';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';

const NoticeBody = glamorous.span({
  fontSize: 14,
  '& a, & a:hover, & a:visited, & a:focus': {
    color: FOCUS_BLUE,
    textDecoration: 'underline',
    marginLeft: 2
  }
});

export const BLOG_NOTICE_SEEN = 'blogNoticeSeen';

class BlogNotice extends Component {
  static propTypes = {
    storageProvider: PropTypes.object,
    currentUser: PropTypes.object
  };

  state = {
    showBlogNotice: this.props.currentUser === null
  };

  getFirstRunState = storageProvider => {
    const showBlogNotice = !storageProvider.getBoolean(BLOG_NOTICE_SEEN);
    return {showBlogNotice};
  };

  componentDidMount() {
    if (this.props.currentUser === null) {
      return;
    } else {
      const {showBlogNotice} = this.getFirstRunState(this.props.storageProvider);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({showBlogNotice});
    }
  }

  handleDismissNotice = () => {
    this.setState({showBlogNotice: false});
    this.props.storageProvider.setItem(BLOG_NOTICE_SEEN, true);
  };

  render() {
    const {currentUser} = this.props;
    const {showBlogNotice} = this.state;

    if (showBlogNotice) {
      return (
        <Notice
          align={LEFT}
          theme={BOX}
          fullWidth={true}
          title={
            <NoticeBody>
              🎊
              <a href="/one-million-developers" target="_blank">
                StackShare is now <span style={{fontWeight: 'bold'}}>1M</span> developers strong!
              </a>
            </NoticeBody>
          }
          onDismiss={currentUser ? this.handleDismissNotice : null}
        />
      );
    }

    return null;
  }
}

export default compose(
  withLocalStorage('Feed', '1'),
  withCurrentUser
)(BlogNotice);
