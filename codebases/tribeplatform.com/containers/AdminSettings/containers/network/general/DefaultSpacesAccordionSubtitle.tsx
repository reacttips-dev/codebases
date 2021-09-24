import { Space } from 'tribe-api/interfaces/interface.generated'
import { Trans } from 'tribe-translation'

const getSubtitle = (spaces: Array<Space>) => {
  return spaces.reduce((acc, curr, currIndex) => {
    acc += curr.name
    const lastIndex = spaces.length - 1
    const isThereMore = lastIndex > currIndex
    const onlyOneMoreLeft = lastIndex - 1 === currIndex
    if (onlyOneMoreLeft) {
      acc += ' and '
    } else if (isThereMore) {
      acc += ', '
    }
    return acc
  }, '')
}

const DefaultSpacesAccordionSubtitle = ({
  spaces,
  isExpanded,
}: {
  isExpanded?: boolean
  spaces?: Space[] | undefined | null
}) => {
  if (Array.isArray(spaces) && !isExpanded) {
    return <>{getSubtitle(spaces)}</>
  }
  return (
    <Trans
      i18nKey="admin:authentication.social.description"
      defaults="Select which spaces you’d like to automatically add new members to."
    />
  )
}

export default DefaultSpacesAccordionSubtitle
