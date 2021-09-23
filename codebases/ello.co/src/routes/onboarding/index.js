import { ONBOARDING_VERSION } from '../../constants/application_types'
import OnboardingCategoriesContainer from '../../containers/OnboardingCategoriesContainer'
import OnboardingCollaborateContainer from '../../containers/OnboardingCollaborateContainer'
import OnboardingCreatorTypeContainer from '../../containers/OnboardingCreatorTypeContainer'
import OnboardingSettingsContainer from '../../containers/OnboardingSettingsContainer'

export default (store) => {
  function onEnter(nextState, replace) {
    const state = store.getState()
    if (state.profile.get('webOnboardingVersion') === ONBOARDING_VERSION) {
      replace({ pathname: '/', state: nextState })
    }
  }

  return [
    {
      path: 'onboarding/creator-type',
      getComponent(location, cb) {
        cb(null, OnboardingCreatorTypeContainer)
      },
      onEnter,
    },
    {
      path: 'onboarding/categories',
      getComponent(location, cb) {
        cb(null, OnboardingCategoriesContainer)
      },
    },
    {
      path: 'onboarding/settings',
      getComponent(location, cb) {
        cb(null, OnboardingSettingsContainer)
      },
    },
    {
      path: 'onboarding/collaborate',
      getComponent(location, cb) {
        cb(null, OnboardingCollaborateContainer)
      },
    },
  ]
}

