/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useTheme } from '@coursera/cds-core';

/**
  Migration of styles from static/bundles/cml/components/__styles__/CML.styl
  This component assumes that your page/bundle has already provided the Provider from CDS-core.
 */
type Props = {
  children: React.ReactNode;
};

const CDSToCMLStylesheet = ({ children }: Props) => {
  const theme = useTheme();
  const codeStyle = css`
    pre,
    code {
      border: 1px solid ${theme.palette.gray[400]};
      border-radius: 0;
      font-size: 0.875rem;
      line-height: 16px;
      margin-bottom: ${theme.spacing(16)};
      overflow-y: hidden;
      padding: 0;
    }

    code {
      position: relative;
      display: block;
      margin: 0 0 10px;
      word-break: break-all;
      word-wrap: break-word;
      background-color: ${theme.palette.gray[200]};
    }
  `;

  const monospaceStyle = css`
    var {
      background-color: ${theme.palette.gray[300]};
      font-family: 'Courier', 'Courier New', monospace;
      font-size: 0.95em;
      font-style: normal;
      font-weight: bold;
    }
  `;

  const figureStyle = css`
    figure {
      margin: ${theme.spacing(0, 0, 24, 0)};

      &.selected {
        outline: 2px solid ${theme.palette.green[500]};
      }

      ::selection {
        background: none;
      }

      img {
        max-width: 100%;
      }
    }
  `;

  const imgStyle = css`
    img {
      max-width: 100%;
    }
  `;

  const listStyle = css`
    ul {
      list-style-type: disc;
    }

    ul,
    ol {
      ${theme.typography.body1}
      margin-left: ${theme.spacing(32)};
      padding-left: ${theme.spacing(0)};

      li {
        margin-bottom: ${theme.spacing(8)};
        padding-left: ${theme.spacing(8)};

        p {
          margin-bottom: 0;
        }
      }
    }
  `;

  const tableStyle = css`
    table {
      margin: ${theme.spacing(0, 0, 24, 0)};
      border: 1px solid ${theme.palette.gray[300]};
      width: 100%;

      th,
      td {
        ${theme.typography.body2}
        padding: ${theme.spacing(4, 16)};
        text-align: left;
      }

      th,
      thead td {
        border: 1px solid ${theme.palette.gray[800]};
        font-weight: bold;
      }

      td {
        border: 1px solid ${theme.palette.gray[300]};
      }

      p {
        margin-bottom: 0;
      }
    }
  `;

  const cdsFonts = css`
    strong {
      font-family: unset;
    }

    h1 {
      ${theme.typography.h1}
      margin: ${theme.spacing(32, 0, 24, 0)};
      :first-of-type {
        margin-top: 0;
      }
    }
    h2 {
      ${theme.typography.h2}
      margin: ${theme.spacing(32, 0, 16, 0)};
      :first-of-type {
        margin-top: 0;
      }
    }
    h3 {
      ${theme.typography.h3semibold}
      margin: ${theme.spacing(32, 0, 12, 0)};
      :first-of-type {
        margin-top: 0;
      }
    }
    p {
      ${theme.typography.body1}
      margin-bottom: ${theme.spacing(16)};
      min-height: 20px;
    }

    a {
      text-decoration: underline;
    }
  `;

  const cmlAssets = css`
    .cml-asset {
      width: 100%;
      margin-bottom: ${theme.spacing(12)};

      .cml-asset-link {
        width: 100%;
        padding: ${theme.spacing(12)};
        display: block;
        color: ${theme.palette.gray[600]};
        overflow: hidden;
        white-space: nowrap;
        text-decoration: none;
        text-overflow: ellipsis;
        border: 1px solid ${theme.palette.gray[400]};

        &:hover {
          cursor: pointer;
          border-color: ${theme.palette.gray[400]};
        }
      }

      a {
        text-decoration: none;
      }

      .asset-container {
        border: 1px solid ${theme.palette.gray[500]};
        justify-content: space-between;

        display: flex;
        ${theme.breakpoints.down('xs')} {
          flex-wrap: wrap;
        }
        // This is done in order to have margin when the flex elements wrap.
        padding: ${theme.spacing(8, 24, 24, 24)};
        > * {
          margin-top: ${theme.spacing(16)};
          align-items: center;
        }
      }

      .asset-link-title {
        margin-right: ${theme.spacing(8)};
        margin-left: ${theme.spacing(32)};
        padding-left: ${theme.spacing(8)};
        white-space: nowrap;
      }

      .asset-info {
        margin-left: ${theme.spacing(16)};

        .asset-name {
          ${theme.typography.h3bold}
          text-overflow: ellipsis;
          overflow: hidden;
          display: inline-block;
        }

        .asset-extension {
          ${theme.typography.body2}
          color: ${theme.palette.gray[700]};
          margin-top: ${theme.spacing(8)};
        }
      }

      .asset-icon-file {
        width: ${theme.spacing(24)};
        min-width: ${theme.spacing(24)};
      }

      &.cml-asset-video {
        width: auto;
      }

      &.cml-asset-audio {
        width: 320px;
      }
    }
  `;

  const globalMapping = css`
    word-wrap: break-word;

    .show-soft-breaks {
      white-space: pre-wrap; // preserves newlines/soft-breaks
    }

    // Don't let the last child have a bottom margin
    .rc-CML > div > *:last-child,
    .rc-CML > *:last-child {
      margin-bottom: 0 !important;
    }

    .ace_scroller .ace_content .ace_layer .ace_print-margin {
      background: ${theme.palette.blue[200]};
    }

    // for usage, see "display" prop jsdoc in RenderableHtml.tsx
    .displayInlineBlock .cmlToHtml-content-container.hasAssetBlock,
    .displayInlineBlock .cmlToHtml-content-container.hasCodeBlock {
      display: inline-block;
    }
  `;
  return (
    <div
      css={[
        cdsFonts,
        cmlAssets,
        monospaceStyle,
        codeStyle,
        figureStyle,
        imgStyle,
        listStyle,
        tableStyle,
        globalMapping,
      ]}
      className="rc-CDSToCMLStylesheet"
    >
      {children}
    </div>
  );
};

export default CDSToCMLStylesheet;
