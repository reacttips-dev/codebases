import { useServerPropsContext } from 'marketing-site/src/components/context/ServerPropsContext'
import React, { useEffect } from 'react'
import { IProps } from './index'

export function WistiaVideo(props: IProps) {
  const { nonce } = useServerPropsContext()

  useEffect(() => {
    const script = document.createElement('script')
    script.nonce = nonce
    script.src = '//fast.wistia.net/assets/external/iframe-api-v1.js'

    document.head.appendChild(script)
  }, [nonce])

  const iframeStyle = {
    width: 1000,
    height: 560,
    display: 'block',
  }

  return (
    <>
      <iframe
        src={`https://fast.wistia.net/embed/iframe/${props.wistiaId}?videoFoam=true&videoQuality=hd-only`}
        title={props.title ? `Video titled '${props.title}'` : 'Video'}
        className="wistia-embed-video"
        name="wistia_embed"
        frameBorder="0"
        allowFullScreen
        style={iframeStyle}
      ></iframe>
    </>
  )
}
