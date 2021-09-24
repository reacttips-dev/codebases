import registerComponents from '../../../../maharo';
import HeaderNotice from '../components/header-notice/index.jsx';
// import HeadOverToDashboard from '../components/head-over-priv-dashboard/index.jsx';
import TOSUpdate from '../components/tos-update/index.jsx';
import Footer from '../components/footer';
import SecondaryFooter from '../components/second-footer';
import MarkdownHelp from '../components/markdown-help';
import JobsHomepage from '../components/jobs-homepage';
import PrivateStackshareCtaHomepage from '../components/private-stackshare-cta';
import AlternativesHomepage from '../components/alternatives-homepage';
import {SigninContent} from '../../../shared/library/modals/signin';
import SigninGlobalModal from '../components/signin/global';
import {withMobile} from '../../../shared/enhancers/mobile-enhancer';
import Advert from '../../../shared/library/advert/index.jsx';
import {withApolloContext} from '../../../shared/enhancers/graphql-enhancer';
import {NON_ADBLOCKED_AD_NAME} from '../../../shared/constants/settings';
import {privateMode} from '../../../data/shared/queries';
import {withPrivateMode} from '../../../shared/enhancers/private-mode-enchancer';
import {compose} from 'react-apollo';
import CtaStackBot from '../components/cta-stackbot/index.jsx';
import UsersBanner from '../../../shared/library/users-banner/index.jsx';

registerComponents({
  Footer: withPrivateMode(privateMode)(Footer),
  SecondaryFooter,
  AlternativesHomepage,
  JobsHomepage,
  PrivateStackshareCtaHomepage,
  HeaderNotice,
  Cta_stackbot: CtaStackBot,
  UsersBanner,
  // HeadOverToDashboard,
  TOSUpdate: withApolloContext(TOSUpdate),
  MarkdownHelp,
  SigninGlobalModal: compose(
    withMobile(false),
    withApolloContext
  )(SigninGlobalModal),
  SigninContent: withApolloContext(SigninContent),
  [NON_ADBLOCKED_AD_NAME]: withApolloContext(Advert)
});
