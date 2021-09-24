import React from 'react'

import { FieldGroup, Select } from '../../../../Forms'

const STRIPE_TAX_ID_TYPES = [
  { label: 'Australia', value: 'au_abn' },
  { label: 'Canada (BN)', value: 'ca_bn' },
  { label: 'Canada (QST)', value: 'ca_qst' },
  { label: 'Spain', value: 'es_cif' },
  { label: 'Austria', value: 'eu_vat:at' },
  { label: 'Belgium', value: 'eu_vat:be' },
  { label: 'Bulgaria', value: 'eu_vat:bg' },
  { label: 'Cyprus', value: 'eu_vat:cy' },
  { label: 'Czech', value: 'eu_vat:cz' },
  { label: 'Germany', value: 'eu_vat:de' },
  { label: 'Denmark', value: 'eu_vat:dk' },
  { label: 'Estonia', value: 'eu_vat:ee' },
  { label: 'Spain', value: 'eu_vat:es' },
  { label: 'Finland', value: 'eu_vat:fi' },
  { label: 'France', value: 'eu_vat:fr' },
  { label: 'United Kingdom', value: 'eu_vat:gb' },
  { label: 'Greece', value: 'eu_vat:gr' },
  { label: 'Croatia', value: 'eu_vat:hr' },
  { label: 'Hungary', value: 'eu_vat:hu' },
  { label: 'Ireland', value: 'eu_vat:ie' },
  { label: 'Italy', value: 'eu_vat:it' },
  { label: 'Lithuania', value: 'eu_vat:lt' },
  { label: 'Luxembourg', value: 'eu_vat:lu' },
  { label: 'Latvia', value: 'eu_vat:lv' },
  { label: 'Malta', value: 'eu_vat:mt' },
  { label: 'Netherlands', value: 'eu_vat:nl' },
  { label: 'Poland', value: 'eu_vat:pl' },
  { label: 'Portugal', value: 'eu_vat:pt' },
  { label: 'Romania', value: 'eu_vat:ro' },
  { label: 'Sweden', value: 'eu_vat:se' },
  { label: 'Slovenia', value: 'eu_vat:si' },
  { label: 'Slovakia', value: 'eu_vat:sk' },
  { label: 'Hong Kong', value: 'hk_br' },
  { label: 'India', value: 'in_gst' },
  { label: 'Japan', value: 'jp_cn' },
  { label: 'South Korea', value: 'kr_brn' },
  { label: 'Liechtenstein', value: 'li_uid' },
  { label: 'Mexico', value: 'mx_rfc' },
  { label: 'Malaysia', value: 'my_itn' },
  { label: 'Norway', value: 'no_vat' },
  { label: 'New Zealand', value: 'nz_gst' },
  { label: 'Russia', value: 'ru_inn' },
  { label: 'Singapore', value: 'sg_uen' },
  { label: 'Thailand', value: 'th_vat' },
  { label: 'Taiwan', value: 'tw_vat' },
  { label: 'United States', value: 'us_ein' },
  { label: 'South Africa', value: 'za_vat' }
]

const TaxRegion = ({ value, onChange, loading, hint, ...props }) => (
  <FieldGroup label="Tax Region" hint={hint} {...props}>
    <Select
      name="tax_id_type"
      options={[{ label: 'Select region', value: '' }, ...STRIPE_TAX_ID_TYPES]}
      value={value}
      onChange={onChange}
      loading={loading}
    />
  </FieldGroup>
)

TaxRegion.defaultProps = {
  mb: 3
}

export default TaxRegion
