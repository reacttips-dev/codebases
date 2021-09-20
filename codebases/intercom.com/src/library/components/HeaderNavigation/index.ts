export { HeaderNavigation } from './component'
import {
  ICtaButton as IContentfulCtaButton,
  ICtaLink as IContentfulCtaLink,
  ISignupCta as IContentfulSignupCta,
  IVariationContainer as IContentfulVariationContainer,
} from 'marketing-site/@types/generated/contentful'
import { IProps as IImage } from 'marketing-site/src/library/elements/Image'

export type IHeaderNavigationElement = IHeaderNavigationLink | IHeaderNavigationMenu

// these values need to be mapped to an icon file in headerNavigationMenuItem
export enum ItemIcon {
  UseCasesSupport,
  UseCasesMarketing,
  UseCasesEngagement,
  ProductsBots,
  ProductsReports,
  ProductsSeries,
  ProductsTours,
  ProductsMessenger,
  ProductsNotifications,
  ProductsContacts,
  ProductsUser,
  ProductsArticles,
  ProductsAtSign,
  ProductsInbox,
  ProductsApps,
  ProductsOutbound,
  ControlsPlay,
  Sparkle,
}

interface IMuteableComponent {
  isAnyComponentActive?: boolean
  setIsActive?: (isActive: boolean) => void
}

export interface IProps {
  navigationElements: IHeaderNavigationElement[]
  navigationElementsAlignRight: boolean
  cta?:
    | IContentfulCtaButton
    | IContentfulCtaLink
    | IContentfulSignupCta
    | IContentfulVariationContainer
  isTheLogoClickable: boolean
  signInLink?: ISignInLink
}

export interface IHeaderNavigationMenu {
  title: string
  index?: number
  sections: (IHeaderNavigationMenuSection | IHeaderNavigationSpotlight)[]
}

export interface IHeaderNavigationMenuBar extends IMuteableComponent {
  navigationElements: IHeaderNavigationElement[]
}

export interface IHeaderNavigationLink {
  title: string
  url: string
}

export interface IHeaderNavigationMenuItem {
  title: string
  subtitle?: string
  url: string
  badge?: IHeaderNavigationLinkBadge
  icon?: ItemIcon
}

export interface IHeaderNavigationMenuSection {
  title: string
  items: IHeaderNavigationMenuItem[]
  itemsSecondColumn?: IHeaderNavigationMenuItem[]
}

export interface IHeaderNavigationSpotlight {
  title: string
  description: string
  media: IImage
  url: string
  linkText: string
}

export interface IHeaderNavigationLinkBadge {
  text: string
  textColor?: string
  color?: string
}

export interface ISignInLink extends IMuteableComponent {
  title: string
  url: string
  additionalContent?: string
}

export interface IIcon {
  icon: ItemIcon
}

export function getUrlWithPageviewParam(address: string) {
  /*
   * TEMP_URL represents the base URL to use in cases where address is a
   * relative URL (this is required by the URL constructor). Before returning,
   * we remove TEMP_URL using the replace() string method.
   */
  const TEMP_URL = 'https://www.relative.temp'

  const url = new URL(address, TEMP_URL)
  url.searchParams.append('on_pageview_event', 'nav')

  return url.toString().replace(TEMP_URL, '')
}

export function isHeaderNavigationLink(
  item: IHeaderNavigationMenu | IHeaderNavigationLink,
): item is IHeaderNavigationLink {
  return item && !!(item as IHeaderNavigationLink).url
}

export function isHeaderNavigationSection(
  item: IHeaderNavigationMenuSection | IHeaderNavigationSpotlight,
): item is IHeaderNavigationMenuSection {
  return item && !!(item as IHeaderNavigationMenuSection).items
}

function isItemWide(item: IHeaderNavigationMenuItem): boolean {
  return !!item.subtitle
}

export function isSectionWide(section: IHeaderNavigationMenuSection): boolean {
  return (
    section.items.some((item) => isItemWide(item)) ||
    (section.itemsSecondColumn !== undefined &&
      section.itemsSecondColumn.some((item) => isItemWide(item)))
  )
}
