import React, { useEffect } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import { mq } from 'marketing-site/src/library/utils'
import texture1 from 'marketing-site/src/library/images/mobile-carousels/texture-1.png'
import texture2 from 'marketing-site/src/library/images/mobile-carousels/texture-2.png'
import texture3 from 'marketing-site/src/library/images/mobile-carousels/texture-3.png'
import texture4 from 'marketing-site/src/library/images/mobile-carousels/texture-4.png'
import texture5 from 'marketing-site/src/library/images/mobile-carousels/texture-5.png'
import texture6 from 'marketing-site/src/library/images/mobile-carousels/texture-6.png'
import heroImg from 'marketing-site/src/library/images/mobile-carousels/hero.png'

export default function MobileCarousels({ children }: IPageBehaviorComponentProps) {
  useEffect(() => {
    const heroText = document.querySelector('.section--heroWithCta .headline span')
    if (heroText?.innerHTML && heroText?.textContent) {
      heroText.innerHTML = heroText.textContent.replace(
        'best features',
        '<span class="headline--best-features">best <span class="headline--features">features</span></span>',
      )
    }
  })
  return (
    <>
      {children}
      <style jsx global>
        {`
          #layout-wrapper {
            overflow: hidden;
          }

          main {
            overflow: visible;
          }

          .section--carousel h2 {
            max-width: 500px;
          }

          .section--heroWithCta {
            padding-bottom: 120px;
            position: relative;

            &:after {
              content: '';
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              margin-top: -150px;
              z-index: -1;
              height: 900px;
              background: url(${heroImg}) no-repeat;
              background-position: top center;
              background-size: 1670px 900px;
            }
          }

          .hero-wrapper,
          .feature-spotlight--white {
            background: none;
          }

          .headline--features {
            position: relative;

            &:after {
              content: '';
              position: absolute;
              top: 5px;
              bottom: -6px;
              left: -10px;
              right: -10px;
              z-index: -1;
              background: url(${texture4}) no-repeat;
              background-position: top center;
              background-size: 100% 100%;
            }
          }

          .section--statistics {
            position: relative;

            &:before,
            &:after {
              content: '';
              position: absolute;
              top: 100%;
              z-index: -1;
              background-repeat: no-repeat;
              background-position: top center;
            }

            &:before {
              left: 0;
              right: 0;
              height: 713px;
              margin-top: -150px;
              background-image: url(${texture6});
              background-size: 100% 713px;
            }

            &:after {
              left: -10px;
              right: -10px;
              height: 2135px;
              margin-top: 1300px;
              background-image: url(${texture5});
              background-size: 645px 2135px;
            }
          }

          .statistics.statistics:after {
            z-index: 1;
          }

          @media (${mq.tablet}) {
            .headline--features:after {
              display: none;
            }

            .headline--best-features {
              position: relative;
              white-space: nowrap;

              &:after {
                content: '';
                position: absolute;
                top: -20px;
                bottom: -20px;
                left: -13px;
                right: -30px;
                z-index: -1;
                background: url(${texture3}) no-repeat;
                background-position: top center;
                background-size: 100% 100%;
              }
            }

            .section--statistics {
              &:before,
              &:after {
                background-position: top center;
                left: 0;
                right: 0;
              }

              &:before {
                margin-top: -100px;
                height: 1521px;
                background-image: url(${texture1});
                background-size: 1582px 1521px;
              }

              &:after {
                height: 1510px;
                margin-top: 1600px;
                background-image: url(${texture2});
                background-size: 1579px 1510px;
              }
            }
          }

          @media (${mq.desktop}) {
            main {
              padding-top: 40px;
            }

            .section--cardList .card-wrapper {
              margin-left: 20px;
              margin-right: 20px;
            }

            .headline--best-features {
              &:after {
                top: -30px;
                bottom: -40px;
                left: -20px;
                right: -40px;
              }
            }

            .section--carousel.section--carousel {
              margin-top: 170px;
            }

            .section--statistics {
              margin-bottom: 200px;
            }
          }

          @media (min-width: 1200px) {
            .section--statistics:after {
              margin-top: 1700px;
            }
          }

          @media (${mq.desktopLg}) {
            .section--carousel h2 {
              max-width: 700px;
            }

            .section--heroWithCta {
              padding-bottom: 80px;
            }
          }
        `}
      </style>
    </>
  )
}
