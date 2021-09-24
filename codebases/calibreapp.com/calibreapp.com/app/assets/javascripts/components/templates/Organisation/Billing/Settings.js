import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Section, Lockup } from '../../../Layout'
import Button from '../../../Button'
import { FieldSet } from '../../../Forms'
import { LoadingButton } from '../../../Loading'

import Company from './PaymentForm/Company'
import Email from './PaymentForm/Email'
import TaxRegion from './PaymentForm/TaxRegion'
import TaxId from './PaymentForm/TaxId'
import AdditionalInfo from './PaymentForm/AdditionalInfo'

const Settings = ({
  onUpdate,
  taxIdType,
  taxId,
  invoiceExtras,
  company,
  email,
  loading,
  saving
}) => {
  const [modified, setModified] = useState(false)
  const [billingDetails, setBillingDetails] = useState({})

  const handleUpdate = updatedBillingDetails => {
    setModified(true)
    setBillingDetails({ ...billingDetails, ...updatedBillingDetails })
  }

  useEffect(() => {
    const billingDetails = {
      company: company || '',
      email: email || '',
      taxId: taxId || '',
      taxIdType: taxIdType || '',
      invoiceExtras: invoiceExtras || ''
    }
    setBillingDetails(billingDetails)
  }, [loading])

  useEffect(() => {
    setModified(saving)
  }, [saving])

  const handleSubmit = event => {
    event.preventDefault()
    onUpdate(billingDetails)
  }

  return (
    <Section>
      <Lockup id="organisations.settings" />
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <Company
            mb={0}
            loading={loading}
            hint="Invoices will be made out to this name."
            value={billingDetails.company}
            onChange={company => handleUpdate({ company })}
          />

          <Email
            mb={0}
            loading={loading}
            hint="Payment receipts will be sent to this address."
            value={billingDetails.email}
            onChange={email => handleUpdate({ email })}
          />
        </FieldSet>

        <FieldSet>
          <TaxRegion
            mb={4}
            hint="Your tax residence determines your tax rates."
            value={billingDetails.taxIdType}
            onChange={taxIdType => handleUpdate({ taxIdType })}
            loading={loading}
          />

          <TaxId
            mb={4}
            hint="Tax identification number will appear on all receipts."
            value={billingDetails.taxId}
            onChange={taxId => handleUpdate({ taxId })}
            loading={loading}
          />

          <AdditionalInfo
            mb={0}
            hint="This will appear on all receipts."
            value={billingDetails.invoiceExtras}
            onChange={invoiceExtras => handleUpdate({ invoiceExtras })}
            loading={loading}
          />
        </FieldSet>
        {loading ? (
          <LoadingButton />
        ) : (
          <Button
            loading={saving}
            variant="primary"
            type="submit"
            disabled={!modified || saving}
          >
            <FormattedMessage id="organisations.settings.actions.save" />
          </Button>
        )}
      </form>
    </Section>
  )
}

export default Settings
