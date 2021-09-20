import React from 'react'

import { Color } from 'marketing-site/src/library/utils'
import { Text } from 'marketing-site/src/library/elements/Text'

interface IProps {
  label: string
}

export default function SkipToContent({ label }: IProps) {
  return (
    <>
      <a href="#main">
        <Text size="md+">{label}</Text>
      </a>
      <style jsx>
        {`
          a {
            left: -999px;
            position: absolute;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
            z-index: -999;
          }

          a:focus {
            display: block;
            background: ${Color.Black};
            color: ${Color.White};
            box-sizing: border-box;
            z-index: 999;
            padding: 10px 40px;
            top: 0;
            width: auto;
            height: auto;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 0 0 5px 5px;
            outline: 1px dotted ${Color.Black};
            outline-offset: 3px;
          }
        `}
      </style>
    </>
  )
}
