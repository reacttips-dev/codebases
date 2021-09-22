import React from 'react'
import withProps from 'recompose/withProps'
import styled from 'styled-components'
// @ts-ignore
import notFoundImage from '@invisionapp/helios/illustrations/scene/not-found.svg'
import { HeliosTheme } from '@invisionapp/helios/css/theme'
import BlockerCard from '../BlockerCard'

type ImageProps = {
  src: string
  alt: string
  theme: HeliosTheme
}

type NotFoundCardProps = {
  heading?: React.ReactChildren
  imageSrc?: string
  title?: string
}

const NotFoundCard = (props: NotFoundCardProps) => {
  const heading = (props.heading
    ? props.heading
    : "We've searched high and low, but no one could be found.") as React.ReactChildren

  const Image = withProps({
    src: props.imageSrc ? props.imageSrc : notFoundImage,
    alt: 'Not Found'
  })(styled.img`
    height: 190px;
    margin: ${(props: ImageProps) => props.theme.spacing.m} auto 0;
  `)

  return (
    <BlockerCard title={props.title ? props.title : 'No results found'} image={Image}>
      {heading}
    </BlockerCard>
  )
}

export default NotFoundCard
