import { IHeroImage, IVideo } from 'marketing-site/src/library/components/HeroWithCTA'
import {
  IHeroWithCtAsImage as IContentfulHeroImage,
  IHeroVideo as IContentfulHeroVideo,
} from 'marketing-site/@types/generated/contentful'
import { transformImage } from './ContentfulImage'

type Media = IContentfulHeroVideo | IContentfulHeroImage

const isVideoEntry = (media: Media): media is IContentfulHeroVideo =>
  media && !!(media as IContentfulHeroVideo).fields.video

const isImageEntry = (media: Media): media is IContentfulHeroImage =>
  media && !!(media as IContentfulHeroImage).fields.imageRef

export function transformVideoOrImage(media: Media): IHeroImage | IVideo | undefined {
  if (isVideoEntry(media)) {
    return {
      fallbackImage: media.fields.fallbackImage.fields.file.url,
      isBackground: media.fields.isBackground,
      video: media.fields.video.fields.file.url,
      videoWebm: media.fields.videoWebm && media.fields.videoWebm.fields.file.url,
      playOnce: media.fields.notLooping,
    }
  } else if (isImageEntry(media)) {
    return {
      imageRef: transformImage(media.fields.imageRef),
      isBackground: media.fields.isBackground,
      mobileImage: media.fields.mobileImage && transformImage(media.fields.mobileImage),
    }
  }
  return undefined
}
