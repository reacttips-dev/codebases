import React from 'react'
import { mq } from '../../utils'
import { Text } from '../Text'
import { IProps } from './index'

export class TranscriptButton extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { onClick, showTranscriptContentId } = this.props
    onClick(showTranscriptContentId)
  }

  render() {
    return (
      <button className="transcript-button" onClick={this.handleClick} type="button">
        <Text size="caption">Video Transcript</Text>
        <style jsx>
          {`
            .transcript-button {
              display: block;
              cursor: pointer;
              color: inherit;
              text-decoration: none;
              border-bottom: 1px dotted;
              margin: 0 auto;
              margin-top: 20px;
            }
            .transcript-button:hover,
            .transcript-button:focus {
              border-bottom: 1px solid;
              outline: none;
            }
            @media (${mq.tablet}) {
              .transcript-button {
                margin: unset;
                margin-top: 20px;
              }
            }
          `}
        </style>
      </button>
    )
  }
}
