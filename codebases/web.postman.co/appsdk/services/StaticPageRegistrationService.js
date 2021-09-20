import { PageService } from './PageService';
import { DEFAULT_HOME_IDENTIFIER, DEFAULT_HOME_URL } from './../../onboarding/navigation/constants';

/**
 * Homepage manifest
 */
export default function () {
  const pages = [
    {
      name: DEFAULT_HOME_IDENTIFIER,
      title: 'Postman API Platform',
      description: 'Postman makes API development easy. Our platform offers the tools to simplify each step of the API building process and streamlines collaboration so you can create better APIs faster.',
      route: DEFAULT_HOME_URL,
      getView: () => import(/* webpackChunkName: "HomePageSignedOut" */'../../onboarding/src/features/Homepage/pages/HomepageSignedOut/HomePageSignedOut'),
      getController: () => import(/* webpackChunkName: "HomePageSignedOut" */'../../onboarding/src/features/Homepage/controllers/HomepageController')
    },
    {
      name: 'home',
      title: 'Postman API Platform',
      description: 'Postman makes API development easy. Our platform offers the tools to simplify each step of the API building process and streamlines collaboration so you can create better APIs faster.',
      route: 'home',
      getView: () => import(/* webpackChunkName: "HomePageSignedOut" */'../../onboarding/src/features/Homepage/pages/HomepageSignedOut/HomePageSignedOut'),
      getController: () => import(/* webpackChunkName: "HomePageSignedOut" */'../../onboarding/src/features/Homepage/controllers/HomepageController'),
      isEnabledInScratchpad: true
    }
  ];

  pages && pages.forEach(PageService.register);
}
