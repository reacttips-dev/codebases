import React from "react"
import HubspotForm from "./HubspotForm"
import MarketoForm from "./MarketoForm/"

export default function MarketingForm({ form, wrapperCss }) {
  if (!form) return null

  if (form.marketoFormCampaignObject) {
    const { formId } = form.marketoFormCampaignObject
    const messageOnSubmit = form.thankYouMessage?.childMarkdownRemark?.html
    return (
      <MarketoForm
        formId={formId}
        messageOnSubmit={messageOnSubmit}
        wrapperCss={wrapperCss}
      />
    )
  } else {
    return (
      <HubspotForm
        {...form}
        wrapperCss={wrapperCss}
        css={{
          "& .hs-form": {
            padding: 0,
          },
        }}
      />
    )
  }
}
