import React from 'react'
import {
  IProps as IAddonPricingModal,
  IKeyValuePair,
  AddOnPricingModal,
} from 'marketing-site/src/library/components/AddonPricingModal'
import {
  IAddOnPricingModal as IContentfulAddonPricingModal,
  IKeyValuePair as IContentfulKeyValuePair,
} from 'marketing-site/@types/generated/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export const ContentfulAddOnPricingModal = (addonPricingModal: IContentfulAddonPricingModal) => (
  <AddOnPricingModal {...transformAddonPricingModal(addonPricingModal)} />
)

export function transformKeyValuePair({ fields }: IContentfulKeyValuePair): IKeyValuePair {
  return {
    ...fields,
    key: documentToHtmlString(fields.key),
    value: fields.value && documentToHtmlString(fields.value),
  }
}

export function transformAddonPricingModal({
  fields,
}: IContentfulAddonPricingModal): IAddonPricingModal {
  return {
    ...fields,
    description: fields.description && documentToHtmlString(fields.description),
    subDescription: fields.subDescription && documentToHtmlString(fields.subDescription),
    tableData: fields.tableData.map((dataRow) => transformKeyValuePair(dataRow)),
    modalOpen: false,
    closeModal: () => {},
  }
}
