import React from 'react'
import { mq } from '../../utils'
import { IProps } from './index'

export class Logo extends React.PureComponent<IProps> {
  render() {
    const { companyName, logoUrl, width, height } = this.props
    return (
      <>
        <img src={logoUrl} alt={companyName} width={width} height={height} data-testid="logo" />
        <style jsx>
          {`
            img {
              object-fit: contain;
              width: auto;
              height: auto;
              max-height: 32px;
              max-width: 120px;
            }

            @media (${mq.tablet}) {
              img {
                max-height: 50px;
                max-width: 160px;
              }
            }
          `}
        </style>
      </>
    )
  }
}
