import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import Highlight, { defaultProps } from 'prism-react-renderer'
import dracula from 'prism-react-renderer/themes/dracula'
import duotoneDark from 'prism-react-renderer/themes/duotoneDark'
import duotoneLight from 'prism-react-renderer/themes/duotoneLight'
import github from 'prism-react-renderer/themes/github'
import nightOwl from 'prism-react-renderer/themes/nightOwl'
import nightOwlLight from 'prism-react-renderer/themes/nightOwlLight'
import oceanicNext from 'prism-react-renderer/themes/oceanicNext'
import palenight from 'prism-react-renderer/themes/palenight'
import shadesOfPurple from 'prism-react-renderer/themes/shadesOfPurple'
import ultramin from 'prism-react-renderer/themes/ultramin'
import vsDark from 'prism-react-renderer/themes/vsDark'

import { Omit, HTMLProps } from '../../helpers/omitType'
import { CodeBlockTheme, CodeBlockLanguage, CodeBlockFontSize } from './types'
import Copy from '../Copy'

export interface CodeBlockProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size' | 'onCopy'> {
  /**
   * Sets the theme of the syntax highlighting for the CodeBlock.
   */
  theme?: CodeBlockTheme
  /**
   * The content of the CodeBlock. Should probably be wrapped in template literals to retain whitespace.
   */
  children: string
  /**
   * The language displayed within the CodeBlock, used to correctly highlight the syntax.
   */
  language?: CodeBlockLanguage
  /**
   * Whether to show line numbers within the CodeBlock. Set this to false if space is a constraint.
   * @type bool
   */
  withLineNumbers?: boolean
  /**
   * Optional callback after copying.
   */
  onCopy?: (a: string, b: boolean) => void
  /**
   * If true, the CodeBlock will have rounded corners.
   */
  isRounded?: boolean
  /**
   * Adjusts the monospace font size. For this to work, you will have to extend the default
   * theme as the default theme only has a single monospace type style.
   */
  fontSize?: CodeBlockFontSize
}

const themes = {
  dracula,
  duotoneDark,
  duotoneLight,
  github,
  nightOwl,
  nightOwlLight,
  oceanicNext,
  palenight,
  shadesOfPurple,
  ultramin,
  vsDark,
}

/**
 * CodeBlocks allow for multi-line code snippets to be rendered.
 */
const CodeBlock = forwardRef(function CodeBlock(
  props: CodeBlockProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    theme = 'duotoneDark',
    children,
    language,
    isRounded,
    withLineNumbers,
    onCopy,
    fontSize,
    ...rest
  } = props

  const buttonTheme =
    ['duotoneLight', 'github', 'nightOwlLight', 'ultramin'].indexOf(theme) ===
    -1
      ? 'dark'
      : 'light'

  return (
    <div {...rest} ref={ref} className={cx('hds-code-block', className)}>
      <Highlight
        {...defaultProps}
        code={children.trim()}
        // @ts-ignore
        language={language}
        theme={themes[theme]}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cx('hds-code-block-pre', className, {
              'hds-code-block-no-rounded': !isRounded,
            })}
            style={{ ...style, fontSize: `${fontSize}px` }}
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {withLineNumbers && (
                  <span
                    className="hds-code-block-line-number"
                    style={{ width: `${tokens.length.toString().length}em` }}
                  >
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <div
        className={cx('hds-code-block-button-wrap', {
          [`hds-theme-${buttonTheme}`]: buttonTheme,
        })}
      >
        <Copy
          stringToCopy={children.trim()}
          onCopy={onCopy}
          copyFormat="text/plain"
        />
      </div>
    </div>
  )
})

CodeBlock.defaultProps = {
  language: 'javascript',
  theme: 'duotoneDark',
  withLineNumbers: true,
  isRounded: true,
  fontSize: '14',
}

export default CodeBlock
