import React from 'react'
import { IProps as IVideoPlayer } from 'marketing-site/src/library/elements/VideoPlayer'
import { IVideoPlayer as IContentfulVideoPlayer } from 'marketing-site/@types/generated/contentful'
import { VideoPlayer } from 'marketing-site/src/library/elements/VideoPlayer'

export const ContentfulVideoPlayer = (videoPlayer: IContentfulVideoPlayer) => (
  <VideoPlayer {...transformVideoPlayer(videoPlayer)} />
)

export function transformVideoPlayer({ fields }: IContentfulVideoPlayer): IVideoPlayer {
  return {
    posterImage: fields.posterImage.fields.file.url,
    videoUrl: fields.video.fields.file.url,
    videoWebmUrl: fields.videoWebm && fields.videoWebm.fields.file.url,
  }
}
