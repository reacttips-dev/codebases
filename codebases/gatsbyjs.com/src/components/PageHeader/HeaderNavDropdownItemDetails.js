import React from "react"

import { HeaderNavDropdownItemDetailsPresenter } from "./HeaderNavDropdownItemDetailsPresenter"
import { displayOnDesktopOnly } from "../shared/styles"

const rootCss = theme => ({
  paddingTop: theme.space[4],
  paddingLeft: theme.space[11],
  paddingRight: theme.space[7],
  display: `grid`,
  gap: theme.space[4],
  ...displayOnDesktopOnly({ theme, as: `grid` }),
})

const columnsCss = ({ numberOfColumns }) => ({
  display: `grid`,
  gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
})

export function HeaderNavDropdownItemDetails({ data }) {
  return (
    <ul css={rootCss}>
      {data.map((section, idx) => (
        <li key={`detailsSec${idx}`}>
          {(() => {
            if (Array.isArray(section)) {
              const numberOfColumns = section.length

              return (
                <ul css={() => columnsCss({ numberOfColumns })}>
                  {section.map((column, idx) => {
                    return (
                      <li key={`detailsCol${idx}`}>
                        <HeaderNavDropdownItemDetailsPresenter data={column} />
                      </li>
                    )
                  })}
                </ul>
              )
            } else {
              return (
                <HeaderNavDropdownItemDetailsPresenter
                  data={section}
                  layout="row"
                />
              )
            }
          })()}
        </li>
      ))}
    </ul>
  )
}
