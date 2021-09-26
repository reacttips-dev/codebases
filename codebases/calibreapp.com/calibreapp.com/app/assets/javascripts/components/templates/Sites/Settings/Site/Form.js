import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Section, Lockup } from '../../../../Layout'
import { FieldSet, FieldGroup, Input, FieldHint } from '../../../../Forms'
import Button from '../../../../Button'

const SiteSettings = ({ loading, onUpdate, saving, ...initialAttributes }) => {
  const formRef = useRef()
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState(initialAttributes)
  const { name, canonicalUrl } = attributes

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
    setModified(true)
  }

  useEffect(() => {
    setAttributes(initialAttributes)
  }, [loading])

  useEffect(() => {
    setModified(saving)
  }, [saving])

  const handleSubmit = event => {
    event.preventDefault()
    onUpdate(attributes)
  }

  return (
    <Section>
      <form onSubmit={handleSubmit} ref={formRef} data-qa="siteForm">
        <Lockup id="site.settings.general" mb={0} />
        <FieldSet mb={0}>
          <FieldGroup label="Site name" span={2}>
            <Input
              loading={loading}
              name="site_name"
              data-testid="site-name"
              defaultValue={name}
              required={true}
              maxLength={120}
              onChange={name => setAttribute({ name })}
              placeholder="Your site name"
            />
          </FieldGroup>
        </FieldSet>
        <FieldSet mb={0}>
          <FieldGroup label="Canonical URL" span={2}>
            <Input
              loading={loading}
              name="site_canonical_url"
              data-testid="site-canonical-url"
              defaultValue={canonicalUrl}
              required={true}
              maxLength={256}
              onChange={canonicalUrl => setAttribute({ canonicalUrl })}
              placeholder="https://example.com"
            />
            <FieldHint mt={2}>
              <FormattedMessage id="site.settings.general.canonicalUrlDescription" />
            </FieldHint>
          </FieldGroup>
        </FieldSet>
        <Button
          data-testid="site-submit"
          disabled={
            !modified ||
            saving ||
            !name ||
            !name.length ||
            !canonicalUrl ||
            !canonicalUrl.length
          }
          loading={saving}
          type="submit"
        >
          <FormattedMessage id="site.actions.update" />
        </Button>
      </form>
    </Section>
  )
}

export default SiteSettings
