import React, { useContext } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'

import IntercomBrushLarge from 'marketing-site/src/fonts/IntercomBrush-Large.woff'
import IntercomBrushLargeWoff2 from 'marketing-site/src/fonts/IntercomBrush-Large.woff2'
import IntercomBrushSmall from 'marketing-site/src/fonts/IntercomBrush-Small.woff'
import IntercomBrushSmallWoff2 from 'marketing-site/src/fonts/IntercomBrush-Small.woff2'

import CurrentLocaleContext from 'marketing-site/src/components/context/CurrentLocaleContext'
import buildPath from 'marketing-site/lib/buildPath'

export const CareersPageContext = React.createContext<{
  isCareersPage: boolean
  onLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}>({
  isCareersPage: false,
  onLocationChange: () => {},
})

export default function CareersPage({ children }: IPageBehaviorComponentProps) {
  const locale = useContext(CurrentLocaleContext)

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPath: string = `/careers/` + event.target.value

    if (newPath) {
      window.location.href = buildPath({ localeCode: locale.code, pathname: newPath }).canonical
    }
  }

  return (
    <CareersPageContext.Provider value={{ isCareersPage: true, onLocationChange: onChange }}>
      <style jsx global>{`
        @font-face {
          font-family: 'Intercom Brush Small';
          font-display: swap;
          src: url(${IntercomBrushSmallWoff2}) format('woff2'),
            url(${IntercomBrushSmall}) format('woff');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'Intercom Brush Large';
          font-display: swap;
          src: url(${IntercomBrushLargeWoff2}) format('woff2'),
            url(${IntercomBrushLarge}) format('woff');
          font-weight: normal;
          font-style: normal;
          letter-spacing: 3px;
        }

        #main {
          padding-top: 0;
        }
        .card-with-icons-wrapper .subheader span {
          font-size: 26px;
        }
      `}</style>
      {children}
    </CareersPageContext.Provider>
  )
}
