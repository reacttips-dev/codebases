import React, { useEffect } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import { mq } from 'marketing-site/src/library/utils'
import magic1 from 'marketing-site/src/library/images/csf-page/section-1.png'
import magic2 from 'marketing-site/src/library/images/csf-page/section-2.png'
import magic3 from 'marketing-site/src/library/images/csf-page/section-3.png'
import magic4 from 'marketing-site/src/library/images/csf-page/section-4.png'
import magic5 from 'marketing-site/src/library/images/csf-page/section-5.png'
import magic6 from 'marketing-site/src/library/images/csf-page/section-6.png'
import magic7 from 'marketing-site/src/library/images/csf-page/section-7.png'

export default function CSFPage({ children }: IPageBehaviorComponentProps) {
  useEffect(() => {
    if (window.scrollY > 650) {
      document.getElementById('site-header')?.classList.add('header--fixed')
    }
  })

  return (
    <>
      {children}
      <style jsx global>
        {`
          #what-is-the-conversational-support-funnel {
            font-family: 'Five Eyes Condensed';
            font-size: 60px;
            line-height: 0.9;
          }
          #csf-first-paragraph + .rich-text__typography p {
            margin-top: 0;
            font-size: 1.4em;
            line-height: 1.4;
          }
          .section--gatedContent {
            margin-top: 0 !important;
          }
          .editorial-wrap__section--lightgray {
            padding-top: 0;
          }
          .section--featureSpotlight {
            margin-top: -50px !important;
            margin-bottom: 0 !important;
          }

          @media (${mq.tablet}) {
            header#site-header {
              background-color: #f5f5f5;
              margin-top: 0;
              padding-top: 50px;
            }
          }
          @media (${mq.desktop}) {
            .section--featureSpotlight {
              margin-top: -150px !important;
            }
            #main > div:nth-of-type(2n) .editorial-wrap__sidebar {
              background-image: url(${magic1});
              background-repeat: no-repeat;
              background-size: 30%;
              background-position: 100px 50px;
            }
            #main > div:nth-of-type(3n) .editorial-wrap__sidebar {
              background-image: url(${magic2});
              background-repeat: no-repeat;
              background-size: 45%;
              background-position: 100px 200px;
            }
            #main > div:nth-of-type(4n) .editorial-wrap__sidebar {
              background-image: url(${magic3});
              background-repeat: no-repeat;
              background-size: 30%;
              background-position: 150px 30px;
            }
            #main > div:nth-of-type(5n) .editorial-wrap__sidebar {
              background-image: url(${magic6});
              background-repeat: no-repeat;
              background-size: 50%;
              background-position: 150px 0px;
            }
            #main > div:nth-of-type(6n) .editorial-wrap__sidebar {
              background-image: url(${magic5});
              background-repeat: no-repeat;
              background-size: 45%;
              background-position: 150px 50px;
            }
            #main > div:nth-of-type(7n) .editorial-wrap__sidebar {
              background-image: url(${magic4});
              background-repeat: no-repeat;
              background-size: 40%;
              background-position: 150px 60px;
            }
            #main > div:nth-of-type(8n) .editorial-wrap__sidebar {
              background-image: url(${magic7});
              background-repeat: no-repeat;
              background-size: 60%;
              background-position: 130px 50px;
            }
          }

          @media (min-width: 1290px) {
            header#site-header {
              background-color: rgba(255, 255, 255, 0);
              transition: background-color 500ms;
            }
            #main {
              overflow: visible;
            }
            #what-is-the-conversational-support-funnel {
              font-size: 80px;
            }
            .header-nav-desktop__wordmark svg path {
              fill: #fff;
              transition: fill 500ms;
              stroke: transparent;
            }
            .header-menu-bar__menu-item:nth-of-type(1) .header-menu-bar__menu-item-link {
              color: #fff;
              transition: color 500ms;
            }
            .header-menu-bar__menu-item:nth-of-type(1) .header-menu-bar__chevron path {
              stroke: #fff;
              transition: stroke 500ms;
            }
            header#site-header.header--fixed {
              background-color: rgba(255, 255, 255, 1);
            }
            header#site-header.header--fixed .header-nav-desktop__wordmark svg path {
              fill: #000;
            }
            header#site-header.header--fixed
              .header-menu-bar__menu-item:nth-of-type(1)
              .header-menu-bar__menu-item-link {
              color: #000;
            }
            header#site-header.header--fixed
              .header-menu-bar__menu-item:nth-of-type(1)
              .header-menu-bar__chevron
              path {
              stroke: #000;
            }
          }

          @media (min-width: 2400px) {
            header#site-header {
              background-color: #f5f5f5;
            }
            #main {
              overflow: hidden;
            }
            .header-nav-desktop__wordmark svg path {
              fill: #000;
            }
            .header-menu-bar__menu-item:nth-of-type(1) .header-menu-bar__menu-item-link {
              color: #000;
            }
            .header-menu-bar__menu-item:nth-of-type(1) .header-menu-bar__chevron path {
              stroke: #000;
            }
          }
        `}
      </style>
    </>
  )
}
