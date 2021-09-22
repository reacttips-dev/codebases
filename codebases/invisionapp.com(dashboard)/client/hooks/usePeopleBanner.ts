import { useDispatch } from 'react-redux'
import { showBanner, hideBanner as hide, BannerStatus } from '../stores/banner'

const usePeopleBanner = () => {
  const dispatch = useDispatch()
  const notify = (configs: { message: string; status: BannerStatus }) =>
    dispatch(showBanner(configs))

  const alertPeopleBanner = (message: string) => notify({ message, status: 'danger' })
  const hidePeopleBanner = () => dispatch(hide())

  return {
    alertPeopleBanner,
    hidePeopleBanner
  }
}

export default usePeopleBanner
