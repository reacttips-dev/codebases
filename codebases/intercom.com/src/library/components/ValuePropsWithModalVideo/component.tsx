import React from 'react'
import { ValuePropWithModalVideo } from '../../elements/ValuePropWithModalVideo'
import { Text } from '../../elements/Text'
import { IProps } from './index'
import styles from './styles.scss'

export function ValuePropsWithModalVideo({ heading, valueProps }: IProps) {
  return (
    <div className="value-props__wrapper">
      {heading && (
        <h2 className="heading">
          <Text size="body">{heading}</Text>
        </h2>
      )}
      <div className="rich-text">
        <ul>
          {valueProps.map((valueProp, index) => (
            <li key={index}>
              <span className="checkmark" />
              <ValuePropWithModalVideo {...valueProp} />
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}
