import React from 'react'
import { IProps } from './index'
import { WiredCardElement } from 'marketing-site/src/library/elements/WiredCardElement'
import wire1 from 'marketing-site/src/images/Wire-SVGs/Wire-1.svg'
import wire2 from 'marketing-site/src/images/Wire-SVGs/Wire-2.svg'
import wire3 from 'marketing-site/src/images/Wire-SVGs/Wire-3.svg'
import wire4 from 'marketing-site/src/images/Wire-SVGs/Wire-4.svg'
import wire5 from 'marketing-site/src/images/Wire-SVGs/Wire-5.svg'

export const WiredCardsComponent = ({ cards }: IProps) => {
  return (
    <div className="wired-cards-wrapper">
      <div className="wired-cards-container">
        {cards.map((card, index) => (
          <div className="wired-collection-list" key={index}>
            <WiredCardElement {...card} />
          </div>
        ))}
      </div>
      <style jsx>
        {`
          .wired-cards-wrapper {
            width: 100%;
            overflow: auto;
          }
          .wired-cards-container {
            display: flex;
            flex-direction: row;
            height: 20rem;
          }

          .wired-collection-list {
            margin-right: 3.125rem;
            &:first-child {
              margin-left: 3.125rem;
            }
          }

          .wired-collection-list:nth-child(5n + 1) {
            position: relative;

            &:before {
              content: '';
              position: absolute;
              bottom: 79px;
              right: 279px;
              width: 94px;
              height: 86px;
              background-image: url(${wire1});
              background-repeat: no-repeat;
              background-size: 54%;
            }

            &:after {
              content: '';
              position: absolute;
              top: 40px;
              left: 217px;
              width: 100%;
              height: 100%;
              z-index: 10;
              background-image: url(${wire2});
              background-repeat: no-repeat;
              background-size: 100% 90%;
            }
          }

          .wired-collection-list:nth-child(5n + 2) {
            position: relative;

            &:after {
              content: '';
              position: absolute;
              top: 120px;
              right: -51px;
              width: 51px;
              height: 100%;
              background-image: url(${wire3});
              background-repeat: no-repeat;
              background-size: 100%;
            }
          }

          .wired-collection-list:nth-child(5n + 3) {
            position: relative;

            &:after {
              content: '';
              position: absolute;
              top: 26px;
              left: 268px;
              width: 94%;
              height: 100%;
              z-index: 10;
              background-image: url(${wire4});
              background-repeat: no-repeat;
              background-size: 100%;
            }
          }

          .wired-collection-list:nth-child(5n + 4) {
            position: relative;

            &:after {
              content: '';
              position: absolute;
              top: 123px;
              right: -49px;
              width: 51px;
              height: 120px;
              background-image: url(${wire5});
              background-repeat: no-repeat;
            }
          }
        `}
      </style>
    </div>
  )
}
