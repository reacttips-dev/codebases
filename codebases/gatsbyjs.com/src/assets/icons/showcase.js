import * as React from "react"

function ShowcaseIcon(props) {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.156 23.156L12.5 29l-2.656-5.844L4 20.5l5.844-2.656L12.5 12l2.656 5.844L21 20.5l-5.844 2.656z"
        className="showcase_svg__svg-stroke showcase_svg__svg-stroke-dark showcase_svg__svg-fill-background"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.91 15.91L24.5 19l-1.41-3.09L20 14.5l3.09-1.41L24.5 10l1.41 3.09L29 14.5l-3.09 1.41z"
        className="showcase_svg__svg-fill-dark"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.597 7.597L16.5 10l-1.097-2.403L13 6.5l2.403-1.097L16.5 3l1.097 2.403L20 6.5l-2.403 1.097z"
        className="showcase_svg__svg-fill-accent"
      />
    </svg>
  )
}

export default ShowcaseIcon
