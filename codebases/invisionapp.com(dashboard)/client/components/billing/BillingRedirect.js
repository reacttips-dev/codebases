import { navigateExternally } from '../../stores/location'

export default function BillingRedirect(props) {
  const path = props.params.splat ? `/billing${props.params.splat}` : '/billing'
  navigateExternally(path)
  return null
}
