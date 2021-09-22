import _ from 'lodash';

import katex from 'katex';
import renderA11yString from 'katex/dist/contrib/render-a11y-string';

import 'css!katex/dist/katex.min.css'; // eslint-disable-line import/extensions, no-restricted-syntax
import 'css!./__styles__/katex';

// Match text inside $$ $$ or \( \)
const LATEX_INLINE_REGEXP = /(\$\$|\\\()((.|\n|\r)*?)(\$\$|\\\))/gm;

// Match text inside \[ \]
const LATEX_BLOCK_REGEXP = /(\\\[)((.|\n|\r)*?)(\\\])/gm;

const a11yString = (str: string) => {
  try {
    // Some functions are not supported on KaTeX render-a11y-string. Fallback to original LaTeX
    // string on that case.
    return renderA11yString(str);
  } catch {
    return str;
  }
};

const katexReplacer = (options = {}) => (_match: string, _p1: string, latex: string): string => {
  const unescaped = _.unescape(latex);
  try {
    const katexString = katex.renderToString(unescaped, options);
    return `<span aria-label="${a11yString(unescaped)}">${katexString}</span>`;
  } catch {
    // Replace surrounding $$ to \( \) if Katex failed to avoid false snippet detection if there
    // are two formulas in one string.
    return `\\(${latex}\\)`;
  }
};

/**
 * Replace LaTeX equations to HTML with KaTeX.
 * Matches equations inside $$ $$, \( \) or \[ \] for block equations.
 * If transformation is failed for some reason (unsupported or wrong syntax), it will
 * leave LaTeX code as is.
 */
export const katexify = (str: string): string =>
  str.replace(LATEX_INLINE_REGEXP, katexReplacer()).replace(LATEX_BLOCK_REGEXP, katexReplacer({ displayMode: true }));

export default katexify;
