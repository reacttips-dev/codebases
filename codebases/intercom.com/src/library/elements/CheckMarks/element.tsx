import classnames from 'classnames'
import React from 'react'
import { Text } from '../Text'
import { IProps } from './index'
import { getThemeProps } from './themes'
import styles from './styles.scss'

export const CheckMarks = (props: IProps) => {
  const { items, vertical, large, inverse, alternateItemIcon, headline, theme } = props
  const containerClassNames = classnames('list-container', theme)
  const checkMarksClassNames = classnames('checkmarks', {
    white: inverse === true,
    vertical,
    large,
  })

  const iconClassname = classnames('checkmarks-icon', alternateItemIcon)
  const themeProps = getThemeProps(props)

  return (
    <div className={containerClassNames}>
      {headline && (
        <span className="headline">
          <Text size="lg-eyebrow">{headline}</Text>
        </span>
      )}
      <ul className={checkMarksClassNames}>
        {items.map((item) => {
          return (
            <li key={item} className="checkmarks-item">
              <span className={iconClassname} />
              <Text size={themeProps.listTextSize}>{item}</Text>
            </li>
          )
        })}
      </ul>
      <style jsx>{styles}</style>
    </div>
  )
}
