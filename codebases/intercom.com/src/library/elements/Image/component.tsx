import React, { useEffect, useLayoutEffect, useState } from 'react'
import { loadImage } from '../../utils/network'
import { ImagePlaceholder, IProps, IImageProps } from './index'
import { transformImagePropsIntoQueryString } from './transformImageProps'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const getRegularUrl = ({ url, ...props }: IImageProps) => {
  if (props.format === 'webp') {
    delete props.format
  }
  const urlQuery = transformImagePropsIntoQueryString(props)
  return `${url}${urlQuery}`
}

const getWebmUrl = ({ url, ...props }: IImageProps) => {
  delete props.formatOptimization
  props.format = 'webp'
  const urlQuery = transformImagePropsIntoQueryString(props)
  return `${url}${urlQuery}`
}

const getUrls = (props: IImageProps, enableWebm: boolean) => {
  if (!enableWebm) {
    return { url: getRegularUrl(props) }
  }

  return { url: getRegularUrl(props), webmUrl: getWebmUrl(props) }
}

export const Image = ({ ...props }: IProps) => {
  const enablePlaceholder = props.width != null && props.height != null
  const [loaded, setLoaded] = useState(!enablePlaceholder)
  const [viewportUrl, setViewportUrl] = useState(props.mobileImage?.url || props.url)

  props.enableWebm = typeof props.enableWebm === 'boolean' ? props.enableWebm : true
  const desktopUrls = getUrls(props, props.enableWebm)

  const mobileUrls = props.mobileImage && getUrls(props.mobileImage, props.enableWebm)

  useIsomorphicLayoutEffect(() => {
    const isMobile = window.innerWidth <= 767

    let noWebp, webp
    if (isMobile && mobileUrls) {
      webp = mobileUrls.webmUrl
      noWebp = mobileUrls.url
    } else {
      webp = desktopUrls.webmUrl
      noWebp = desktopUrls.url
    }

    webp = webp ? webp : noWebp

    setViewportUrl(noWebp)
    loadImage(webp).then(() => setLoaded(true))
  }, [])

  return (
    <>
      <picture>
        {/* SVG is our first pref but we don't want to force it for other formats */}
        {props.url.endsWith('.svg') && <source type="image/svg+xml" srcSet={props.url} />}
        {props.mobileImage && props.enableWebm && (
          <source srcSet={mobileUrls?.webmUrl} media="(max-width: 767px)" />
        )}
        {props.mobileImage && <source srcSet={mobileUrls?.url} media="(max-width: 767px)" />}
        {/* Webm version of gif will always loop */}
        {props.enableWebm && <source type="image/webp" srcSet={desktopUrls.webmUrl} />}
        <img
          alt={props.altText || ''}
          src={viewportUrl}
          className={props.classNames}
          height={props.height}
          width={props.width}
        />
      </picture>
      <noscript>
        <img
          alt={props.altText || ''}
          src={desktopUrls.url}
          className={props.classNames}
          height={props.height}
          width={props.width}
        />
      </noscript>

      {loaded || !props.width || !props.height ? null : (
        <ImagePlaceholder
          width={props.width}
          height={props.height}
          mobileHeight={props.mobileImage?.height}
          mobileWidth={props.mobileImage?.width}
        />
      )}

      <style jsx>
        {`
          picture {
            line-height: 0;
            display: ${loaded ? 'inherit' : 'none'};
            max-width: 100%;
            max-height: 100%;
          }

          img {
            height: auto;
            width: auto;
            max-width: inherit;
            max-height: inherit;
          }
        `}
      </style>
    </>
  )
}
