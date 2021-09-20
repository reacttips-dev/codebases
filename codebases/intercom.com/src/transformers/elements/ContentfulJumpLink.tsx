import React from 'react'
import { IJumpLink as IContentfulJumpLink } from 'marketing-site/@types/generated/contentful'
import { IProps as IJumpLink, JumpLink } from 'marketing-site/src/library/elements/JumpLink'

export function ContentfulJumpLink(data: IContentfulJumpLink) {
  return <JumpLink {...transformJumpLink(data)} />
}

export function transformJumpLink({ fields }: IContentfulJumpLink): IJumpLink {
  return {
    ...fields,
    elementToScrollTo: fields.idLink,
    text: fields.label,
  }
}
