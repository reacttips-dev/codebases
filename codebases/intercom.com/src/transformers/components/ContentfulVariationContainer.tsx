import { CONTENT_TYPE, IVariationContainer } from 'marketing-site/@types/generated/contentful'
import { renderTransformedComponent } from 'marketing-site/lib/transformedComponents'
import { useAssignedVariations } from 'marketing-site/src/components/context/AssignedVariationsContext'
import EditingContext from 'marketing-site/src/components/context/EditingContext'
import React, { useContext, useState } from 'react'
import styles from './ContentfulVariationContainer.scss'
import { Entry } from 'contentful'

export function isVariationContainer(entry: Entry<any>): entry is IVariationContainer {
  return entry.sys.contentType.sys.id === 'variationContainer'
}

export function ContentfulVariationContainer(
  variationContainer: IVariationContainer & { children?: React.ReactNode },
) {
  const { experimentKey, variations, meta } = variationContainer.fields
  const variationIds = Object.keys(meta || {})

  const showEditorUI = useContext(EditingContext)
  const assignments = useAssignedVariations()
  const assignedVariation = assignments[experimentKey || '']
  const [visibleVariationKey, setVisibleVariationKey] = useState(assignedVariation?.variationKey)

  if (!experimentKey || !variations || !meta) {
    // TODO: error handling
    // The Contentful entry was unpublished or malformed in some way
    return null
  }

  const visibleVariationEntryId = meta[visibleVariationKey || 'control']

  if (!visibleVariationEntryId) {
    // TODO: error handling
    // Optimizely assigned us to a variation that doesn't have a mapping in Contentful
    return null
  }

  const visibleVariationEntry = variations.find((v) => v.sys.id === visibleVariationEntryId)
  if (!visibleVariationEntry || !visibleVariationEntry.fields) {
    // TODO: error handling
    // Optimizely assigned us to a variation that _does_ have a mapping in Contentful, but the
    // mapping points to an unpublished or nonexistent entry.
    return null
  }

  const transformedComponent = (
    <>
      {renderTransformedComponent(visibleVariationEntry.sys.contentType.sys.id as CONTENT_TYPE, {
        ...visibleVariationEntry,
        children: variationContainer.children,
      })}
    </>
  )

  if (showEditorUI) {
    return (
      <div className="ab-test-switcher">
        <form className="ab-test-switcher__form">
          <p className="ab-test-switcher__experiment-id">{experimentKey}</p>
          {variationIds.map((variationId) => (
            <div className="ab-test-switcher__form__field" key={variationId}>
              <input
                type="radio"
                name="shownVariant"
                onChange={(event) => setVisibleVariationKey(event.target.value)}
                value={variationId}
                id={`${experimentKey}-${variationId}`}
                checked={visibleVariationKey === variationId}
              />

              <label htmlFor={`${experimentKey}-${variationId}`}>{variationId}</label>
            </div>
          ))}
        </form>
        {transformedComponent}
        <style jsx>{styles}</style>
      </div>
    )
  }

  return transformedComponent
}
