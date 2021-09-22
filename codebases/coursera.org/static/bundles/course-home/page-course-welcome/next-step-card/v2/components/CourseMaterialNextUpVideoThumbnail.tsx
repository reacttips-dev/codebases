import React from 'react';

import { compose } from 'recompose';
import { Box } from '@coursera/coursera-ui';
import { SvgVideo } from '@coursera/coursera-ui/svg';

import gql from 'graphql-tag';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import mapProps from 'js/lib/mapProps';
import waitForGraphQL from 'js/lib/waitForGraphQL';

import Naptime from 'bundles/naptimejs';
import Assets from 'bundles/naptimejs/resources/assets.v1';

import type {
  OnDemandAssetVideosV1GetQuery,
  OnDemandAssetVideosV1GetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/OnDemandAssetVideosV1';

import type {
  OnDemandLectureVideosV1GetQuery,
  OnDemandLectureVideosV1GetQueryVariables,
  VideoId,
} from 'bundles/naptimejs/resources/__generated__/OnDemandLectureVideosV1';

import type { VideoAsset } from 'bundles/course-home/page-course-welcome/next-step-card/v2/types';

import 'css!./__styles__/CourseMaterialNextUpVideoThumbnail';

type InputProps = {
  courseId: string;
  itemId: string;
};

type Props = InputProps & {
  videoAssetId?: string;
  videoId?: VideoId;
  asset?: VideoAsset[];
};

export const CourseMaterialNextUpVideoThumbnail: React.FunctionComponent<Props> = ({ asset }) => {
  const { videoThumbnailUrls } = asset?.[0] ?? {};

  const url = videoThumbnailUrls?.['360p']?.[0]?.url ?? null;

  if (!url) {
    return <SvgVideo size={30} color="black" style={{ marginRight: 10 }} />;
  }

  return (
    <div style={{ backgroundImage: `url('${url}')` }} className="rc-CourseMaterialNextUpVideoThumbnail">
      <Box rootClassName="content" justifyContent="center" alignItems="center">
        <div className="overlay" />
        <SvgVideo size={30} color="#ffffff" />
      </Box>
    </div>
  );
};

export default compose<Props, InputProps>(
  mapProps<InputProps, Props>(({ courseId, itemId }) => ({
    courseId,
    itemId,
    id: tupleToStringKey([courseId, itemId]),
  })),
  waitForGraphQL<InputProps, OnDemandLectureVideosV1GetQuery, OnDemandLectureVideosV1GetQueryVariables, Props>(
    gql`
      query lectureVideoAsset($id: String!) {
        OnDemandLectureVideosV1 @naptime {
          get(id: $id, includes: "video") {
            elements {
              id
              videoId
            }
          }
        }
      }
    `,
    {
      options: {
        errorPolicy: 'all',
      },
      props: ({ data, ownProps }) => ({
        ...ownProps,
        videoId: data?.OnDemandLectureVideosV1?.get?.elements?.[0].videoId,
      }),
    }
  ),
  waitForGraphQL<InputProps, OnDemandAssetVideosV1GetQuery, OnDemandAssetVideosV1GetQueryVariables, Props>(
    gql`
      query assetVideoAsset($videoId: String!) {
        OnDemandAssetVideosV1 @naptime {
          get(id: $videoId) {
            elements {
              id
              videoAssetId
            }
          }
        }
      }
    `,
    {
      options: {
        errorPolicy: 'all',
      },
      props: ({ data, ownProps }) => ({
        ...ownProps,
        videoAssetId: data?.OnDemandAssetVideosV1?.get?.elements?.[0]?.videoAssetId,
      }),
    }
  ),
  Naptime.createContainer(({ videoAssetId }: Props) => ({
    asset: Assets.multiGet([videoAssetId], {
      fields: ['name', 'videoThumbnailUrls'],
      params: {
        action: 'getWithComputed',
        validity: 1000,
      },
    }),
  }))
)(CourseMaterialNextUpVideoThumbnail);
