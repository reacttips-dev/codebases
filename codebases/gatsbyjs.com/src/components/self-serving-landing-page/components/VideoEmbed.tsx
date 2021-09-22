import * as React from "react"
import { ThemeCss } from "gatsby-interface"

const iframeWrapperCss: ThemeCss = _ => ({
  position: `relative`,
  paddingBottom: `56.25%` /* 16:9 */,
  height: 0,
})

const iframeCss: ThemeCss = _ => ({
  position: `absolute`,
  height: `100%`,
  width: `100%`,
  top: 0,
  left: 0,
})

function VideoEmbed({
  embedId,
  title = "",
}: {
  embedId: string | undefined
  title: string
}) {
  return embedId ? (
    <div css={iframeWrapperCss}>
      <iframe
        css={iframeCss}
        title={title}
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  ) : null
}

export default VideoEmbed
