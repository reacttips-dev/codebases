import { Image } from 'marketing-site/src/library/elements/Image'
import React, { useEffect, useState } from 'react'
import { mq, useMediaQuery } from 'marketing-site/src/library/utils'
import { CardRow } from '../../elements/CardRow'
import { ICardContainerCard, IProps } from './index'
import styles from './styles.scss'
import { Text } from 'marketing-site/src/library/elements/Text'

export function CardContainer({ icon, title, row1Cards, row2Cards }: IProps) {
  const [allCards, setAllCards] = useState<ICardContainerCard[]>([])
  const isMobile = useMediaQuery(`(${mq.mobile})`)

  useEffect(() => {
    setAllCards(row1Cards.concat(row2Cards))
  }, [row1Cards, row2Cards])

  return (
    <>
      <div className="card-container" data-testid="card-container">
        {icon && (
          <div className="card-container__icon">
            <Image {...icon} />
          </div>
        )}

        <div className="card-container__title">
          <Text size="xxl+">{title}</Text>
        </div>

        {isMobile ? (
          <div className="card-container__rows">
            <CardRow cards={allCards} autoScroll={false} initialPosition="left" />
          </div>
        ) : (
          <div className="card-container__rows">
            <CardRow cards={row1Cards} autoScroll={true} initialPosition="left" />
            <CardRow cards={row2Cards} autoScroll={true} initialPosition="right" />
          </div>
        )}
      </div>
      <div className="card-container__background-drop"></div>
      <style jsx>{styles}</style>
    </>
  )
}
