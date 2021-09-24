import { ReactNode } from 'react'

import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ApolloQueryResult } from '@apollo/client/core'
import { ApolloError } from '@apollo/client/errors'
import { NextComponentType, NextPageContext } from 'next'
import { AppContext } from 'next/app'
import { WithContext } from 'schema-dts'

import {
  CheckInvitationLinkValidityQuery,
  CheckMemberInvitationValidityQuery,
} from 'tribe-api'
import { AuthToken, Media, Network } from 'tribe-api/interfaces'
import { ApolloApis } from 'tribe-api/permissions'
import { TribeOptimizelyProviderProps } from 'tribe-feature-flag'

export type PageWithLayout = NextComponentType<
  NextPageContext,
  unknown,
  Record<string, unknown>
>

export type MetaTag =
  | {
      property: string
      content: string | null
    }
  | {
      name: string
      content: string | null
    }

export type SeoPageProps = {
  title: string
  description?: string
  icon?: Media | null
  appendNetworkName?: boolean
  additionalMeta?: MetaTag[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonld?: WithContext<any>
}

export enum SidebarKind {
  admin = 'admin',
  adminBranding = 'adminBranding',
  adminTheme = 'adminTheme',
  member = 'member',
  networkApps = 'networkApps',
  networkTopNavigationSettings = 'networkTopNavigationSettings',
  networkWhiteLabelSettings = 'networkWhiteLabelSettings',
  spaceApps = 'spaceApps',
  spaces = 'spaces',
  supportPanel = 'supportPanel',
}

export type AppPageProps = {
  apolloClient?: ApolloClient<NormalizedCacheObject> | null
  apolloState?: NormalizedCacheObject
  authToken?: AuthToken | null
  error?: {
    message: string
    code: number
  } | null
  intercomUserHash?: string | null
  optimizelyDatafile?: TribeOptimizelyProviderProps['datafile'] | null
  origin?: string
  props?: {
    apolloState?: NormalizedCacheObject
    invitationLinkData?:
      | CheckInvitationLinkValidityQuery['checkInvitationLinkValidity']
      | null
    invitationTokenData?:
      | CheckMemberInvitationValidityQuery['checkMemberInvitationValidity']
      | null
    invitationTokenError?: string
    namespacesRequired?: string[]
    statusCode?: number
    seo?: SeoPageProps | null
  }
  seo?: SeoPageProps
  sidebarKind?: keyof typeof SidebarKind
  userAgent?: string
  navbar?: boolean
}

export interface NextPageContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject> | null
  apolloState: NormalizedCacheObject
  ctx: NextPageContextApp
  mustUseSupportToken?: boolean
  authToken?: AuthToken | null
  network?: Network | null
}

export type NextPageContextApp = NextPageContextWithApollo & AppContext

export interface QueryResult<TData = any> {
  data: TData | undefined
  error?: ApolloError
  loading: boolean
  isInitialLoading: boolean
}

export interface PaginatedQueryResult<TData = any> extends QueryResult<TData> {
  hasNextPage: boolean
  loadMore: () => void | Promise<ApolloQueryResult<TData>> | unknown
  totalCount: number | undefined
  isEmpty: boolean | undefined
}

export type AuthServerSideProps = {
  permissionScopes?: ApolloApis[]
  ssr?: {
    Component: ReactNode
  }
}

export type GetServerSideFuncResult = {
  props?: Partial<AppPageProps['props']>
  seo?: SeoPageProps
  error?: string
  redirect?: {
    destination?: string
    permanent?: boolean
  }
}
