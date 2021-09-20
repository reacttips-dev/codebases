import React from 'react'
import { IProps } from './index'
import getDefaultStyles from './styles'
import { useChildrenSanitizer } from 'marketing-site/src/library/hooks/use-children-sanitizer'

export const Text = ({ size, children }: IProps) => {
  const stylesToUse = getDefaultStyles(size)
  children = useChildrenSanitizer(children)

  return (
    <span>
      <style jsx>{stylesToUse}</style>
      {children}
    </span>
  )
}

export const BlockText = ({ size, children }: IProps) => {
  const stylesToUse = getDefaultStyles(size)
  children = useChildrenSanitizer(children)

  return (
    <div>
      <style jsx>{stylesToUse}</style>
      {children}
    </div>
  )
}
