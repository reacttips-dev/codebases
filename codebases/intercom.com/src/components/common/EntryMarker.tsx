import { Entry } from 'contentful'
import React from 'react'
import EntryControlPanel from './EntryControlPanel'

const EntryMarkerTreeContext = React.createContext<Entry<{}>[]>([])

interface IProps {
  entry: Entry<{}> | undefined
  children: (() => React.ReactNode) | React.ReactNode
}

export default class EntryMarker extends React.Component<IProps> {
  static contextType = EntryMarkerTreeContext

  render() {
    const { children, entry } = this.props
    const entryTree: Entry<{}>[] = this.context.concat([entry])

    try {
      const renderedChildren = (
        <EntryMarkerTreeContext.Provider value={entryTree}>
          {children instanceof Function ? children() : children}
        </EntryMarkerTreeContext.Provider>
      )

      if (entry && process.env.EDITOR_UI === 'true') {
        return (
          <>
            <div className="entry-wrapper">
              <div className="entry-panel" aria-hidden>
                <EntryControlPanel entry={entry} />
              </div>
            </div>

            {renderedChildren}

            <style jsx>{`
              .entry-wrapper {
                position: relative;
              }

              .entry-panel {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 500;
              }

              .entry-panel:hover {
                z-index: 501;
              }
            `}</style>
          </>
        )
      }

      return renderedChildren
    } catch (error) {
      if (!entry) throw error
    }
  }
}
