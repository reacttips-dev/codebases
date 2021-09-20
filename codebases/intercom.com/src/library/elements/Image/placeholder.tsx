import React from 'react'

interface IProps {
  width: number
  height: number
  mobileWidth?: number
  mobileHeight?: number
}

export const ImagePlaceholder = ({ height, width, mobileHeight, mobileWidth }: IProps) => {
  const desktopUrl = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3C/svg%3E`
  const mobileUrl = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mobileWidth} ${mobileHeight}"%3E%3C/svg%3E`
  const hasMobileUrl = mobileHeight && mobileWidth

  return (
    <>
      <picture>
        {hasMobileUrl && <img src={mobileUrl} alt="" className="img__placeholder--mobile" />}
        <img src={desktopUrl} alt="" className="img__placeholder--desktop" />
      </picture>
      <style jsx>
        {`
          picture {
            line-height: 0;
            display: inherit;
          }

          img {
            max-width: 100%;
            width: ${width}px !important;
          }

          .img__placeholder--mobile {
            display: none;
          }

          @media (max-width: 767px) {
            .img__placeholder--desktop {
              display: ${hasMobileUrl ? 'none' : 'inline-block'};
            }

            .img__placeholder--mobile {
              width: ${mobileWidth}px;
              display: ${hasMobileUrl ? 'inline-block' : 'none'};
            }
          }
        `}
      </style>
    </>
  )
}
