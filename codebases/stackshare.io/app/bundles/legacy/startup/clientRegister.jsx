import ReactOnRails from 'react-on-rails';
import registerComponents from '../../../../maharo';

import ListCompanyCustomers from '../components/companies/customers/listCompanyCustomers.jsx';
import DeleteCompanyModal from '../components/delete_company/delete_company_modal.jsx';
import IUseThis from '../components/i_use_this/i_use_this.jsx';
import DeleteUserModal from '../components/delete_user/delete_user_modal.jsx';

///////////////

import OnboardingRouter from '../components/onboarding/onboarding_router.jsx';
import StackEditRouter from '../components/stack-edit/stack-edit_router.jsx';
import CompanyMembership from '../components/company_membership/company_membership.jsx';
import MatchRouter from '../components/match/match_router.jsx';
import Percentage from '../components/stack-show/percentage.jsx';
import SoftApprovalContainer from '../components/services/soft_approval/soft_approval_container.jsx';
import Notifications from '../components/navbar/notifications.jsx';
import NavbarAvatar from '../components/navbar/navbar_avatar.jsx';
import Follow from '../components/follow/follow.jsx';
import Comments from '../components/comments/comments.jsx';
import Reasons from '../components/reasons/reasons.jsx';
import OnboardingWizardContainer from '../components/onboarding_wizard/onboarding-wizard_container';
import Typeahead from '../../../shared/library/inputs/typeahead';

registerComponents({
  Notifications,
  NavbarAvatar,
  Typeahead
});

ReactOnRails.register({
  ListCompanyCustomers,
  DeleteCompanyModal,
  IUseThis,
  DeleteUserModal,

  ////////////////

  OnboardingRouter,
  StackEditRouter,
  CompanyMembership,
  MatchRouter,
  Percentage,
  SoftApprovalContainer,
  Follow,
  Comments,
  Reasons,
  OnboardingWizardContainer
});
