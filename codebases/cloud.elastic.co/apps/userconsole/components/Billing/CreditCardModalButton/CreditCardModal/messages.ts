/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { defineMessages } from 'react-intl'

/* Some fields are in snake_case below in order to match with the
 * property names in API requests. */
const messages = defineMessages({
  address1: {
    id: `credit-card-modal.form.address1`,
    defaultMessage: `Address line 1`,
  },
  address2: {
    id: `credit-card-modal.form.address2`,
    defaultMessage: `Address line 2 (optional)`,
  },
  first_name: {
    id: `credit-card-modal.form.first-name`,
    defaultMessage: `First name`,
  },
  last_name: {
    id: `credit-card-modal.form.last-name`,
    defaultMessage: `Last name`,
  },
  fullName: {
    id: `billing-details.form.full-name`,
    defaultMessage: `Full name`,
  },
  email: {
    id: `billing-details.form.email`,
    defaultMessage: `Email`,
  },
  emptyBusiness: {
    id: `billing-details.form.empty-business`,
    defaultMessage: `Select industry`,
  },
  emptyEmployees: {
    id: `billing-details.form.empty-employees`,
    defaultMessage: `Select number of employees`,
  },
  business: {
    id: `billing-details.form.business`,
    defaultMessage: `Industry`,
  },
  agriculture: {
    id: `billing-details.form.business-agriculture`,
    defaultMessage: `Agriculture`,
  },
  automotive: {
    id: `billing-details.form.business-automotive`,
    defaultMessage: `Automotive`,
  },
  education: {
    id: `billing-details.form.business-education`,
    defaultMessage: `Education/Non-profit`,
  },
  energy: {
    id: `billing-details.form.business-energy`,
    defaultMessage: `Energy & Utilities`,
  },
  financial: {
    id: `billing-details.form.business-financial`,
    defaultMessage: `Financial Services`,
  },
  food: {
    id: `billing-details.form.business-food`,
    defaultMessage: `Food & Beverage / Hospitality`,
  },
  government: {
    id: `billing-details.form.business-government`,
    defaultMessage: `Government`,
  },
  healthcare: {
    id: `billing-details.form.business-healthcare`,
    defaultMessage: `Healthcare`,
  },
  manufacturing: {
    id: `billing-details.form.business-manufacturing`,
    defaultMessage: `Manufacturing`,
  },
  media: {
    id: `billing-details.form.business-media`,
    defaultMessage: `Media & Entertainment`,
  },
  professional: {
    id: `billing-details.form.business-professionalservices`,
    defaultMessage: `Professional Services`,
  },
  retail: {
    id: `billing-details.form.business-retail`,
    defaultMessage: `Retail`,
  },
  software: {
    id: `billing-details.form.business-sofware`,
    defaultMessage: `Software & Technology`,
  },
  telecommunications: {
    id: `billing-details.form.business-telecommunications`,
    defaultMessage: `Telecommunications`,
  },
  travel: {
    id: `billing-details.form.business-travel`,
    defaultMessage: `Travel & Transportation`,
  },
  other: {
    id: `billing-details.form.business-other`,
    defaultMessage: `Other`,
  },
  employees_number: {
    id: `billing-details.form.employees-number`,
    defaultMessage: `Number of employees`,
  },
  titleDescription: {
    id: 'credit-card-modal.title-description',
    defaultMessage:
      "Once you've added your billing details you'll be able to create deployments of any size.",
  },
  creditCard: {
    id: `credit-card.modal.credit-card`,
    defaultMessage: `Credit card`,
  },
  addTitle: {
    id: 'credit-card-modal.add-title',
    defaultMessage: 'Add billing details',
  },
  editTitle: {
    id: 'credit-card-modal.edit-title',
    defaultMessage: 'Edit billing details',
  },
  zip: {
    id: 'credit-card-modal.zip',
    defaultMessage: 'ZIP or Postal Code',
  },
  city: {
    id: 'credit-card-modal.city',
    defaultMessage: 'City',
  },
  domain: {
    id: `credit-card-modal.form.domain`,
    defaultMessage: `Website`,
  },
  country: {
    id: 'credit-card-modal.country',
    defaultMessage: 'Country',
  },
  statePlaceholder: {
    id: `billing-details.form.statePlaceholder`,
    defaultMessage: `Select a country`,
  },
  optional: {
    id: `billing.form.optional`,
    defaultMessage: `(Optional)`,
  },
  company: {
    id: 'credit-card-modal.company',
    defaultMessage: 'Company or organization',
  },
  state: {
    id: 'credit-card-modal.state',
    defaultMessage: 'State / County / Province',
  },
  vat_number: {
    id: 'credit-card-modal.vat_number',
    defaultMessage: 'VAT # (optional)',
  },
  stepBillingContact: {
    id: `credit-card-modal.step-billing-contact`,
    defaultMessage: `Billing contact`,
  },
  stepBillingAddress: {
    id: `credit-card-modal.step-billing-address`,
    defaultMessage: `Billing address`,
  },
  stepPayment: {
    id: `credit-card-modal.step-payment`,
    defaultMessage: `Payment`,
  },
  submit: {
    id: `credit-card-modal.submit`,
    defaultMessage: `Save`,
  },
  nextPage: {
    id: `credit-card-modal.next-page`,
    defaultMessage: `Next`,
  },
  prevPage: {
    id: `credit-card-modal.prev-page`,
    defaultMessage: `Previous`,
  },
  cancel: {
    id: `credit-card-modal.cancel`,
    defaultMessage: `Cancel`,
  },
  countryPlaceholder: {
    id: `credit-card-modal.countryPlaceholder`,
    defaultMessage: `Select state or county`,
  },
  ccPageDescription1_Add: {
    id: `credit-card-modal.ccPageDescription1.add`,
    defaultMessage: `After entering your credit card, you will begin to be charged for usage at {usage}/hour, which is based off of your active deployment.`,
  },
  ccPageDescription1_Edit: {
    id: `credit-card-modal.ccPageDescription1.edit`,
    defaultMessage: `After updating your credit card, you will continue to be charged at {usage}, which is based off of your active deployments.`,
  },
  ccPageDescriptionTerms: {
    id: `credit-card-modal.ccPageDescriptionTerms`,
    defaultMessage: `By clicking save you are accepting the Elastic Cloud {terms}.`,
  },
  ccPageTermsOfService: {
    id: `credit-card-modal.ccPageTermsOfService`,
    defaultMessage: `Terms of Service`,
  },
  feedbackTitle: {
    id: `credit-card-modal.form.feedback-title`,
    defaultMessage: `Couldn't submit your changes`,
  },
  feedbackMissingOrInvalid: {
    id: `credit-card-modal.form.feedback-missing-or-invalid`,
    defaultMessage: `Some fields are missing or invalid: {fields}`,
  },
  feedbackUnknownRecurlyError: {
    id: `credit-card-modal.form.unknown-recurly-error`,
    defaultMessage: `There was a problem send your details to our payment processor. Please try again later, or contact {support}`,
  },
  feedbackSuccess: {
    id: `credit-card-modal.form.success`,
    defaultMessage: `Changes saved successfully`,
  },
  fieldRequired: {
    id: `credit-card-modal.field-required`,
    defaultMessage: `Required`,
  },
  feedbackDomain: {
    id: `credit-card-modal.domain.invalid`,
    defaultMessage: `The website is invalid`,
  },
  feedbackEmail: {
    id: `billing-details.feedbackemail.invalid`,
    defaultMessage: `The email is invalid`,
  },
  recommendedSubscriptionLevel: {
    id: `billing-details.recommended-subscription-level`,
    defaultMessage: `Subscription level:`,
  },
  changeSubscription: {
    id: `billing-details.change-subscription`,
    defaultMessage: `Change`,
  },
  saveSubscription: {
    id: `billing-details.save-subscription`,
    defaultMessage: `Save`,
  },
  cancelSubscription: {
    id: `billing-details.back`,
    defaultMessage: `Back`,
  },
  yourSubscriptionLevel: {
    id: `billing-details.your-subscription-level`,
    defaultMessage: `Your subscription level is:`,
  },
  changeSubscriptionButton: {
    id: `billing-details.change-subscription-button`,
    defaultMessage: `Change subscription`,
  },
  changeSubscriptionNoThanks: {
    id: `billing-details.change-subscription-cancel-button`,
    defaultMessage: `No, thanks`,
  },
  confirmSubscriptionTitle: {
    id: `billing-details.confirm-subscription.title`,
    defaultMessage: `Do you want to keep {subscriptionLevels} features?`,
  },
  confirmSubscriptionTitlePlatinum: {
    id: `billing-details.confirm-subscription.title-enterprise`,
    defaultMessage: `Are you sure?`,
  },
  confirmSubscriptionDescription: {
    id: `billing-details.confirm-subscription.description`,
    defaultMessage: `By selecting {level}, you will lose access to these features:`,
  },
  confirmSubscriptionRemoveFeatures: {
    id: `billing-details.confirm-subscription.remove-features`,
    defaultMessage: `You will be prompted to remove some features if you continue.`,
  },
  confirmSubscription: {
    id: `billing-details.confirm-subscription`,
    defaultMessage: `Yes, update subscription`,
  },
  noThanks: {
    id: `billing-details.no-thanks`,
    defaultMessage: `No thanks`,
  },
  machineLearning: {
    id: `platinum-features.machine-learning`,
    defaultMessage: `Machine learning with anomaly detection`,
  },
  customPlugins: {
    id: `gold-features.custom-plugins`,
    defaultMessage: `Custom plugins`,
  },
  businessHoursSupport: {
    id: `gold-features.business-hours-support`,
    defaultMessage: `Business hours only support for up to 6 support contacts`,
  },
  graphExplortation: {
    id: `platinum-features.graph-exploration`,
    defaultMessage: `Graph exploration and analytics`,
  },
  superSupport: {
    id: `platinum-features.super-support`,
    defaultMessage: `24/7/365 support for up to 8 support contacts`,
  },
  perHour: {
    id: `billing-details.per-hour`,
    defaultMessage: `/hour`,
  },
})

