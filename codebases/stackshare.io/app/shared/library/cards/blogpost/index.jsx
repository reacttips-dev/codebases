import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {PHONE} from '../../../style/breakpoints';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {CHARCOAL, TARMAC} from '../../../style/colors';
import ContentCard from '../../cards/content';
import StarIcon from './Icons/star-icon-light.svg';
import ViewsIcon from './Icons/views-icon-light.svg';
import LoadMoreButton from '../../buttons/load-more';
import SignUp from '../../buttons/sign-up';

const Title = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  position: 'inherit',
  ' h3': {
    ...BASE_TEXT,
    fontSize: 18,
    color: CHARCOAL,
    fontWeight: WEIGHT.BOLD,
    lineHeight: `18px`
  },
  '>div': {
    marginLeft: 12
  }
});

const BlogSpotContainer = glamorous.div({
  display: 'grid',
  marginBottom: 26,
  gridTemplateColumns: '1fr 1fr',
  gridColumnGap: 20,
  gridRowGap: 20,
  marginTop: 21,
  [PHONE]: {
    gridTemplateColumns: '1fr'
  }
});

const PostStats = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ' .views, .favourites': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...BASE_TEXT,
    color: TARMAC,
    [PHONE]: {
      marginRight: 6
    },
    ' svg': {
      marginRight: 6
    }
  }
});

export const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 20
});

const BLOGPOST = 'posts';

const BlogPost = ({posts, title, hasNextPage, loading, loadMore, currentUser}) => {
  return (
    <>
      <Title>
        <h3 id={title.toLowerCase().replace(' ', '-')}>{title}</h3>
      </Title>
      <BlogSpotContainer>
        {posts.map(post => (
          <ContentCard
            key={post.id}
            publishedAt={post.publishedAt}
            url={post.canonicalUrl}
            title={post.title}
            services={post.tools}
            infoComponent={
              <PostStats>
                <div className="favourites">
                  <StarIcon /> <span>{post.favoriteStacksCount}</span>
                </div>
                <div className="views">
                  <ViewsIcon />
                  <span>{post.views}</span>
                </div>
              </PostStats>
            }
            clickContentEvent="click_blogCard"
            clickContentParams={{title: post.title, blog_url: post.canonicalUrl}}
            postLogo={post.imageUrl}
            companyName={post.company && post.company.name}
            fullImage={true}
            orderChange={true}
          />
        ))}
      </BlogSpotContainer>
      {currentUser && hasNextPage && (
        <Center>
          <LoadMoreButton loading={loading} onClick={loadMore} />
        </Center>
      )}
      <Center>
        {!currentUser && hasNextPage && <SignUp text="Sign up to see more" section={BLOGPOST} />}
      </Center>
    </>
  );
};

BlogPost.propTypes = {
  posts: PropTypes.array,
  title: PropTypes.string,
  hasNextPage: PropTypes.bool,
  loading: PropTypes.bool,
  loadMore: PropTypes.func,
  currentUser: PropTypes.object
};

export default BlogPost;
