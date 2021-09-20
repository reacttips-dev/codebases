import { Image, IProps } from 'marketing-site/src/library/elements/Image'
import React from 'react'

export const ImageCard = (props: IProps) => {
  return (
    <>
      <Image {...props} classNames="image-card__row__image" />
      <style jsx global>
        {`
          .image-card__row__image {
            width: 19em !important;
            height: 18em !important;
            border-radius: 25px;
          }
        `}
      </style>
    </>
  )
}
