import React, { useState, useEffect } from 'react'
import parseHtml from 'html-react-parser'
import { sanitizeHTML } from 'marketing-site/src/library/utils/html-sanitizer'

const sanitizeReactChildren = (children: any) => {
  const sanitizedChildren: any[] = []
  React.Children.forEach<any>(children, (child) => {
    if (typeof child !== 'string') {
      sanitizedChildren.push(child)
      return
    }

    const sanitizedHtml = sanitizeHTML(child)
    sanitizedChildren.push(parseHtml(sanitizedHtml))
  })
  return sanitizedChildren
}

export const useChildrenSanitizer = (children?: any) => {
  const [sanitizedChildren, setSanitizedChildren] = useState<any[]>([])

  useEffect(() => {
    if (!children) {
      setSanitizedChildren([])
      return
    }
    setSanitizedChildren(sanitizeReactChildren(children))
  }, [children])

  return sanitizedChildren
}
