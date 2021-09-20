import { Locale } from 'contentful'
import {
  IHeaderNavigation as IContentfulHeaderNavigation,
  IHeaderNavigationLink as IContentfulHeaderNavigationLink,
  IHeaderNavigationLinkBadge as IContentfulHeaderNavigationLinkBadge,
  IHeaderNavigationMenu as IContentfulHeaderNavigationMenu,
  IHeaderNavigationMenuItem as IContentfulHeaderNavigationMenuItem,
  IHeaderNavigationMenuSection as IContentfulHeaderNavigationMenuSection,
  IHeaderNavigationSpotlight as IContentfulHeaderNavigationSpotlight,
  ISignInLink as IContentfulSignInLink,
} from 'marketing-site/@types/generated/contentful'
import buildPath from 'marketing-site/lib/buildPath'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import CurrentLocaleContext from 'marketing-site/src/components/context/CurrentLocaleContext'
import {
  HeaderNavigation,
  IHeaderNavigationLink,
  IHeaderNavigationLinkBadge,
  IHeaderNavigationMenu,
  IHeaderNavigationMenuItem,
  IHeaderNavigationMenuSection,
  IHeaderNavigationSpotlight,
  IProps as IHeaderNavigation,
  ISignInLink,
  ItemIcon,
} from 'marketing-site/src/library/components/HeaderNavigation'
import { transformImage } from 'marketing-site/src/transformers/elements/ContentfulImage'
import React, { useContext } from 'react'

export const ContentfulHeaderNavigation = (headerNavigation: IContentfulHeaderNavigation) => {
  const currentLocale = useContext(CurrentLocaleContext)
  return (
    <EntryMarker entry={headerNavigation}>
      {() => <HeaderNavigation {...transformHeaderNavigation(headerNavigation, currentLocale)} />}
    </EntryMarker>
  )
}

// Map keys are all the strings allowed in the icon field of IContentfulHeaderNavigationMenuItem
const ContentfulIconMap = new Map<string, ItemIcon>([
  ['Use Cases - Support', ItemIcon.UseCasesSupport],
  ['Use Cases - Marketing', ItemIcon.UseCasesMarketing],
  ['Use Cases - Engagement', ItemIcon.UseCasesEngagement],
  ['Products - Messenger', ItemIcon.ProductsMessenger],
  ['Products - Bots', ItemIcon.ProductsBots],
  ['Products - Reports', ItemIcon.ProductsReports],
  ['Products - Series', ItemIcon.ProductsSeries],
  ['Products - Tours', ItemIcon.ProductsTours],
  ['Products - Messenger', ItemIcon.ProductsMessenger],
  ['Products - Notifications', ItemIcon.ProductsNotifications],
  ['Products - Contacts', ItemIcon.ProductsContacts],
  ['Products - User', ItemIcon.ProductsUser],
  ['Products - Articles', ItemIcon.ProductsArticles],
  ['Products - At Sign', ItemIcon.ProductsAtSign],
  ['Products - Inbox', ItemIcon.ProductsInbox],
  ['Products - Apps', ItemIcon.ProductsApps],
  ['Products - Outbound', ItemIcon.ProductsOutbound],
  ['Controls - Play', ItemIcon.ControlsPlay],
  ['Sparkle', ItemIcon.Sparkle],
])

function transformHeaderNavigation(
  { fields }: IContentfulHeaderNavigation,
  locale: Locale,
): IHeaderNavigation {
  return {
    ...fields,
    navigationElements: (fields.navigationElements || []).map((navigationElement) =>
      transformHeaderNavigationElement(navigationElement, locale),
    ),
    signInLink: fields.signInLink && transformSigninLink(fields.signInLink, locale),
  }
}

const transformSigninLink = ({ fields }: IContentfulSignInLink, locale: Locale): ISignInLink => {
  return {
    ...fields,
    url: localizeUrl(fields.url, locale),
  }
}

function isHeaderNavigationMenu(
  navigationElement: IContentfulHeaderNavigationMenu | IContentfulHeaderNavigationLink,
): navigationElement is IContentfulHeaderNavigationMenu {
  return navigationElement.sys.contentType.sys.id === 'headerNavigationMenu'
}

const transformHeaderNavigationElement = (
  navigationElement: IContentfulHeaderNavigationMenu | IContentfulHeaderNavigationLink,
  locale: Locale,
) => {
  if (isHeaderNavigationMenu(navigationElement)) {
    return transformHeaderNavigationMenu(navigationElement, locale)
  } else {
    return transformHeaderNavigationLink(navigationElement, locale)
  }
}

const transformHeaderNavigationMenu = (
  { fields }: IContentfulHeaderNavigationMenu,
  locale: Locale,
): IHeaderNavigationMenu => {
  return {
    ...fields,
    sections: fields.sections.map((section) => {
      if (isHeaderNavigationSection(section)) {
        return transformHeaderNavigationMenuSection(section, locale)
      } else {
        return transformHeaderNavigationSpotlight(section, locale)
      }
    }),
  }
}

const transformHeaderNavigationMenuSection = (
  { fields }: IContentfulHeaderNavigationMenuSection,
  locale: Locale,
): IHeaderNavigationMenuSection => {
  return {
    ...fields,
    items: fields.items.map((item) => transformHeaderNavigationMenuItem(item, locale)),
    itemsSecondColumn:
      fields.itemsSecondColumn &&
      fields.itemsSecondColumn.map((item) => transformHeaderNavigationMenuItem(item, locale)),
  }
}

const transformHeaderNavigationMenuItem = (
  { fields }: IContentfulHeaderNavigationMenuItem,
  locale: Locale,
): IHeaderNavigationMenuItem => {
  return {
    ...fields,
    url: localizeUrl(fields.url, locale),
    icon: fields.icon ? ContentfulIconMap.get(fields.icon) : undefined,
    badge: fields.badge ? transformHeaderNavigationLinkBadge(fields.badge) : undefined,
  }
}

const transformHeaderNavigationLink = (
  { fields }: IContentfulHeaderNavigationLink,
  locale: Locale,
): IHeaderNavigationLink => {
  return {
    ...fields,
    url: localizeUrl(fields.url, locale),
  }
}

const transformHeaderNavigationLinkBadge = ({
  fields,
}: IContentfulHeaderNavigationLinkBadge): IHeaderNavigationLinkBadge => {
  return { ...fields }
}

const transformHeaderNavigationSpotlight = (
  { fields }: IContentfulHeaderNavigationSpotlight,
  locale: Locale,
): IHeaderNavigationSpotlight => ({
  ...fields,
  media: transformImage(fields.media),
  url: localizeUrl(fields.url, locale),
})

const isHeaderNavigationSection = (
  section: IContentfulHeaderNavigationMenuSection | IContentfulHeaderNavigationSpotlight,
): section is IContentfulHeaderNavigationMenuSection => {
  return section.sys.contentType.sys.id === 'headerNavigationMenuSection'
}

function localizeUrl(url: string, locale: Locale) {
  if (url.includes('://')) {
    return url
  } else {
    return buildPath({ localeCode: locale.code, pathname: url }).localized
  }
}
