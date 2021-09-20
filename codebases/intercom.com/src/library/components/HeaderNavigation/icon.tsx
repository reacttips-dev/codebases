import React from 'react'
import { IIcon, ItemIcon } from './index'

// Import icons
import useCasesSupport from '../../images/icons/use-cases--wheel.svg'
import useCasesEngagement from '../../images/icons/use-cases--target-shooting.svg'
import useCasesMarketing from '../../images/icons/use-cases--magnet.svg'
import productsApps from '../../images/icons/product-apps.svg'
import productsArticles from '../../images/icons/product--articles.svg'
import productsAtSign from '../../images/icons/product--at-sign.svg'
import productsNotifications from '../../images/icons/product--bell.svg'
import productsBots from '../../images/icons/product--bots.svg'
import productsContacts from '../../images/icons/product--contacts.svg'
import productsInbox from '../../images/icons/product--inbox.svg'
import productsMessenger from '../../images/icons/product--messenger.svg'
import productsOutbound from '../../images/icons/product--outbound.svg'
import productsReports from '../../images/icons/product--reports.svg'
import productsSeries from '../../images/icons/product--series.svg'
import productsTours from '../../images/icons/product--tours.svg'
import productsUser from '../../images/icons/product--user.svg'
import controlsPlay from '../../images/icons/controls--play.svg'
import sparkle from '../../images/icons/sparkle-icon.svg'

// Map imported icon svg's to the enum keys
const mapIcon = (icon: ItemIcon) => {
  switch (icon) {
    case ItemIcon.UseCasesSupport:
      return useCasesSupport
    case ItemIcon.UseCasesEngagement:
      return useCasesEngagement
    case ItemIcon.UseCasesMarketing:
      return useCasesMarketing
    case ItemIcon.ProductsApps:
      return productsApps
    case ItemIcon.ProductsArticles:
      return productsArticles
    case ItemIcon.ProductsAtSign:
      return productsAtSign
    case ItemIcon.ProductsNotifications:
      return productsNotifications
    case ItemIcon.ProductsBots:
      return productsBots
    case ItemIcon.ProductsContacts:
      return productsContacts
    case ItemIcon.ProductsInbox:
      return productsInbox
    case ItemIcon.ProductsMessenger:
      return productsMessenger
    case ItemIcon.ProductsOutbound:
      return productsOutbound
    case ItemIcon.ProductsReports:
      return productsReports
    case ItemIcon.ProductsSeries:
      return productsSeries
    case ItemIcon.ProductsTours:
      return productsTours
    case ItemIcon.ProductsUser:
      return productsUser
    case ItemIcon.ControlsPlay:
      return controlsPlay
    case ItemIcon.Sparkle:
      return sparkle
    default:
      return
  }
}

export function Icon({ icon }: IIcon) {
  return (
    <>
      <div className="icon"></div>
      <style jsx>{`
        .icon {
          min-width: 32px;
          max-width: 32px;
          height: 32px;
          align-self: center;
          background-image: url(${mapIcon(icon)});
        }
      `}</style>
    </>
  )
}
