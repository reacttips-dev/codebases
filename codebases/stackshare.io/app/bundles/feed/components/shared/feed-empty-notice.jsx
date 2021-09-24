import React, {Component} from 'react';
import glamorous from 'glamorous';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {FEED_PATH_TRENDING} from '../../../../data/feed/constants';

const Title = glamorous.span({
  textDecoration: 'underline'
});

const Container = glamorous.span();

const Link = glamorous.a();

export class FeedEmptyNotice extends Component {
  render() {
    return (
      <Container>
        Uh-oh! We don&#39;t have any posts or news for the tools you&#39;re following. Follow more
        tools or check out the{' '}
        <NavigationContext.Consumer>
          {navigate => (
            <Link
              href={FEED_PATH_TRENDING}
              title="Trending"
              onClick={event => {
                event.preventDefault();
                navigate(FEED_PATH_TRENDING);
              }}
            >
              <Title>Trending Feed</Title>
            </Link>
          )}
        </NavigationContext.Consumer>
      </Container>
    );
  }
}

export default FeedEmptyNotice;