export const businessOptions = (formatMessage) => [
  { value: ``, text: formatMessage(messages.emptyBusiness) },
  { value: `Agriculture`, text: formatMessage(messages.agriculture) },
  { value: `Automotive`, text: formatMessage(messages.automotive) },
  { value: `EducationNonProfit`, text: formatMessage(messages.education) },
  { value: `EnergyUtilities`, text: formatMessage(messages.energy) },
  { value: `Financial`, text: formatMessage(messages.financial) },
  { value: `Hospitality`, text: formatMessage(messages.food) },
  { value: `Government`, text: formatMessage(messages.government) },
  { value: `Healthcare`, text: formatMessage(messages.healthcare) },
  { value: `Manufacturing`, text: formatMessage(messages.manufacturing) },
  { value: `Media`, text: formatMessage(messages.media) },
  { value: `ProfessionalServices`, text: formatMessage(messages.professional) },
  { value: `Retail`, text: formatMessage(messages.retail) },
  { value: `SoftwareTechnology`, text: formatMessage(messages.software) },
  { value: `Telecommunications`, text: formatMessage(messages.telecommunications) },
  { value: `TravelTransportation`, text: formatMessage(messages.travel) },
  { value: `Other`, text: formatMessage(messages.other) },
]

export const employeesOptions = (formatMessage) => [
  { value: ``, text: formatMessage(messages.emptyEmployees) },
  { value: `1-50`, text: `1-50` },
  { value: `51-100`, text: `51-100` },
  { value: `101-200`, text: `101-200` },
  { value: `201-500`, text: `201-500` },
  { value: `501-1000`, text: `501-1000` },
  { value: `1001-2000`, text: `1001-2000` },
  { value: `2001-3000`, text: `2001-3000` },
  { value: `3001-5000`, text: `3001-5000` },
  { value: `5001-7500`, text: `5001-7500` },
  { value: `7501-10000`, text: `7501-10000` },
  { value: `10000`, text: `10000+` },
]

export default messages
