import React from 'react'

import { Center } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import InfiniteScroll, { Props } from 'react-infinite-scroll-component'

import { Spinner } from 'tribe-components'

type PostsInfiniteScrollProps = Omit<Props, 'loader'> &
  Partial<Pick<Props, 'loader'>>

const PostsInfiniteScroll = (props: PostsInfiniteScrollProps) => (
  <>
    <InfiniteScroll
      className="posts-infinite-scroll"
      loader={
        <Center pb={10} mt={5}>
          <Spinner />
        </Center>
      }
      {...props}
    />
    <Global
      styles={`
      .posts-infinite-scroll {
        padding-left: 5px;
        padding-right: 5px;
        margin-left: -5px;
        margin-right: -5px;
      }
    `}
    />
  </>
)

export default PostsInfiniteScroll
