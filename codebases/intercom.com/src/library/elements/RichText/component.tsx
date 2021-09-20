import React from 'react'
import kebabCase from 'lodash.kebabcase'
import classnames from 'classnames'
import { BLOCKS, Block, Inline } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { IProps } from './index'
import style from './style.scss'

type Node = Block | Inline

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => (
      <h1 id={getId(children)}>{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => (
      <h2 id={getId(children)}>{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: Node, children: React.ReactNode) => (
      <h3 id={getId(children)}>{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: Node, children: React.ReactNode) => (
      <h4 id={getId(children)}>{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: Node, children: React.ReactNode) => (
      <h5 id={getId(children)}>{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: Node, children: React.ReactNode) => (
      <h6 id={getId(children)}>{children}</h6>
    ),
  },
}

function getId(children: React.ReactNode) {
  if (Array.isArray(children) && typeof children[0] === 'string') {
    return kebabCase(children[0])
  }

  if (typeof children === 'string') {
    return kebabCase(children)
  }
}

function createHTMLWithKey(html: string) {
  return {
    __html: html,
  }
}

function render(document: IProps['document'], html: IProps['html'], className: string) {
  if (document)
    return <div className={className}>{documentToReactComponents(document, options)}</div>
  /* eslint-disable react/no-danger */
  if (html) return <div className={className} dangerouslySetInnerHTML={createHTMLWithKey(html)} />
}

export function RichText({ document, html, behaviour }: IProps) {
  const className = classnames('rich-text', {
    [`rich-text__${behaviour?.toLowerCase()}`]: !!behaviour,
  })

  return (
    <>
      {render(document, html, className)}
      <style jsx>{style}</style>
    </>
  )
}
