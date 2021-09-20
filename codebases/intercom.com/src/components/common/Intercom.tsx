import Cookies from 'js-cookie'
import { production } from 'marketing-site/lib/env'
import {
  VBP_MAY2021_EXPERIMENT_NAME,
  VBP_MAY2021_VARIATIONS,
} from 'marketing-site/lib/optimizelyExperiments'
import { useServerPropsContext } from 'marketing-site/src/components/context/ServerPropsContext'
import React, { useEffect } from 'react'
import { IAssignedVariations, useAssignedVariations } from '../context/AssignedVariationsContext'

const DEFAULT_INTERCOM_APP_ID = production ? 'tx2p130c' : '3qmk5gyg'

const AD_ATTRIBUTES = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'keyword',
  'ad_collection',
  'ad',
  'ad_collection_identifier',
  'ad_identifier',
  'variation',
  'agn',
  'kw',
  'loc',
  'adpos',
  'creative',
  'matchtype',
  'utm_network',
  'type',
]

type Query = Record<string, string | string[] | boolean | undefined> | undefined
// wat: https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types
type Diff<T, U> = T extends U ? never : T
type Settings = Diff<Query, undefined>

function intercomSettings(
  query: Query = {},
  appId: string = DEFAULT_INTERCOM_APP_ID,
  assignedVariations: IAssignedVariations,
  hideMessenger = false,
) {
  const settings: Settings = {
    app_id: appId, // eslint-disable-line @typescript-eslint/camelcase
  }

  if (query.language) {
    settings.language_override = query.language // eslint-disable-line @typescript-eslint/camelcase
  }

  if (hideMessenger) {
    settings.hide_default_launcher = true // eslint-disable-line @typescript-eslint/camelcase
  }

  // Add any ad attributes to intercom settings
  Object.keys(query).reduce((result: Settings, key) => {
    if (AD_ATTRIBUTES.includes(key)) {
      result[key] = query[key]
    }
    return result
  }, settings)

  const vbpFeb2021VariationKey = assignedVariations[VBP_MAY2021_EXPERIMENT_NAME]?.variationKey
  const pricingModelShown = VBP_MAY2021_VARIATIONS[vbpFeb2021VariationKey]
  settings['sees_vbp_feb20'] = ['control', 'variation_1'].indexOf(vbpFeb2021VariationKey) >= 0
  settings['pricing_model_shown'] = pricingModelShown

  Object.entries(assignedVariations).forEach(([experimentKey, { variationKey }]) => {
    if (variationKey) {
      settings[`experiment-${experimentKey}`] = variationKey
    }
  })

  const gtmCookieIdentifier = Cookies.get('gtm_id')
  if (gtmCookieIdentifier) {
    settings['gtm_cookie_identifier'] = gtmCookieIdentifier
  }

  return settings
}

interface IProps {
  hideMessenger?: boolean
}

const Intercom: React.FC<IProps> = function ({ hideMessenger }: IProps) {
  const assignedVariations = useAssignedVariations()
  const { query, nonce } = useServerPropsContext()
  const appId = process.env.INTERCOM_APP_ID || DEFAULT_INTERCOM_APP_ID

  useEffect(() => {
    window.Intercom('boot', intercomSettings(query, appId, assignedVariations, hideMessenger))
  }, [appId, assignedVariations, query, hideMessenger])

  return (
    <>
      <script
        nonce={nonce}
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function(){ if (window.Intercom) { return; }var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${appId}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()`,
        }}
      />
    </>
  )
}

export default Intercom
