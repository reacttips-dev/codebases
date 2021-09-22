import React from 'react'
import styled from 'styled-components'
import { Text, Spaced } from '@invisionapp/helios'

type BlockerCardProps = {
  title: string
  children: React.ReactChildren
  imageURL?: string
  image?: React.JSXElementConstructor<any>
}

const BlockerCard = (props: BlockerCardProps) => {
  const { title, children, imageURL, image } = props
  const Image = image as React.JSXElementConstructor<any>

  return (
    <Section>
      {image !== undefined ? <Image /> : undefined}
      {imageURL && <img alt="Placeholder" src={imageURL} />}
      {title && (
        <Spaced top="s" bottom="xs">
          <Text order="subtitle" size="larger" align="center" color="text-darker">
            {title}
          </Text>
        </Spaced>
      )}
      <StyledText
        order="body"
        align="center"
        color="text-lighter"
        prose
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </Section>
  )
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledText = styled(Text)`
  width: 100%;
  max-width: 450px;
  margin-right: auto;
  margin-left: auto;
`

export default BlockerCard
