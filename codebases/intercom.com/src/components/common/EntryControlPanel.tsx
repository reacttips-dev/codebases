import React from 'react'
import { Entry } from 'contentful'
import { CTALink } from 'marketing-site/src/library/elements/CTALink'
import * as Utils from 'marketing-site/src/library/utils'

import contentfulLogo from 'marketing-site/src/images/contentful.png'
import ctfBranch from 'marketing-site/src/images/ctf-branch.svg'

export default function EntryControlPanel({ entry }: { entry: Entry<{}> }) {
  return (
    <>
      <div className="entry-panel">
        <span className="entry-panel-details">
          <div className="content-type">
            <code>{entry.sys.contentType.sys.id}</code>
            <br />
            <span>
              <img src={ctfBranch} width="16" alt="Contentful logo" />
              <code className="entry-branch">{process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}</code>
            </span>
          </div>
          <CTALink
            bgColor={Utils.CTATheme.BlackOutline}
            text="Edit content type"
            url={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}/content_types/${entry.sys.contentType.sys.id}`}
            newWindow
            small
          />{' '}
          <CTALink
            bgColor={Utils.CTATheme.BlackOutline}
            text="Edit entry"
            url={`https://app.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}/entries/${entry.sys.id}`}
            newWindow
            small
          />
        </span>
        <img src={contentfulLogo} width="40" alt="Contentful logo" />
      </div>

      <style jsx>{`
        .entry-panel {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0);
          padding: 10px;
          opacity: 0.1;
          border-radius: 5px;
          transition: all 0.3s ease;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0);
        }

        .entry-panel:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.99);
          box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
        }

        .entry-panel-details {
          display: none;
        }

        .content-type {
          display: inline-block;
          margin: 0 20px;
          height: 100%;
          vertical-align: middle;
        }

        .entry-panel:hover .entry-panel-details {
          display: block;
        }

        .entry-panel:hover img {
          margin-left: 10px;
        }

        .entry-branch {
          margin-left: 10px;
          vertical-align: top;
          font-weight: bold;
        }
      `}</style>
    </>
  )
}
