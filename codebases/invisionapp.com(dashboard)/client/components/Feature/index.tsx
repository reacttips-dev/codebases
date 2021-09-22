import { useFeatureFlags } from '../../hooks/useFeatureFlags'

type FeatureProps = {
  flag: string
  renderActive?: any
  renderInactive?: any
  renderDefault?: any
}

const renderDefault = (props: FeatureProps) =>
  props.renderDefault === undefined ? null : props.renderDefault

const renderInactive = (props: FeatureProps) =>
  props.renderInactive === undefined ? renderDefault(props) : props.renderInactive

const Feature = (props: FeatureProps) => {
  const flags = useFeatureFlags()

  switch (Boolean(flags[props.flag])) {
    case true:
      return props.renderActive
    case false:
      return renderInactive(props)
    default:
      return renderDefault(props)
  }
}

export default Feature
