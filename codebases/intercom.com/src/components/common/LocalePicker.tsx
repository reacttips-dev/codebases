import React, { useContext } from 'react'
import path from 'path'
import { Locale } from 'contentful'
import { Text } from 'marketing-site/src/library/elements/Text'
import { ILocalePicker } from 'marketing-site/@types/generated/contentful'
import LocalesContext from 'marketing-site/src/components/context/LocalesContext'
import CurrentPathContext, { ICurrentPath } from '../context/CurrentPathContext'
import useKeyboardAccessibleGroup from 'marketing-site/lib/useKeyboardAccessibleGroup'
import styles from './styles.scss'

function getLocaleLinkHref(locale: Locale, currentPath: ICurrentPath) {
  let localeCode = locale.code
  if (localeCode === 'en-US') localeCode = ''
  return path.join('/', localeCode, currentPath.plain)
}

export const IntercomLocalePicker: React.FC<ILocalePicker> = ({ fields }: ILocalePicker) => {
  const locales = useContext(LocalesContext)
  const currentPath = useContext(CurrentPathContext)
  const { containerProps, itemProps } = useKeyboardAccessibleGroup<HTMLAnchorElement>()

  if (!locales.length) return null

  return (
    <nav className="locale-picker__container" aria-labelledby="locale-picker__title">
      <h3 id="locale-picker__title">
        <Text size="caption+">
          <span className="locale-picker__main-button-icon" role="img" aria-hidden>
            🌎
          </span>
          {fields.heading}
        </Text>
      </h3>
      <ul {...containerProps}>
        {locales.map((locale, index) => (
          <li key={index}>
            <a
              className="locale-picker__link"
              href={getLocaleLinkHref(locale, currentPath)}
              lang={locale.code}
              {...itemProps(index)}
            >
              <Text size="caption">{locale.name}</Text>
            </a>
          </li>
        ))}
      </ul>
      <style jsx>{styles}</style>
    </nav>
  )
}
